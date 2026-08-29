import type { ReactNode } from "react";

/**
 * The selection engine's public type contract. Everything here is the
 * machine-readable surface an agent (or the docs/06 resolver) keys off.
 *
 * See:
 *   - docs/02 — the 15-intent × 13-shape taxonomies (mirrored below, verbatim).
 *   - docs/06 — the selection-metadata fields and the filter → rank → tie-break
 *     pipeline these types feed.
 */

/* -------------------------------------------------------------------------- */
/* Intent taxonomy (docs/02 — exactly 15)                                     */
/* -------------------------------------------------------------------------- */

/**
 * The 15 question-intents from docs/02. The agent maps natural language to one
 * of these; the resolver maps (intent × data facts) to a chart. Hyphens are
 * kept from the doc verbatim (`PART-WHOLE`, `COMP-TIME`) — they are legal in
 * string-literal types.
 */
export type Intent =
  | "TREND" // Is it trending over time?
  | "DELTA" // How much did it change (signed)?
  | "RANK" // Where does it rank?
  | "PART-WHOLE" // What is it made of (composition)?
  | "COMPARE" // Compare two or more things.
  | "DIST" // Show a distribution.
  | "TARGET" // Progress toward a goal/target.
  | "RANGE" // Is it in range / within a threshold?
  | "REL" // Relationship between two (or more) variables.
  | "COMP-TIME" // Composition over time.
  | "GEO" // Where geographically?
  | "FLOW" // What's the flow (in vs out / net)?
  | "BENCH" // Is this normal vs a benchmark?
  | "RETAIN" // Retention / cohort behavior.
  | "VALUE"; // What is the single value / magnitude right now?

/** All 15 intents, enumerable for a catalog surface and for runtime validation. */
export const INTENTS: readonly Intent[] = [
  "TREND",
  "DELTA",
  "RANK",
  "PART-WHOLE",
  "COMPARE",
  "DIST",
  "TARGET",
  "RANGE",
  "REL",
  "COMP-TIME",
  "GEO",
  "FLOW",
  "BENCH",
  "RETAIN",
  "VALUE",
] as const;

/** Runtime guard — an agent can pass any string; the resolver validates it. */
export function isIntent(value: unknown): value is Intent {
  return (
    typeof value === "string" && (INTENTS as readonly string[]).includes(value)
  );
}

/* -------------------------------------------------------------------------- */
/* Data-shape taxonomy (docs/02 — exactly 13)                                 */
/* -------------------------------------------------------------------------- */

/**
 * The 13 abstract data shapes from docs/02, as stable tokens. The doc phrases
 * them in prose; the verbatim phrase is in the comment beside each token.
 * These are the ABSTRACT shapes a chart declares in `acceptedShapes`. The
 * CONCRETE structure a render adapter actually consumes is a `DataKind` (below)
 * — the two are related but not 1:1 (see the note on `DataKind`).
 */
export type DataShape =
  | "single-value" // single value
  | "value-vs-target" // value vs target
  | "time-series" // time-ordered series
  | "multi-time-series" // multiple time series
  | "categorical" // categorical magnitudes
  | "ranking" // ranking
  | "part-to-whole" // part-to-whole
  | "distribution" // distribution
  | "two-variable" // two-variable relationship
  | "multivariate" // 3+ variables per record (radar / parallel coordinates)
  | "flows-net" // flows/net
  | "cohort-matrix" // cohort/retention matrix
  | "geographic" // geographic
  | "event-timeline"; // event/timeline

/**
 * All shapes, enumerable. docs/02 defined 13; the prototype added a 14th,
 * `multivariate`, when radar / parallel-coordinates landed (batch 8) — the 13
 * had no home for "3+ variables per record". RFC finding: the shape taxonomy
 * needs the multivariate slot.
 */
