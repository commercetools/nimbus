import type { DataKind, DataShape, ResolveRequest } from "./types";

/**
 * Data facts — the deterministic, domain-agnostic reading of a request's data
 * that the filter keys off (docs/06 "Inputs → Data facts"). Derived from the
 * data structure ALONE (plus a couple of `options` hints), never from domain
 * meaning, so the same data always yields the same facts.
 */
export interface DataFacts {
  /** The concrete structure detected (the render-guard key). */
  kind: DataKind;
  /** The abstract shapes this data can fill (docs/02 taxonomy). */
  shapes: DataShape[];
  /** Primary-axis count: categories / slices / rows / stages / points. */
  cardinality: number;
  /** Number of series (≥2 ⇒ multi-series). 1 for non-series shapes. */
  seriesCount: number;
  /** A target/threshold was supplied via `options.target` (finite number). */
  hasTarget: boolean;
  /** The data is time-ordered (a genuine time axis). */
  hasTimeAxis: boolean;
  /** Total data points across the structure. */
  sampleSize: number;
  /** The data is hierarchical/nested (via `options.hierarchy`). */
  hierarchy: boolean;
  /** The structure was empty or unrecognized — the resolver must fall back. */
  malformed: boolean;
  /** Human-readable note when `malformed` (or empty). */
  reason?: string;
}

/**
 * The SINGLE entity-id convention (docs/09 finding: "The RFC must fix ONE
 * entity-id concept spanning every chart's data shape AND the selection
 * metadata, or the shared scale doesn't bind").
 *
 * Every chart identifies an entity by a *string id*, read from the fixed
 * accessor below. The selection engine, the render adapters, and the shared
 * `useEntityColors` scale all key on the SAME string, so an entity keeps its
 * identity (and its color) across charts.
 */
export const ENTITY_ID_ACCESSOR: Record<
  Exclude<DataKind, "unknown">,
  string
> = {
  series: "series.id",
  category: "datum.category",
  "stack-row": "row.category (columns) · segment.key (series)",
  scatter: "point.group (ungrouped points share the accent)",
  "heat-row": "row.label",
  funnel: "stage.stage",
  "slope-row": "row.id",
  "dumbbell-row": "row.category",
  bubble: "point.group (ungrouped points share the accent)",
  "radar-series": "series.id",
  "parallel-row": "row.group (ungrouped rows share the accent)",
  calendar: "datum.date",
  rfm: "cell.recency×frequency",
  samples: "(none — a single anonymous distribution)",
  "box-group": "group.label",
  "delta-steps": "step.label",
  "bullet-row": "row.label",
  "flow-graph": "node.name",
  hierarchy: "node.name",
  scalar: "(none — a single value)",
  "sample-groups": "group.label",
  ohlc: "bar.date",
  "timeline-events": "event.label",
  "flow-matrix": "matrix.labels[i]",
};

/* -------------------------------------------------------------------------- */
/* Structural narrowing helpers (no `any`; `unknown` + guards)                */
/* -------------------------------------------------------------------------- */

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

/**
 * Classify the concrete structure from its first element. The prototype's
 * shapes are mutually distinguishable by their key names, so a first-element
 * probe is sufficient and deterministic.
 */
