/**
 * The universe of nimbus-viz DataKinds the chat widget can generate charts
 * for, plus which Intent(s) each kind can be requested with — computed live
 * from nimbus-viz's own chartRegistry so this can never drift out of sync as
 * the registry grows (packages/nimbus-viz/docs/06-selection-algorithm.md's
 * own "Open contracts" section flags exactly this kind of table as prone to
 * staleness when hand-maintained).
 *
 * Server-only: imported for real (not `import type`) by response-schema.ts,
 * system-prompt.ts, chart-data-schema.ts, data-system-prompt.ts, and
 * handle-chat-request.ts — all Vite-plugin files that only ever run in the
 * dev server's Node process (see anthropic-client.ts's header comment for the
 * "never reaches the client bundle" invariant this directory maintains).
 * contract.ts only takes `import type { ChatChartKind }` from here, which is
 * erased at build.
 */
import { chartRegistry, INTENTS } from "@commercetools/nimbus-viz";
import type { DataKind, Intent } from "@commercetools/nimbus-viz";

/**
 * Every DataKind this feature covers — every concrete kind nimbus-viz has,
 * except the "unknown" sentinel. Hand-maintained (NOT derived from the
 * registry): a developer extends this array, in lockstep with a new shape
 * entry in contract.ts's `ChatChartDataByKind` and a new guidance entry in
 * system-prompt.ts's `KIND_GUIDANCE`, whenever nimbus-viz adds a new kind —
 * the registry only tells us which intents an EXISTING kind serves (below),
 * not which kinds exist to generate for in the first place. The `satisfies`
 * clause makes the compiler flag this list the moment it diverges from
 * nimbus-viz's actual DataKind union.
 */
export const CHAT_CHART_KINDS = [
  "series",
  "category",
  "stack-row",
  "scatter",
  "heat-row",
  "funnel",
  "slope-row",
  "dumbbell-row",
  "bubble",
  "radar-series",
  "parallel-row",
  "calendar",
  "rfm",
  "samples",
  "box-group",
  "delta-steps",
  "bullet-row",
  "flow-graph",
  "hierarchy",
  "scalar",
  "sample-groups",
  "ohlc",
  "timeline-events",
  "flow-matrix",
] as const satisfies readonly Exclude<DataKind, "unknown">[];

export type ChatChartKind = (typeof CHAT_CHART_KINDS)[number];

/**
 * Call 1's entire output for a chart: which kind, which intent, and a short
 * natural-language topic phrase — see handle-chat-request.ts's header
 * comment for why chart generation is split into two sequential model calls.
 * Call 2 (chart-data-schema.ts + data-system-prompt.ts) turns this into the
 * actual `data`/`options`.
 */
export interface ChatChartDescriptor {
  kind: ChatChartKind;
  intent: Intent;
  topic: string;
}

/**
 * Which Intents each kind can plausibly be requested with, derived from the
 * LIVE chartRegistry: only CANONICAL entries count, since bare `resolve()` —
 * what every chat-generated chart goes through — only ever ranks canonical
 * entries (packages/nimbus-viz/src/selection/resolve.tsx filters
 * `entry.canonical === false` out before scoring). Computed once at module
 * load, not per request.
 */
export const KIND_INTENTS: Record<ChatChartKind, Intent[]> = (() => {
  const sets = new Map<ChatChartKind, Set<Intent>>(
    CHAT_CHART_KINDS.map((kind) => [kind, new Set<Intent>()])
  );
  for (const entry of chartRegistry.values()) {
    if (entry.canonical === false) continue;
    for (const kind of entry.dataKinds) {
      const set = sets.get(kind as ChatChartKind);
      if (!set) continue; // a DataKind this feature doesn't cover (yet).
      for (const tag of entry.metadata.intents) set.add(tag.intent);
    }
  }
  const table = {} as Record<ChatChartKind, Intent[]>;
  for (const kind of CHAT_CHART_KINDS) {
    const found = [...(sets.get(kind) ?? [])];
    // Defensive fallback: a JSON Schema enum can't be empty. Only triggers if
    // a future nimbus-viz registry change ever drops every canonical entry
    // for a kind this feature still lists — degrades that one kind to the
    // full intent set (prose-guided only) rather than breaking schema
    // construction.
    table[kind] = found.length > 0 ? found : [...INTENTS];
  }
  return table;
})();
