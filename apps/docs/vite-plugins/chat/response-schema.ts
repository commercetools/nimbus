/**
 * The JSON Schema handed to Anthropic's structured-outputs feature
 * (`output_config.format`), via `jsonSchemaOutputFormat()`. This is the real
 * enforcement mechanism behind the curated-DataKind design in contract.ts:
 * nimbus-viz's classifier (`deriveFacts`/`detectKind`,
 * packages/nimbus-viz/src/selection/derive-facts.ts) sniffs `data`'s shape
 * order-sensitively, so `additionalProperties: false` on every variant below
 * is what stops the model from emitting a stray field (e.g. `segments` on a
 * `category` row) that could tip the classifier into the wrong branch — the
 * system prompt's prose (system-prompt.ts) is secondary reinforcement, not
 * the enforcement itself.
 *
 * Array-size bounds (e.g. "5-30 points") are NOT expressible here — Anthropic's
 * structured outputs don't support `minItems`/`maxItems` — so those ranges are
 * asked for in the system prompt instead, not enforced by this schema.
 */
import { jsonSchemaOutputFormat } from "@anthropic-ai/sdk/helpers/json-schema";

const scalarChart = {
  type: "object",
  properties: {
    kind: { type: "string", const: "scalar" },
    intent: { type: "string", const: "VALUE" },
    data: { type: "number" },
    options: {
      type: "object",
      properties: { target: { type: "number" } },
      required: [],
      additionalProperties: false,
    },
  },
  required: ["kind", "intent", "data"],
  additionalProperties: false,
} as const;

const seriesChart = {
  type: "object",
  properties: {
    kind: { type: "string", const: "series" },
    intent: { type: "string", enum: ["TREND", "COMP-TIME"] },
    data: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          label: { type: "string" },
          data: {
            type: "array",
            items: {
              type: "object",
              properties: {
                x: { type: "string", format: "date" },
                y: { anyOf: [{ type: "number" }, { type: "null" }] },
              },
              required: ["x", "y"],
              additionalProperties: false,
            },
          },
        },
        required: ["id", "label", "data"],
        additionalProperties: false,
      },
    },
  },
  required: ["kind", "intent", "data"],
  additionalProperties: false,
} as const;

const categoryChart = {
  type: "object",
  properties: {
    kind: { type: "string", const: "category" },
    intent: { type: "string", enum: ["RANK", "COMPARE", "PART-WHOLE", "DIST"] },
    data: {
      type: "array",
      items: {
        type: "object",
        properties: {
          category: { type: "string" },
          value: { type: "number" },
        },
        required: ["category", "value"],
        additionalProperties: false,
      },
    },
    options: {
      type: "object",
      properties: { target: { type: "number" } },
      required: [],
      additionalProperties: false,
    },
  },
  required: ["kind", "intent", "data"],
  additionalProperties: false,
} as const;

const funnelChart = {
  type: "object",
  properties: {
    kind: { type: "string", const: "funnel" },
    intent: { type: "string", const: "FLOW" },
    data: {
      type: "array",
      items: {
        type: "object",
        properties: {
          stage: { type: "string" },
          value: { type: "number" },
        },
        required: ["stage", "value"],
        additionalProperties: false,
      },
    },
  },
  required: ["kind", "intent", "data"],
  additionalProperties: false,
} as const;

const scatterChart = {
  type: "object",
  properties: {
    kind: { type: "string", const: "scatter" },
    intent: { type: "string", const: "REL" },
    data: {
      type: "array",
      items: {
        type: "object",
        properties: {
          x: { type: "number" },
          y: { type: "number" },
          label: { type: "string" },
          group: { type: "string" },
        },
        required: ["x", "y"],
        additionalProperties: false,
      },
    },
  },
  required: ["kind", "intent", "data"],
  additionalProperties: false,
} as const;

const CHAT_RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    reply: { type: "string" },
    chart: {
      anyOf: [
        { type: "null" },
        scalarChart,
        seriesChart,
        categoryChart,
        funnelChart,
        scatterChart,
      ],
    },
  },
  required: ["reply", "chart"],
  additionalProperties: false,
} as const;

export const chatResponseFormat = jsonSchemaOutputFormat(CHAT_RESPONSE_SCHEMA);