export function detectKind(data: unknown): DataKind {
  // Non-array shapes first — a few charts consume a single value or object
  // rather than an array of records.
  if (isFiniteNumber(data)) return "scalar";
  if (isObject(data) && !Array.isArray(data)) {
    // FlowGraph: { nodes: [...], links: [...] }  (sankey)
    if (Array.isArray(data.nodes) && Array.isArray(data.links)) {
      return "flow-graph";
    }
    // FlowMatrix: { labels: [...], matrix: [[...]] }  (chord)
    if (Array.isArray(data.labels) && Array.isArray(data.matrix)) {
      return "flow-matrix";
    }
    // TreemapNode: { name, children: [...] } or a valued leaf.  (treemap)
    if (
      typeof data.name === "string" &&
      (Array.isArray(data.children) || isFiniteNumber(data.value))
    ) {
      return "hierarchy";
    }
    return "unknown";
  }
  if (!Array.isArray(data) || data.length === 0) return "unknown";
  const first: unknown = data[0];
  // number[] — a single anonymous sample set (histogram).
  if (isFiniteNumber(first)) return "samples";
  if (!isObject(first)) return "unknown";

  // Series[]: { id, label, data: [...] }
  if (
    typeof first.id === "string" &&
    typeof first.label === "string" &&
    Array.isArray(first.data)
  ) {
    return "series";
  }
  // RadarSeries[]: { id, label, values: [...] } — before heat-row (label+values).
  if (
    typeof first.id === "string" &&
    typeof first.label === "string" &&
    Array.isArray(first.values)
  ) {
    return "radar-series";
  }
  // SlopeRow[]: { id, label, left: number, right: number }
  if (
    typeof first.id === "string" &&
    typeof first.label === "string" &&
    isFiniteNumber(first.left) &&
    isFiniteNumber(first.right)
  ) {
    return "slope-row";
  }
  // ParallelRow[]: { id, values: { ...record } } — values is an object, not array.
  if (
    typeof first.id === "string" &&
    isObject(first.values) &&
    !Array.isArray(first.values)
  ) {
    return "parallel-row";
  }
  // SampleGroup[]: { label, samples: [...] } — before heat-row (label + array).
  if (typeof first.label === "string" && Array.isArray(first.samples)) {
    return "sample-groups";
  }
  // TimelineEvent[]: { label, start: Date|string, end? } — before the numeric
  // label-based kinds; `start` is a date, never a number.
  if (
    typeof first.label === "string" &&
    (first.start instanceof Date || typeof first.start === "string")
  ) {
    return "timeline-events";
  }
  // StackRow[]: { category, segments: [...] }
  if (typeof first.category === "string" && Array.isArray(first.segments)) {
    return "stack-row";
  }
  // DumbbellRow[]: { category, start: number, end: number } — before category.
  if (
    typeof first.category === "string" &&
    isFiniteNumber(first.start) &&
    isFiniteNumber(first.end)
  ) {
    return "dumbbell-row";
  }
  // BoxPlotGroupStats[]: { label, firstQuartile, median, thirdQuartile, … }
  if (
    typeof first.label === "string" &&
    isFiniteNumber(first.firstQuartile) &&
    isFiniteNumber(first.median) &&
    isFiniteNumber(first.thirdQuartile)
  ) {
    return "box-group";
  }
  // BulletDatum[]: { label, measure, target }
  if (
    typeof first.label === "string" &&
    isFiniteNumber(first.measure) &&
    isFiniteNumber(first.target)
  ) {
    return "bullet-row";
  }
  // HeatRow[]: { label, values: [...] }
  if (typeof first.label === "string" && Array.isArray(first.values)) {
    return "heat-row";
  }
  // WaterfallStep[]: { label, value } — a signed contribution (no values array).
  if (typeof first.label === "string" && isFiniteNumber(first.value)) {
    return "delta-steps";
  }
  // FunnelStage[]: { stage, value }
  if (typeof first.stage === "string" && typeof first.value === "number") {
    return "funnel";
  }
  // RfmCell[]: { recency: number, frequency: number, count: number }
  if (
    isFiniteNumber(first.recency) &&
    isFiniteNumber(first.frequency) &&
    isFiniteNumber(first.count)
  ) {
    return "rfm";
  }
  // OhlcBar[]: { date, open, high, low, close } — before calendar (date-keyed,
  // but has no `value`, so it would fall through otherwise).
  if (
    (typeof first.date === "string" || first.date instanceof Date) &&
    isFiniteNumber(first.open) &&
    isFiniteNumber(first.high) &&
    isFiniteNumber(first.low) &&
    isFiniteNumber(first.close)
  ) {
    return "ohlc";
  }
  // CalendarDatum[]: { date: string | Date, value: number } — before category.
  if (
    (typeof first.date === "string" || first.date instanceof Date) &&
    isFiniteNumber(first.value)
  ) {
    return "calendar";
  }
  // CategoryDatum[]: { category, value }
  if (typeof first.category === "string" && typeof first.value === "number") {
    return "category";
  }
  // BubblePoint[]: { x: number, y: number, size: number } — before scatter.
  if (
    isFiniteNumber(first.x) &&
    isFiniteNumber(first.y) &&
    isFiniteNumber(first.size)
  ) {
    return "bubble";
  }
  // ScatterPoint[]: { x: number, y: number, ... }
  if (typeof first.x === "number" && typeof first.y === "number") {
    return "scatter";
  }
  return "unknown";
}

