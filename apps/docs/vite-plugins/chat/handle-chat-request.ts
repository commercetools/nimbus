import type { IncomingMessage, ServerResponse } from "node:http";
import Anthropic from "@anthropic-ai/sdk";
import type { Intent } from "@commercetools/nimbus-viz";
import { getAnthropicClient, CHAT_MODEL } from "./anthropic-client";
import { CHAT_SYSTEM_PROMPT } from "./system-prompt";
import { chatResponseFormat } from "./response-schema";
import { chartDataFormatFor } from "./chart-data-schema";
import { buildDataSystemPrompt } from "./data-system-prompt";
import { KIND_INTENTS } from "./chart-kinds";
import type { ChatChartDescriptor } from "./chart-kinds";
import type {
  ChatApiRequest,
  ChatApiResponse,
  ChatApiError,
  ChatChartPayload,
  ChatWireMessage,
} from "./contract";

/**
 * Generating a chart is two sequential `client.messages.parse()` calls, not
 * one — a deliberate architecture, arrived at after two other designs were
 * tried and empirically failed against the live API this session:
 *
 * 1. A single call whose schema branched 24 ways on `kind` (one fully-typed
 *    `data` shape per kind) was rejected outright: "The compiled grammar is
 *    too large ... Simplify your tool schemas or reduce the number of strict
 *    tools." The original 5-kind version of this feature (git history around
 *    commit 1d10dc35e) used exactly this discriminated-union shape and it
 *    worked fine — so the failure tracks branch *count*, not per-branch
 *    complexity; 5 branches is fine, 24 is not.
 * 2. A single call with one flat (non-discriminated) schema and a genuinely
 *    untyped `data: {type: "array"}` (no `items` key — the one way to avoid
 *    branching while still letting each kind's shape vary) compiled fine, but
 *    produced garbage: the model returned `data: ["", ""]` for a "category"
 *    chart. There is no schema-level way to express "any type" anywhere in
 *    this API — every node needs an explicit `type` — so a single field
 *    cannot carry 24 different real shapes without either branching (design
 *    1) or being too vague to use (design 2).
 *
 * The fix: split into two calls so neither problem applies. Call 1
 * (response-schema.ts + system-prompt.ts) picks `{kind, intent, topic}` from
 * a small FLAT schema — never branches, so design 1's wall doesn't apply.
 * Call 2 (chart-data-schema.ts + data-system-prompt.ts) is made only once
 * `kind` is fixed, using a schema scoped to that ONE kind — it only ever
 * describes a single shape, so it can be as strictly, fully typed as the
 * original 5-kind design was, for all 24 kinds.
 *
 * This also directly fixes the bug that motivated the whole redesign: call 2
 * is given call 1's already-drafted `reply` text as grounding, so the
 * invented data's labels are asked to match what the user already read,
 * rather than being generated from an unrelated, disconnected code path (see
 * response-schema.ts's header comment for that history).
 */

/** Vite's dev-server middleware is plain Connect — no body parser is wired up
 * anywhere in this app, so read+parse it by hand. */
async function readJsonBody(req: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(chunk as Buffer);
  }
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : undefined;
}

function isChatWireMessage(value: unknown): value is ChatWireMessage {
  if (!value || typeof value !== "object") return false;
  const { role, text } = value as Partial<ChatWireMessage>;
  return (role === "user" || role === "assistant") && typeof text === "string";
}

function isChatApiRequest(value: unknown): value is ChatApiRequest {
  if (!value || typeof value !== "object") return false;
  const { messages } = value as Partial<ChatApiRequest>;
  return (
    Array.isArray(messages) &&
    messages.length > 0 &&
    messages.every(isChatWireMessage)
  );
}

