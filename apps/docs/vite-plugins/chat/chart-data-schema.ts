/**
 * Per-kind JSON Schemas for CALL 2 — the second of the two
 * `client.messages.parse()` calls in handle-chat-request.ts, made only after
 * call 1 (response-schema.ts) has already fixed `kind`. Each schema below
 * describes `{data, options}` for exactly ONE `ChatChartKind`, with real,
 * strict, per-field types — the same rigor the original 5-kind design used
 * (git history around commit 1d10dc35e), just picked at request time instead
 * of declared as 5 static alternatives.
 *
 * This exists because a single schema covering all 24 kinds at once is not
 * achievable at all, for two independent, empirically-confirmed reasons (see
 * handle-chat-request.ts's header comment for the full story):
 * 1. A 24-branch discriminated union (`anyOf` keyed on `kind`) is rejected
 *    outright by Anthropic's API as too large a compiled grammar — even with
 *    tiny per-branch schemas. Only ONE call ever declares more than 1
 *    kind (call 1, whose branches carry no data), so this is never hit.
 * 2. There's no schema-level way to say "any object" or "any array element" —
 *    every schema node needs an explicit `type`, and any `type: "object"`
 *    needs an explicit, closed `properties` list to accept real content
 *    (confirmed live: a genuinely untyped `{type:"array"}` with no `items`
 *    produced garbage — the model emitted `["", ""]` for a `category`
 *    chart). So every kind needs its OWN fully-typed schema; there is no
 *    generic fallback.
 *
 * `parallel-row` is the one kind whose real shape uses dynamic, per-question
 * keys (`values: {price, margin, ...}`) — also not expressible (object
 * schemas can't have open keys either). Solved by fixing `values`'s keys to
 * generic `v1`-`v4` regardless of topic; `options.dimensions` maps each back
 * to a human label, which is all the renderer actually needs — nimbus-viz
 * reads `row.values[dim.key]`, so the key names themselves carry no meaning.
 *
 * `hierarchy`'s tree is NOT true recursion: a self-referencing `$ref`
 * (pointing a `$defs` entry at itself) is rejected outright by Anthropic's
 * API — "Circular reference detected in schema definitions ...
 * Self-referencing or mutually-referencing definitions are not supported"
 * (confirmed live). So the tree is fixed at exactly 2 levels, spelled out
 * explicitly instead — see `hierarchySchema`'s own comment.
 */
import { jsonSchemaOutputFormat } from "@anthropic-ai/sdk/helpers/json-schema";
import { CHAT_CHART_KINDS } from "./chart-kinds";
import type { ChatChartKind } from "./chart-kinds";

const str = { type: "string" } as const;
const num = { type: "number" } as const;
const strArray = { type: "array", items: str } as const;
const numArray = { type: "array", items: num } as const;
const numOrNull = { anyOf: [num, { type: "null" }] } as const;

const scalarSchema = {
  type: "object",
  properties: {
    data: num,
    options: {
      type: "object",
      properties: {
        min: num,
        max: num,
        threshold: num,
        label: str,
        previous: num,
      },
      required: [],
      additionalProperties: false,
    },
  },
  required: ["data"],
  additionalProperties: false,
} as const;

const seriesSchema = {
  type: "object",
  properties: {
    data: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: str,
          label: str,
          data: {
            type: "array",
            items: {
              type: "object",
              properties: { x: str, y: numOrNull },
              required: ["x", "y"],
              additionalProperties: false,
            },
          },
        },
        required: ["id", "label", "data"],
        additionalProperties: false,
      },
    },
    options: {
      type: "object",
      properties: { target: num, rangeLow: num, rangeHigh: num },
      required: [],
      additionalProperties: false,
    },
  },
  required: ["data"],
  additionalProperties: false,
} as const;

const categorySchema = {
  type: "object",
  properties: {
    data: {
      type: "array",
      items: {
        type: "object",
        properties: { category: str, value: num },
        required: ["category", "value"],
        additionalProperties: false,
      },
    },
    options: {
      type: "object",
      properties: { target: num },
      required: [],
      additionalProperties: false,
    },
  },
  required: ["data"],
  additionalProperties: false,
} as const;

const stackRowSchema = {
  type: "object",
  properties: {
    data: {
      type: "array",
      items: {
        type: "object",
        properties: {
          category: str,
          segments: {
            type: "array",
            items: {
              type: "object",
              properties: { key: str, value: num },
              required: ["key", "value"],
              additionalProperties: false,
            },
          },
        },
        required: ["category", "segments"],
        additionalProperties: false,
      },
    },
  },
  required: ["data"],
  additionalProperties: false,
} as const;

const scatterSchema = {
  type: "object",
  properties: {
    data: {
      type: "array",
      items: {
        type: "object",
        properties: { x: num, y: num, label: str, group: str },
        required: ["x", "y"],
        additionalProperties: false,
      },
    },
  },
  required: ["data"],
  additionalProperties: false,
} as const;