export const DATA_SHAPES: readonly DataShape[] = [
  "single-value",
  "value-vs-target",
  "time-series",
  "multi-time-series",
  "categorical",
  "ranking",
  "part-to-whole",
  "distribution",
  "two-variable",
  "multivariate",
  "flows-net",
  "cohort-matrix",
  "geographic",
  "event-timeline",
] as const;

/* -------------------------------------------------------------------------- */
/* Concrete data kinds (the render-guard contract)                            */
/* -------------------------------------------------------------------------- */

/**
 * The concrete data STRUCTURES the prototype's charts consume, one per
 * `src/chart/types.ts` shape. This is deliberately separate from `DataShape`:
 *
 *   One abstract shape can be served by two incompatible concrete structures —
 *   `"part-to-whole"` is rendered by DonutChart from a flat `CategoryDatum[]`
 *   OR by StackedBarChart from a multi-segment `StackRow[]`. And one concrete
 *   structure fills several abstract shapes — a `CategoryDatum[]` is at once
 *   `categorical`, `ranking`, and `part-to-whole`.
 *
 * Because of that, `acceptedShapes` (the docs/06 metadata field) cannot by
 * itself gate rendering: it would let StackedBarChart "accept" a flat
 * `CategoryDatum[]` it cannot draw. So each registry entry ALSO declares the
 * `DataKind`s its adapter can actually render, and the filter gates on that.
 * (See the docs/09 finding in the final report — the RFC should decide whether
 * the metadata's shape key is the abstract taxonomy or a concrete kind.)
 */
export type DataKind =
  | "series" // Series[]        (src/chart/types.ts)
  | "category" // CategoryDatum[]
  | "stack-row" // StackRow[]
  | "scatter" // ScatterPoint[]
  | "heat-row" // HeatRow[]
  | "funnel" // FunnelStage[]
  | "slope-row" // SlopeRow[]        (slope-chart)
  | "dumbbell-row" // DumbbellRow[]  (dumbbell-chart)
  | "bubble" // BubblePoint[]        (bubble-chart — scatter + size)
  | "radar-series" // RadarSeries[]  (radar-chart)
  | "parallel-row" // ParallelRow[]  (parallel-coordinates)
  | "calendar" // CalendarDatum[]    (calendar-heatmap)
  | "rfm" // RfmCell[]               (rfm-grid)
  | "unknown"; // unrecognized / malformed

/* -------------------------------------------------------------------------- */
/* Selection metadata (docs/06 — exact field set)                             */
/* -------------------------------------------------------------------------- */

/** Whether a chart is the go-to for an intent, or a reachable alternate. */
export type Primacy = "primary" | "secondary";

/** One (intent, primacy) tag — a chart serves several intents at varying primacy. */
export interface IntentTag {
  intent: Intent;
  primacy: Primacy;
}

/**
 * Hard constraints declared per chart. The filter keeps only charts whose
 * constraints the derived data facts satisfy (docs/06 §1). Every field is
 * optional — an absent constraint imposes nothing.
 */
export interface ChartConstraints {
  /** Max legible categories/slices/bars. Filter drops the chart above this. */
  maxCategories?: number;
  /** Requires a target/threshold value (via `options.target`). */
  requiresTarget?: boolean;
  /** Minimum number of series. */
  minSeries?: number;
  /** Requires a time axis (x is time-ordered). */
  requiresTimeAxis?: boolean;
  /** Minimum sample size (e.g. a scatter needs enough points to read). */
  minSampleSize?: number;
  /** Requires hierarchical/nested data (e.g. treemap). */
  hierarchy?: boolean;
}

/**
 * The docs/06 selection-metadata record. Since batch 5 shipped the Layer-2
 * overlays and batch 6 the declarative preset catalog, the doc's `overlays[]`
 * superset field is now populated (the names of the overlays a preset composes,
 * for the catalog surface). `persona` tags a preset with the docs/03 role whose
 * question it answers.
 */
