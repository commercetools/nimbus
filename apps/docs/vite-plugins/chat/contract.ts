/**
 * Wire contract between the docs SPA's chat widget and the dev-only /api/chat
 * endpoint (see vite-plugin-chat-api.ts). Type-only — nothing here is runtime
 * code, so a client-side `import type` of this file is erased at build time
 * and never pulls the Anthropic-SDK-touching code into the browser bundle.
 *
 * The Messages API is stateless, so the browser resends the full transcript on
 * every call. Assistant history entries replay only the previous turn's
 * `reply` text (never the structured chart payload) — see handle-chat-request.ts
 * for why.
 */
import type {
  BoxPlotGroupStats,
  BubblePoint,
  BulletDatum,
  CalendarDatum,
  CategoryDatum,
  DumbbellRow,
  FlowGraph,
  FlowMatrix,
  FunnelStage,
  HeatRow,
  Intent,
  ParallelRow,
  RadarSeries,
  RfmCell,
  SampleGroup,
  ScatterPoint,
  SlopeRow,
  StackRow,
  TreemapNode,
  WaterfallStep,
} from "@commercetools/nimbus-viz";
import type { ChatChartKind } from "./chart-kinds";

export interface ChatWireMessage {
  role: "user" | "assistant";
  text: string;
}

export interface ChatApiRequest {
  messages: ChatWireMessage[];
}

/**
 * `data`'s wire shape per kind. Reuses nimbus-viz's own exported concrete
 * types directly wherever the wire format matches exactly. `series`, `ohlc`,
 * and `timeline-events` carry Date-typed fields in nimbus-viz's own types
 * (`SeriesPoint.x`, `OhlcBar.date`, `TimelineEvent.start`/`end`) — JSON has no
 * Date type, so these three get hand-rolled wire variants with `string` in
 * place of `Date`; the client revives them (`use-chat-widget.ts`'s
 * `reviveChartDates()`). `calendar`'s `CalendarDatum.date: Date | string`
 * already accepts a string natively, so it needs no override.
 *
 * Extending chart coverage to a new DataKind touches: `chart-kinds.ts`'s
 * `CHAT_CHART_KINDS`, its wire shape here, a guidance entry in
 * `system-prompt.ts`'s `KIND_GUIDANCE` (call 1's kind/intent table), a new
 * schema in `chart-data-schema.ts`'s `CHART_DATA_JSON_SCHEMAS`, and a
 * matching shape description in `data-system-prompt.ts`'s
 * `KIND_DATA_GUIDANCE` (call 2). The compiler enforces the last two via
 * exhaustiveness checks — both are typed `Record<ChatChartKind, ...>`.
 */
interface ChatChartDataByKind {
  scalar: number;
  series: Array<{
    id: string;
    label: string;
    data: Array<{ x: string; y: number | null }>;
  }>;
  category: CategoryDatum[];
  "stack-row": StackRow[];
  scatter: ScatterPoint[];
  "heat-row": HeatRow[];
  funnel: FunnelStage[];
  "slope-row": SlopeRow[];
  "dumbbell-row": DumbbellRow[];
  bubble: BubblePoint[];
  "radar-series": RadarSeries[];
  "parallel-row": ParallelRow[];
  calendar: CalendarDatum[];
  rfm: RfmCell[];
  samples: number[];
  "box-group": BoxPlotGroupStats[];
  "delta-steps": WaterfallStep[];
  "bullet-row": BulletDatum[];
  "flow-graph": FlowGraph;
  hierarchy: TreemapNode;
  "sample-groups": SampleGroup[];
  ohlc: Array<{
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
  }>;
  "timeline-events": Array<{
    label: string;
    start: string;
    end?: string;
    category?: string;
  }>;
  "flow-matrix": FlowMatrix;
}

/** The fully-concrete chart payload sent to the browser. The LLM authors
 * `data`/`options` directly, in a second model call made once `kind` is
 * already fixed (`chart-data-schema.ts`, `data-system-prompt.ts` — see
 * handle-chat-request.ts's header comment for why chart generation is two
 * sequential calls instead of one). This is exactly the shape that second
 * call's per-kind schema enforces. */
export type ChatChartPayload = {
  [K in ChatChartKind]: {
    kind: K;
    intent: Intent;
    data: ChatChartDataByKind[K];
    options?: Record<string, unknown>;
  };
}[ChatChartKind];

export interface ChatApiResponse {
  reply: string;
  chart: ChatChartPayload | null;
}

export interface ChatApiError {
  error: string;
}