const heatRowSchema = {
  type: "object",
  properties: {
    data: {
      type: "array",
      items: {
        type: "object",
        properties: { label: str, values: numArray },
        required: ["label", "values"],
        additionalProperties: false,
      },
    },
    options: {
      type: "object",
      properties: { columnLabels: strArray, periodLabels: strArray },
      required: [],
      additionalProperties: false,
    },
  },
  required: ["data"],
  additionalProperties: false,
} as const;

const funnelSchema = {
  type: "object",
  properties: {
    data: {
      type: "array",
      items: {
        type: "object",
        properties: { stage: str, value: num },
        required: ["stage", "value"],
        additionalProperties: false,
      },
    },
  },
  required: ["data"],
  additionalProperties: false,
} as const;

const slopeRowSchema = {
  type: "object",
  properties: {
    data: {
      type: "array",
      items: {
        type: "object",
        properties: { id: str, label: str, left: num, right: num },
        required: ["id", "label", "left", "right"],
        additionalProperties: false,
      },
    },
    options: {
      type: "object",
      properties: { leftLabel: str, rightLabel: str },
      required: [],
      additionalProperties: false,
    },
  },
  required: ["data"],
  additionalProperties: false,
} as const;

const dumbbellRowSchema = {
  type: "object",
  properties: {
    data: {
      type: "array",
      items: {
        type: "object",
        properties: { category: str, start: num, end: num },
        required: ["category", "start", "end"],
        additionalProperties: false,
      },
    },
    options: {
      type: "object",
      properties: { startLabel: str, endLabel: str },
      required: [],
      additionalProperties: false,
    },
  },
  required: ["data"],
  additionalProperties: false,
} as const;

const bubbleSchema = {
  type: "object",
  properties: {
    data: {
      type: "array",
      items: {
        type: "object",
        properties: { x: num, y: num, size: num, label: str, group: str },
        required: ["x", "y", "size", "label"],
        additionalProperties: false,
      },
    },
  },
  required: ["data"],
  additionalProperties: false,
} as const;

const radarSeriesSchema = {
  type: "object",
  properties: {
    data: {
      type: "array",
      items: {
        type: "object",
        properties: { id: str, label: str, values: numArray },
        required: ["id", "label", "values"],
        additionalProperties: false,
      },
    },
    options: {
      type: "object",
      properties: { axes: strArray },
      required: [],
      additionalProperties: false,
    },
  },
  required: ["data"],
  additionalProperties: false,
} as const;

// `values`'s keys are fixed generic identifiers, not the question's real
// dimension names — see this file's header comment. `options.dimensions`
// carries the human labels.
const parallelRowSchema = {
  type: "object",
  properties: {
    data: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: str,
          group: str,
          values: {
            type: "object",
            properties: { v1: num, v2: num, v3: num, v4: num },
            required: ["v1", "v2", "v3", "v4"],
            additionalProperties: false,
          },
        },
        required: ["id", "values"],
        additionalProperties: false,
      },
    },
    options: {
      type: "object",
      properties: {
        dimensions: {
          type: "array",
          items: {
            type: "object",
            properties: {
              key: { type: "string", enum: ["v1", "v2", "v3", "v4"] },
              label: str,
            },
            required: ["key", "label"],
            additionalProperties: false,
          },
        },
      },
      required: ["dimensions"],
      additionalProperties: false,
    },
  },
  required: ["data", "options"],
  additionalProperties: false,
} as const;

const calendarSchema = {
  type: "object",
  properties: {
    data: {
      type: "array",
      items: {
        type: "object",
        properties: { date: str, value: num },
        required: ["date", "value"],
        additionalProperties: false,
      },
    },
  },
  required: ["data"],
  additionalProperties: false,
} as const;

const rfmSchema = {
  type: "object",
  properties: {
    data: {
      type: "array",
      items: {
        type: "object",
        properties: {
          recency: num,
          frequency: num,
          count: num,
          value: num,
        },
        required: ["recency", "frequency", "count", "value"],
        additionalProperties: false,
      },
    },
  },
  required: ["data"],
  additionalProperties: false,
} as const;

const samplesSchema = {
  type: "object",
  properties: { data: numArray },
  required: ["data"],
  additionalProperties: false,
} as const;

const boxGroupSchema = {
  type: "object",
  properties: {
    data: {
      type: "array",
      items: {
        type: "object",
        properties: {
          label: str,
          min: num,
          firstQuartile: num,
          median: num,
          thirdQuartile: num,
          max: num,
          outliers: numArray,
        },
        required: [
          "label",
          "min",
          "firstQuartile",
          "median",
          "thirdQuartile",
          "max",
          "outliers",
        ],
        additionalProperties: false,
      },
    },
  },
  required: ["data"],
  additionalProperties: false,
} as const;

const deltaStepsSchema = {
  type: "object",
  properties: {
    data: {
      type: "array",
      items: {
        type: "object",
        properties: { label: str, value: num, isTotal: { type: "boolean" } },
        required: ["label", "value"],
        additionalProperties: false,
      },
    },
  },
  required: ["data"],
  additionalProperties: false,
} as const;

const bulletRowSchema = {
  type: "object",
  properties: {
    data: {
      type: "array",
      items: {
        type: "object",
        properties: {
          label: str,
          measure: num,
          target: num,
          ranges: numArray,
        },
        required: ["label", "measure", "target", "ranges"],
        additionalProperties: false,
      },
    },
  },
  required: ["data"],
  additionalProperties: false,
} as const;