/** The abstract shapes a given concrete kind can legitimately fill (docs/02). */
function shapesForKind(kind: DataKind, seriesCount: number): DataShape[] {
  switch (kind) {
    case "series":
      return seriesCount >= 2
        ? ["multi-time-series", "time-series"]
        : ["time-series"];
    case "category":
      // A flat category array serves compare, rank, part-to-whole, and (sorted
      // + cumulative) Pareto distribution alike.
      return ["categorical", "ranking", "part-to-whole", "distribution"];
    case "stack-row":
      return ["part-to-whole", "categorical"];
    case "scatter":
      return ["two-variable"];
    case "heat-row":
      return ["cohort-matrix"];
    case "funnel":
      return ["flows-net"];
    case "slope-row":
      return ["categorical"];
    case "dumbbell-row":
      return ["categorical"];
    case "bubble":
      return ["two-variable"];
    case "radar-series":
      return ["multivariate"];
    case "parallel-row":
      return ["multivariate"];
    case "calendar":
      return ["time-series", "distribution"];
    case "rfm":
      return ["distribution", "part-to-whole"];
    case "samples":
      return ["distribution"];
    case "box-group":
      return ["distribution"];
    case "delta-steps":
      return ["part-to-whole"];
    case "bullet-row":
      return ["value-vs-target"];
    case "flow-graph":
      return ["flows-net"];
    case "hierarchy":
      return ["part-to-whole"];
    case "scalar":
      return ["single-value", "value-vs-target"];
    case "sample-groups":
      return ["distribution"];
    case "ohlc":
      return ["time-series"];
    case "timeline-events":
      return ["event-timeline"];
    case "flow-matrix":
      return ["flows-net"];
    case "unknown":
      return [];
  }
}

/* -------------------------------------------------------------------------- */
/* Per-kind fact extraction                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Derive the {@link DataFacts} for a request. Pure and total: any input yields
 * a `DataFacts` (malformed/empty data simply sets `malformed`), so the caller
 * never has to guard against a throw.
 */
/** Total leaf count of a treemap-style hierarchy (a node with no non-empty
 *  `children` is a leaf). */
function countHierarchyLeaves(node: unknown): number {
  if (!isObject(node)) return 0;
  const children = node.children;
  if (Array.isArray(children) && children.length > 0) {
    return children.reduce(
      (sum: number, child) => sum + countHierarchyLeaves(child),
      0
    );
  }
  return 1;
}

