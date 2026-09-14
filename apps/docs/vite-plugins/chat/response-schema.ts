/**
 * The JSON Schema for CALL 1 (`output_config.format` on the first of the two
 * `client.messages.parse()` calls in handle-chat-request.ts). See that file's
 * header comment for why chart generation is split into two model calls; this
 * schema only ever produces `{reply, chart: {kind, intent, topic} | null}` —
 * a small, flat, non-discriminated object. It never describes `data` at all;
 * chart-data-schema.ts's per-kind schema does that in call 2, once `kind` is
 * already fixed.
 *
 * This flat shape is deliberate and empirically load-bearing: a 24-branch
 * discriminated union (`anyOf` keyed on `kind`), tried first for exactly this
 * `{kind, intent, topic}` payload, was rejected outright by Anthropic's API —
 * "The compiled grammar is too large ... Simplify your tool schemas or reduce
 * the number of strict tools." A flat object with plain enum fields has no
 * such problem. `additionalProperties: false` is pure hygiene here (stops the
 * model wasting tokens inventing fields we'd ignore), not a
 * misclassification guard — `intent` isn't narrowed per `kind` at the schema
 * level (also tried, also hit the same grammar-size wall), so
 * `chart-kinds.ts`'s `KIND_INTENTS` is prose-only guidance in
 * system-prompt.ts, and handle-chat-request.ts defensively clamps an invalid
 * (kind, intent) pair before making call 2.
 *
 * Every `const`/`enum` field still needs an explicit `type` too (an Anthropic
 * SDK requirement hit and fixed once already this session).
 */
import { jsonSchemaOutputFormat } from "@anthropic-ai/sdk/helpers/json-schema";
import { INTENTS } from "@commercetools/nimbus-viz";
import { CHAT_CHART_KINDS } from "./chart-kinds";

const CHAT_RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    reply: { type: "string" },
    chart: {
      anyOf: [
        { type: "null" },
        {
          type: "object",
          properties: {
            kind: { type: "string", enum: CHAT_CHART_KINDS },
            intent: { type: "string", enum: INTENTS },
            topic: { type: "string" },
          },
          required: ["kind", "intent", "topic"],
          additionalProperties: false,
        },
      ],
    },
  },
  required: ["reply", "chart"],
  additionalProperties: false,
} as const;

export const chatResponseFormat = jsonSchemaOutputFormat(CHAT_RESPONSE_SCHEMA);
