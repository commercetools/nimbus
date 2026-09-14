import type { IncomingMessage, ServerResponse } from "node:http";
import Anthropic from "@anthropic-ai/sdk";
import { getAnthropicClient, CHAT_MODEL } from "./anthropic-client";
import { CHAT_SYSTEM_PROMPT } from "./system-prompt";
import { chatResponseFormat } from "./response-schema";
import type {
  ChatApiRequest,
  ChatApiResponse,
  ChatApiError,
  ChatWireMessage,
} from "./contract";

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

    const payload: ChatApiResponse = {
      reply: response.parsed_output.reply,
      chart: response.parsed_output.chart as ChatApiResponse["chart"],
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