export function deriveFacts(request: ResolveRequest): DataFacts {
  const { data, options } = request;
  const opts = options ?? {};
  const hasTarget = isFiniteNumber(opts.target);
  const hierarchy = opts.hierarchy === true;

  const base: DataFacts = {
    kind: "unknown",
    shapes: [],
    cardinality: 0,
    seriesCount: 0,
    hasTarget,
    hasTimeAxis: false,
    sampleSize: 0,
    hierarchy,
    malformed: true,
  };

  if (data == null) {
    return { ...base, reason: "No data was provided." };
  }
  if (!Array.isArray(data)) {
    // A few charts consume a single value or object rather than an array.
    const nonArrayKind = detectKind(data);
    if (nonArrayKind === "scalar") {
      return {
        ...base,
        kind: "scalar",
        shapes: shapesForKind("scalar", 1),
        cardinality: 1,
        seriesCount: 1,
        sampleSize: 1,
        malformed: false,
      };
    }
    if (nonArrayKind === "flow-graph") {
      const g = data as { nodes: unknown[]; links: unknown[] };
      return {
        ...base,
        kind: "flow-graph",
        shapes: shapesForKind("flow-graph", 1),
        cardinality: g.nodes.length,
        seriesCount: 1,
        sampleSize: g.links.length,
        malformed: false,
      };
    }
    if (nonArrayKind === "hierarchy") {
      const leaves = countHierarchyLeaves(data);
      return {
        ...base,
        kind: "hierarchy",
        shapes: shapesForKind("hierarchy", 1),
        cardinality: leaves,
        seriesCount: 1,
        sampleSize: leaves,
        hierarchy: true,
        malformed: false,
      };
    }
    if (nonArrayKind === "flow-matrix") {
      const m = data as { labels: unknown[]; matrix: unknown[] };
      return {
        ...base,
        kind: "flow-matrix",
        shapes: shapesForKind("flow-matrix", 1),
        cardinality: m.labels.length,
        seriesCount: 1,
        sampleSize: m.matrix.length,
        malformed: false,
      };
    }
    return {
      ...base,
      reason: "Data is not an array of records the charts understand.",
    };
  }
  if (data.length === 0) {
    return { ...base, reason: "The dataset is empty." };
  }

  const kind = detectKind(data);
  if (kind === "unknown") {
    return {
      ...base,
      reason: "Data does not match any known chart shape.",
    };
  }

  switch (kind) {
    case "series": {
      const series = data as Array<{ data?: unknown[] }>;
      const seriesCount = series.length;
      const sampleSize = series.reduce(
        (sum, s) => sum + (Array.isArray(s.data) ? s.data.length : 0),
        0
      );
      return {
        kind,
        shapes: shapesForKind(kind, seriesCount),
        cardinality: seriesCount,
        seriesCount,
        hasTarget,
        hasTimeAxis: true, // Series is time-ordered by contract (x: number | Date).
        sampleSize,
        hierarchy,
        malformed: false,
      };
    }
    case "category": {
      const rows = data as unknown[];
      return {
        kind,
        shapes: shapesForKind(kind, 1),
        cardinality: rows.length,
        seriesCount: 1,
        hasTarget,
        hasTimeAxis: false,
        sampleSize: rows.length,
        hierarchy,
        malformed: false,
      };
    }
    case "stack-row": {
      const rows = data as Array<{ segments?: unknown[] }>;
      const keyCount = Array.isArray(rows[0]?.segments)
        ? rows[0].segments.length
        : 0;
      const sampleSize = rows.reduce(
        (sum, r) => sum + (Array.isArray(r.segments) ? r.segments.length : 0),
        0
      );
      return {
        kind,
        shapes: shapesForKind(kind, keyCount),
        cardinality: rows.length,
        seriesCount: keyCount,
        hasTarget,
        hasTimeAxis: false,
        sampleSize,
        hierarchy,
        malformed: false,
      };
    }
    case "scatter": {
      const points = data as Array<{ group?: unknown }>;
      const groups = new Set(
        points
          .map((p) => p.group)
          .filter((g): g is string => typeof g === "string")
      );
      return {
        kind,
        shapes: shapesForKind(kind, 1),
        cardinality: points.length,
        seriesCount: Math.max(1, groups.size),
        hasTarget,
        hasTimeAxis: false,
        sampleSize: points.length,
        hierarchy,
        malformed: false,
      };
    }
    case "heat-row": {
      const rows = data as Array<{ values?: unknown[] }>;
      const sampleSize = rows.reduce(
        (sum, r) =>
          sum +
          (Array.isArray(r.values)
            ? r.values.filter((v) => v != null).length
            : 0),
        0
      );
      return {
        kind,
        shapes: shapesForKind(kind, 1),
        cardinality: rows.length,
        seriesCount: 1,
        hasTarget,
        hasTimeAxis: false,
        sampleSize,
        hierarchy,
        malformed: false,
      };
    }
    case "funnel": {
      const stages = data as unknown[];
      return {
        kind,
        shapes: shapesForKind(kind, 1),
        cardinality: stages.length,
        seriesCount: 1,
        hasTarget,
        hasTimeAxis: false,
        sampleSize: stages.length,
        hierarchy,
        malformed: false,
      };
    }
    case "slope-row":
    case "dumbbell-row":
    case "calendar": {
      const rows = data as unknown[];
      return {
        kind,
        shapes: shapesForKind(kind, 1),
        cardinality: rows.length,
        seriesCount: 1,
        hasTarget,
        hasTimeAxis: kind === "calendar", // calendar is date-ordered
        sampleSize: rows.length,
        hierarchy,
        malformed: false,
      };
    }
    case "bubble":
    case "parallel-row": {
      const rows = data as Array<{ group?: unknown }>;
      const groups = new Set(
        rows
          .map((r) => r.group)
          .filter((g): g is string => typeof g === "string")
      );
      return {
        kind,
        shapes: shapesForKind(kind, 1),
        cardinality: rows.length,
        seriesCount: Math.max(1, groups.size),
        hasTarget,
        hasTimeAxis: false,
        sampleSize: rows.length,
        hierarchy,
        malformed: false,
      };
    }
    case "radar-series": {
      const series = data as Array<{ values?: unknown[] }>;
      const sampleSize = series.reduce(
        (sum, s) => sum + (Array.isArray(s.values) ? s.values.length : 0),
        0
      );
      return {
        kind,
        shapes: shapesForKind(kind, series.length),
        cardinality: series.length,
        seriesCount: series.length,
        hasTarget,
        hasTimeAxis: false,
        sampleSize,
        hierarchy,
        malformed: false,
      };
    }
    case "rfm": {
      const cells = data as Array<{ count?: unknown }>;
      const sampleSize = cells.reduce(
        (sum, c) => sum + (isFiniteNumber(c.count) ? c.count : 0),
        0
      );
      return {
        kind,
        shapes: shapesForKind(kind, 1),
        cardinality: cells.length,
        seriesCount: 1,
        hasTarget,
        hasTimeAxis: false,
        sampleSize,
        hierarchy,
        malformed: false,
      };
    }
    case "samples":
    case "box-group":
    case "delta-steps":
    case "bullet-row": {
      const rows = data as unknown[];
      return {
        kind,
        shapes: shapesForKind(kind, 1),
        cardinality: rows.length,
        seriesCount: 1,
        hasTarget,
        hasTimeAxis: false,
        sampleSize: rows.length,
        hierarchy,
        malformed: false,
      };
    }
    case "sample-groups": {
      const groups = data as Array<{ samples?: unknown[] }>;
      const sampleSize = groups.reduce(
        (sum, g) => sum + (Array.isArray(g.samples) ? g.samples.length : 0),
        0
      );
      return {
        kind,
        shapes: shapesForKind(kind, 1),
        cardinality: groups.length,
        seriesCount: 1,
        hasTarget,
        hasTimeAxis: false,
        sampleSize,
        hierarchy,
        malformed: false,
      };
    }
    case "ohlc":
    case "timeline-events": {
      const rows = data as unknown[];
      return {
        kind,
        shapes: shapesForKind(kind, 1),
        cardinality: rows.length,
        seriesCount: 1,
        hasTarget,
        hasTimeAxis: true, // both are time-ordered by contract
        sampleSize: rows.length,
        hierarchy,
        malformed: false,
      };
    }
    // Non-array kinds are resolved before the array guard above; listed here
    // only to keep the switch exhaustive over DataKind.
    case "flow-graph":
    case "flow-matrix":
    case "hierarchy":
    case "scalar":
      return {
        ...base,
        reason: "Unexpected non-array kind in the array branch.",
      };
  }
}