function sendJson(res: ServerResponse, status: number, body: unknown): void {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

function sendError(res: ServerResponse, status: number, message: string): void {
  const body: ChatApiError = { error: message };
  sendJson(res, status, body);
}

/** The schema can't narrow `intent`'s enum per `kind` (also hit the
 * branch-count wall when tried), so an LLM-picked intent that no canonical
 * registry entry actually serves for this kind is replaced with the first
 * one `chart-kinds.ts`'s `KIND_INTENTS` lists for it — otherwise
 * nimbus-viz's `resolve()` would just rank the eventual chart worse than
 * necessary (resolve() treats intent as a soft preference, not a hard
 * requirement), and call 2's prompt would be grounded in an intent no chart
 * for this kind actually honors. */
function clampDescriptor(
  descriptor: ChatChartDescriptor | null
): ChatChartDescriptor | null {
  if (!descriptor) return null;
  const validIntents = KIND_INTENTS[descriptor.kind] as Intent[] | undefined;
  if (!validIntents || validIntents.includes(descriptor.intent)) {
    return descriptor;
  }
  return { ...descriptor, intent: validIntents[0] };
}

/** Call 2: turn a fixed `{kind, intent, topic}` plus the already-drafted
 * reply into the actual chart payload. Degrades to no chart (never fails the
 * whole turn) on a refusal, an unparseable response, or an API error — the
 * reply text is still worth delivering on its own, and this call only ever
 * runs after call 1 already proved credentials/connectivity are fine, so a
 * failure here is most likely transient. */
async function generateChartData(
  client: Anthropic,
  descriptor: ChatChartDescriptor,
  reply: string
): Promise<ChatChartPayload | null> {
  try {
    const response = await client.messages.parse({
      model: CHAT_MODEL,
      max_tokens: 4096,
      system: buildDataSystemPrompt(descriptor, reply),
      // Deliberately NOT a fixed literal string: whatever fulfills requests
      // for subscription-based auth (`ant auth login`, see
      // anthropic-client.ts) appears to cache/replay responses keyed on
      // (model, messages) alone, ignoring `system`/`output_config` — with a
      // fixed generic trigger message here, every call 2 request across
      // every kind and topic shared one cache key, so every second call
      // returned the exact same cached completion regardless of what was
      // actually asked for (confirmed live: identical `message.id`, subject,
      // and content for two genuinely different topics/kinds). Embedding the
      // kind/topic in the user turn too makes every request's cache key
      // distinct, in addition to being redundant-but-harmless grounding for
      // the model itself.
      messages: [
        {
          role: "user",
          content: `Generate the chart data for a "${descriptor.kind}" chart about: ${descriptor.topic}`,
        },
      ],
      output_config: { format: chartDataFormatFor(descriptor.kind) },
    });
    if (response.stop_reason === "refusal" || !response.parsed_output) {
      return null;
    }
    const { data, options } = response.parsed_output as {
      data: unknown;
      options?: Record<string, unknown>;
    };
    return {
      kind: descriptor.kind,
      intent: descriptor.intent,
      data,
      options,
    } as ChatChartPayload;
  } catch (err) {
    console.error(
      "[chat-api] call 2 (chart data) failed; returning the reply without a chart",
      err
    );
    return null;
  }
}

export async function handleChatRequest(
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> {
  let body: unknown;
  try {
    body = await readJsonBody(req);
  } catch {
    sendError(res, 400, "Malformed JSON request body.");
    return;
  }

  if (!isChatApiRequest(body)) {
    sendError(
      res,
      400,
      'Request body must be { messages: { role: "user"|"assistant", text: string }[] }, with at least one message.'
    );
    return;
  }

  // Replay only the previous turn's reply text for assistant history, never
  // the structured chart JSON — keeps history natural-language rather than
  // re-injecting large payloads or forcing the model to reconcile a prior
  // structured turn with a plain-string replay.
  const messages: Anthropic.MessageParam[] = body.messages.map((m) => ({
    role: m.role,
    content: m.text,
  }));

  const client = getAnthropicClient();

  try {
    const response = await client.messages.parse({
      model: CHAT_MODEL,
      max_tokens: 4096,
      system: CHAT_SYSTEM_PROMPT,
      messages,
      output_config: { format: chatResponseFormat },
    });

    if (response.stop_reason === "refusal") {
      sendError(res, 503, "The assistant declined to answer that question.");
      return;
    }
    if (!response.parsed_output) {
      sendError(
        res,
        502,
        "The assistant's response could not be parsed as JSON."
      );
      return;
    }

    const descriptor = clampDescriptor(
      response.parsed_output.chart as ChatChartDescriptor | null
    );
    const reply = response.parsed_output.reply;
    const payload: ChatApiResponse = {
      reply,
      chart: descriptor
        ? await generateChartData(client, descriptor, reply)
        : null,
    };
    sendJson(res, 200, payload);
  } catch (err) {
    // Most-specific-first: string-matching error messages would lose the
    // retryable/non-retryable distinction the SDK's typed classes carry —
    // except the "no credentials at all" case below, which the SDK throws as
    // a plain, untyped Error *before* any request goes out (client.mjs's
    // validateHeaders), so there is no typed class to catch. Matched on its
    // stable, hard-coded message rather than left to fall through to a
    // generic 500.
    const noCredentials =
      err instanceof Error &&
      err.message.includes("Could not resolve authentication method");

    if (noCredentials || err instanceof Anthropic.AuthenticationError) {
      sendError(
        res,
        401,
        "No Anthropic credentials found. Run `ant auth login`, or set ANTHROPIC_API_KEY in apps/docs/.env.local."
      );
    } else if (err instanceof Anthropic.RateLimitError) {
      sendError(
        res,
        429,
        "Rate limited by the Anthropic API — try again in a moment."
      );
    } else if (err instanceof Anthropic.APIError) {
      sendError(res, 502, `Anthropic API error: ${err.message}`);
    } else {
      console.error("[chat-api] unexpected error handling /api/chat", err);
      sendError(res, 500, "Unexpected server error.");
    }
  }
}