export interface ChartSelectionMetadata {
  /** Registry name — the agent-selectable identifier. */
  name: string;
  /** The React base component this preset renders. */
  baseComponent: string;
  /** Intents this chart serves, each tagged primary or secondary. */
  intents: IntentTag[];
  /** Abstract data shapes this chart accepts (docs/02 taxonomy). */
  acceptedShapes: DataShape[];
  /** Hard constraints checked by the filter. */
  constraints: ChartConstraints;
  /**
   * Perceptual effectiveness, 0..1, higher = decoded more accurately by humans
   * (position > length > angle/area > color intensity — Cleveland & McGill,
   * Mackinlay APT). Drives the rank step.
   */
  perceptualRank: number;
  /** microcharts-style "question it answers", for the machine-readable catalog. */
  questionString: string;
  /** Relative bundle / lazy-load cost; a minor negative nudge in ranking. */
  bundleWeight: number;
  /** Names of Layer-2 overlays this preset composes (catalog surface). */
  overlays?: string[];
  /** The docs/03 persona whose question this preset answers. */
  persona?: string;
  /**
   * Structural configuration signature — base chart + variant + overlay set,
   * ignoring persona, labels, and threshold values. Entries that share a
   * `configLabel` render identically given the same data; it is the dedup key
   * for "the exhaustive list of distinct chart configurations" (many persona
   * presets collapse onto one configuration). Human-readable so it doubles as
   * the display name of the configuration.
   */
  configLabel?: string;
}

/* -------------------------------------------------------------------------- */
/* Resolve request / result                                                   */
/* -------------------------------------------------------------------------- */

/** Available display size — context for rendering (and, later, ranking). */
export interface ChartSize {
  width: number;
  height: number;
}

/**
 * What the agent hands the resolver: a structured intent, the data (opaque —
 * `unknown`, narrowed by `deriveFacts`), and free-form render/selection
 * options (e.g. `variant`, `target`, `ariaLabel`, `columnLabels`, `hue`).
 */
export interface ResolveRequest {
  intent: Intent;
  data: unknown;
  options?: Record<string, unknown>;
}

/**
 * The resolver's verdict. `name` is the chosen chart, or `null` when falling
 * back to the DataTable. `reason` is always set — every choice is explainable
 * (docs/06 caveat). `candidates` are the filter survivors, best-first (the
 * chosen name is `candidates[0]`); `[]` on fallback. `render` draws the result
 * at a given size and NEVER throws for a well-formed request.
 */
export interface ResolveResult {
  name: string | null;
  reason?: string;
  candidates: string[];
  render: (size: ChartSize) => ReactNode;
}

/* -------------------------------------------------------------------------- */
/* Registry entry                                                             */
/* -------------------------------------------------------------------------- */

/**
 * A registry entry pairs the public `metadata` with the private render
 * contract: `dataKinds` (the concrete structures the adapter can consume — the
 * operative render guard, see `DataKind`) and `render` (maps a request +
 * size to the chart's props and returns the element).
 *
 * `canonical` distinguishes the two catalog roles the prototype surfaced
 * (docs/09 batch 6): a **canonical** entry is a "which chart for this bare
 * intent + shape?" answer and is the only kind `resolve()` ranks; a
 * non-canonical **preset** is a persona-specific named configuration
 * (base + overlays + defaults) addressed by name via `resolveByName`, so the
 * catalog can grow to ~100 without flooding the bare-intent resolver. Absent or
 * `true` ⇒ canonical.
 */
export interface ChartRegistryEntry {
  metadata: ChartSelectionMetadata;
  dataKinds: DataKind[];
  render: (request: ResolveRequest, size: ChartSize) => ReactNode;
  /** `false` = a name-addressable preset, excluded from bare-intent ranking. */
  canonical?: boolean;
}

/** name → entry. Insertion order is the stable tie-break's registration order. */
export type ChartRegistry = Map<string, ChartRegistryEntry>;

/** Sentinel name reported by telemetry when the resolver falls back to a table. */
export const DATA_TABLE_NAME = "data-table";
