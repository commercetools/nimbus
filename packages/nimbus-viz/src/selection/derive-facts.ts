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
  if (!Array.isArray(data) || data.length === 0) return "unknown";
  const first: unknown = data[0];
  if (!isObject(first)) return "unknown";

  // Series[]: { id, label, data: [...] }
  if (
    typeof first.id === "string" &&
    typeof first.label === "string" &&
    Array.isArray(first.data)
  ) {
    return "series";
  }
  // StackRow[]: { category, segments: [...] }
  if (typeof first.category === "string" && Array.isArray(first.segments)) {
    return "stack-row";
  }
  // HeatRow[]: { label, values: [...] }
  if (typeof first.label === "string" && Array.isArray(first.values)) {
    return "heat-row";
  }
  // FunnelStage[]: { stage, value }
  if (typeof first.stage === "string" && typeof first.value === "number") {
    return "funnel";
  }
  // CategoryDatum[]: { category, value }
  if (typeof first.category === "string" && typeof first.value === "number") {
    return "category";
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
      // A flat category array serves compare, rank, and part-to-whole alike.
      return ["categorical", "ranking", "part-to-whole"];
    case "stack-row":
      return ["part-to-whole", "categorical"];
    case "scatter":
      return ["two-variable"];
    case "heat-row":
      return ["cohort-matrix"];
    case "funnel":
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
  }
}