const flowGraphSchema = {
  type: "object",
  properties: {
    data: {
      type: "object",
      properties: {
        nodes: {
          type: "array",
          items: {
            type: "object",
            properties: { name: str },
            required: ["name"],
            additionalProperties: false,
          },
        },
        links: {
          type: "array",
          items: {
            type: "object",
            properties: { source: num, target: num, value: num },
            required: ["source", "target", "value"],
            additionalProperties: false,
          },
        },
      },
      required: ["nodes", "links"],
      additionalProperties: false,
    },
  },
  required: ["data"],
  additionalProperties: false,
} as const;

// True recursion (`$ref` pointing back at its own `$defs` entry) is rejected
// outright by Anthropic's structured-outputs API: "Circular reference
// detected in schema definitions ... Self-referencing or mutually-referencing
// definitions are not supported" (confirmed live). So the tree is a fixed 2
// levels, spelled out explicitly rather than truly recursive: the root is
// always a branch (name + children); each child is EITHER a leaf (name +
// value) OR a branch one level deep (name + children, whose own children are
// always leaves) — matching data-system-prompt.ts's guidance exactly.
const leafNode = {
  type: "object",
  properties: { name: str, value: num },
  required: ["name", "value"],
  additionalProperties: false,
} as const;

const hierarchySchema = {
  type: "object",
  properties: {
    data: {
      type: "object",
      properties: {
        name: str,
        children: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: str,
              value: num,
              children: { type: "array", items: leafNode },
            },
            required: ["name"],
            additionalProperties: false,
          },
        },
      },
      required: ["name", "children"],
      additionalProperties: false,
    },
  },
  required: ["data"],
  additionalProperties: false,
} as const;

const sampleGroupsSchema = {
  type: "object",
  properties: {
    data: {
      type: "array",
      items: {
        type: "object",
        properties: { label: str, samples: numArray },
        required: ["label", "samples"],
        additionalProperties: false,
      },
    },
  },
  required: ["data"],
  additionalProperties: false,
} as const;

const ohlcSchema = {
  type: "object",
  properties: {
    data: {
      type: "array",
      items: {
        type: "object",
        properties: {
          date: str,
          open: num,
          high: num,
          low: num,
          close: num,
        },
        required: ["date", "open", "high", "low", "close"],
        additionalProperties: false,
      },
    },
  },
  required: ["data"],
  additionalProperties: false,
} as const;

const timelineEventsSchema = {
  type: "object",
  properties: {
    data: {
      type: "array",
      items: {
        type: "object",
        properties: { label: str, start: str, end: str, category: str },
        required: ["label", "start"],
        additionalProperties: false,
      },
    },
  },
  required: ["data"],
  additionalProperties: false,
} as const;

const flowMatrixSchema = {
  type: "object",
  properties: {
    data: {
      type: "object",
      properties: {
        labels: strArray,
        matrix: { type: "array", items: numArray },
      },
      required: ["labels", "matrix"],
      additionalProperties: false,
    },
  },
  required: ["data"],
  additionalProperties: false,
} as const;

/** Exhaustiveness-checked: TypeScript errors if a `ChatChartKind` is missing
 * a schema here. */
const CHART_DATA_JSON_SCHEMAS: Record<ChatChartKind, object> = {
  scalar: scalarSchema,
  series: seriesSchema,
  category: categorySchema,
  "stack-row": stackRowSchema,
  scatter: scatterSchema,
  "heat-row": heatRowSchema,
  funnel: funnelSchema,
  "slope-row": slopeRowSchema,
  "dumbbell-row": dumbbellRowSchema,
  bubble: bubbleSchema,
  "radar-series": radarSeriesSchema,
  "parallel-row": parallelRowSchema,
  calendar: calendarSchema,
  rfm: rfmSchema,
  samples: samplesSchema,
  "box-group": boxGroupSchema,
  "delta-steps": deltaStepsSchema,
  "bullet-row": bulletRowSchema,
  "flow-graph": flowGraphSchema,
  hierarchy: hierarchySchema,
  "sample-groups": sampleGroupsSchema,
  ohlc: ohlcSchema,
  "timeline-events": timelineEventsSchema,
  "flow-matrix": flowMatrixSchema,
};

// Each value in CHART_DATA_JSON_SCHEMAS is independently `as const`-typed;
// jsonSchemaOutputFormat's parameter type doesn't unify cleanly across the 24
// distinct literal shapes once erased to `object` for the Record above.
const CHART_DATA_FORMATS = Object.fromEntries(
  CHAT_CHART_KINDS.map((kind) => [
    kind,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jsonSchemaOutputFormat(CHART_DATA_JSON_SCHEMAS[kind] as any),
  ])
) as Record<ChatChartKind, ReturnType<typeof jsonSchemaOutputFormat>>;

/** The call-2 structured-output format for one already-chosen kind. */
export function chartDataFormatFor(kind: ChatChartKind) {
  return CHART_DATA_FORMATS[kind];
}
