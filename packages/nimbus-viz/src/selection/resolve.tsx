import type { ReactNode } from "react";
import { DataTable } from "../components/data-table";
import { formatDayMonth } from "../chart/format";
import { deriveFacts, detectKind } from "./derive-facts";
import type { DataFacts } from "./derive-facts";
import { chartRegistry } from "./registry";
import { emitTelemetry } from "./telemetry";
import { DATA_TABLE_NAME, isIntent } from "./types";
import type {
  ChartRegistry,
  ChartRegistryEntry,
  ChartSelectionMetadata,
  ChartSize,
  ResolveRequest,
  ResolveResult,
} from "./types";

/* ========================================================================== */
/* resolve — the deterministic filter → rank → tie-break pipeline (docs/06)   */
/* ========================================================================== */

/**
 * Pick one chart for a request, deterministically.
 *
 * `resolve` is a pure function of `(request, registry)`: the same request and
 * registry always return the same chart and rationale. (`size` is accepted for
 * API symmetry and future context-aware ranking, but v1 selection does NOT
 * depend on it, to keep the choice size-independent.) The only side effect is
 * the telemetry emission — an observation that never affects the return value.
 *
 * It NEVER throws (docs/06 fail-safe, and the docs/09 "one throwing chart
 * blanked the page" finding): an unknown intent, malformed data, an empty
 * filter, or any thrown error all resolve to the guaranteed DataTable with a
 * human-readable `reason`.
 */
export function resolve(
  request: ResolveRequest,
  _size: ChartSize,
  registry: ChartRegistry = chartRegistry
): ResolveResult {
  try {
    return resolveInner(request, registry);
  } catch (err) {
    // Last-resort guard: nothing below should throw, but the fail-safe is
    // absolute. Surface the data as a table rather than propagating.
    const message = err instanceof Error ? err.message : String(err);
    emitTelemetry({
      intent: request.intent,
      candidates: [],
      chosen: DATA_TABLE_NAME,
    });
    const reason = `The selector hit an unexpected error (${message}); showing the data as a table.`;
    return {
      name: null,
      reason,
      candidates: [],
      render: () => renderFallbackTable(request.data, reason),
    };
  }
}

function resolveInner(
  request: ResolveRequest,
  registry: ChartRegistry
): ResolveResult {
  // --- Guard: the agent may pass any string as the intent. -----------------
  if (!isIntent(request.intent)) {
    return fallback(
      request,
      [],
      `"${String(request.intent)}" is not one of the 15 recognized intents; showing the data as a table.`
    );
  }

  // --- Derive data facts. --------------------------------------------------
  const facts = deriveFacts(request);
  if (facts.malformed) {
    return fallback(
      request,
      [],
      `${facts.reason ?? "The data could not be read."} Showing the data as a table.`
    );
  }

  // --- 1. Filter (hard constraints → feasibility). -------------------------
  const survivors = [...registry.values()].filter((entry) =>
    passesFilter(entry, request, facts)
  );

  if (survivors.length === 0) {
    return fallback(
      request,
      [],
      `No registered chart serves ${request.intent} for ${describeData(facts)}; showing the data as a table.`
    );
  }

  // --- 2. Rank + 3. stable tie-break. --------------------------------------
  // Registration order = the registry's insertion order (Map preserves it).
  const order = new Map<string, number>();
  [...registry.keys()].forEach((name, i) => order.set(name, i));

  const ranked = [...survivors].sort((a, b) => {
    const sa = score(a.metadata, request, facts);
    const sb = score(b.metadata, request, facts);
    if (sb !== sa) return sb - sa; // higher score first
    if (b.metadata.perceptualRank !== a.metadata.perceptualRank) {
      return b.metadata.perceptualRank - a.metadata.perceptualRank;
    }
    // Final, fully-deterministic tie-break: registration order.
    return (
      (order.get(a.metadata.name) ?? 0) - (order.get(b.metadata.name) ?? 0)
    );
  });

  const chosen = ranked[0];
  const candidates = ranked.map((e) => e.metadata.name);
  const alternates = candidates.slice(1);

  emitTelemetry({
    intent: request.intent,
    candidates,
    chosen: chosen.metadata.name,
  });

  const primacyLabel =
    chosen.metadata.intents.find((t) => t.intent === request.intent)?.primacy ??
    "eligible";

  const reason = `${request.intent} × ${facts.kind} → "${chosen.metadata.name}" (${primacyLabel} for ${request.intent}, perceptualRank ${chosen.metadata.perceptualRank}). ${
    alternates.length
      ? `Alternates: ${alternates.join(", ")}.`
      : "No alternates."
  }`;

  return {
    name: chosen.metadata.name,
    reason,
    candidates,
    render: (size) => chosen.render(request, size),
  };
}

/* ========================================================================== */
/* resolveByName — render a named preset directly (the primary agent path)    */
/* ========================================================================== */

/**
 * Render a registry entry BY NAME — the primary "the agent picked this preset"
 * path (docs/04: "the agent selects presets, not raw components"). Where
 * `resolve` ranks the canonical charts for a bare intent, `resolveByName`
 * addresses the full ~100-entry catalog directly: it renders the named entry
 * when the data structure fits and fails safe to the DataTable otherwise
 * (unknown name, malformed data, or a kind the preset can't draw). Never throws.
 */
export function resolveByName(
  name: string,
  request: ResolveRequest,
  _size: ChartSize,
  registry: ChartRegistry = chartRegistry
): ResolveResult {
  try {
    const entry = registry.get(name);
    if (!entry) {
      return fallback(
        request,
        [],
        `No preset named "${name}" is registered; showing the data as a table.`
      );
    }

    const facts = deriveFacts(request);
    if (facts.malformed) {
      return fallback(
        request,
        [name],
        `${facts.reason ?? "The data could not be read."} Showing the data as a table.`
      );
    }
    if (!entry.dataKinds.includes(facts.kind)) {
      return fallback(
        request,
        [name],
        `Preset "${name}" cannot render ${facts.kind} data; showing the data as a table.`
      );
    }

    emitTelemetry({ intent: request.intent, candidates: [name], chosen: name });

    const q = entry.metadata.questionString;
    const persona = entry.metadata.persona;
    const reason = `Preset "${name}" selected by name${
      persona ? ` (${persona}: “${q}”)` : ` (“${q}”)`
    }.`;
    return {
      name,
      reason,
      candidates: [name],
      render: (size) => entry.render(request, size),
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const reason = `The selector hit an unexpected error (${message}); showing the data as a table.`;
    emitTelemetry({
      intent: request.intent,
      candidates: [],
      chosen: DATA_TABLE_NAME,
    });
    return {
      name: null,
      reason,
      candidates: [],
      render: () => renderFallbackTable(request.data, reason),
    };
  }
}

/* -------------------------------------------------------------------------- */
/* Filter                                                                     */
/* -------------------------------------------------------------------------- */

function passesFilter(
  entry: ChartRegistryEntry,
  request: ResolveRequest,
  facts: DataFacts
): boolean {
  const { metadata } = entry;

  // (0) only canonical entries participate in bare-intent resolution; presets
  //     are persona-specific and name-addressable via `resolveByName` (docs/09
  //     batch 6), so they never crowd the intent ranking.
  if (entry.canonical === false) return false;

  // (a) the chart must serve the requested intent.
  if (!metadata.intents.some((t) => t.intent === request.intent)) return false;

  // (b) render guard: the chart's adapter must be able to draw this concrete
  //     structure. This is the operative shape gate (see DataKind).
  if (!entry.dataKinds.includes(facts.kind)) return false;

  // (c) docs/06 shape filter: an accepted abstract shape must be present.
  //     Consistent with (b) by construction; kept for the documented contract.
  if (!metadata.acceptedShapes.some((s) => facts.shapes.includes(s))) {
    return false;
  }

  // (d) hard numeric/boolean constraints.
  return satisfiesConstraints(metadata, facts);
}

function satisfiesConstraints(
  metadata: ChartSelectionMetadata,
  facts: DataFacts
): boolean {
  const c = metadata.constraints;
  if (c.maxCategories != null && facts.cardinality > c.maxCategories) {
    return false;
  }
  if (c.requiresTarget === true && !facts.hasTarget) return false;
  if (c.minSeries != null && facts.seriesCount < c.minSeries) return false;
  if (c.requiresTimeAxis === true && !facts.hasTimeAxis) return false;
  if (c.minSampleSize != null && facts.sampleSize < c.minSampleSize) {
    return false;
  }
  if (c.hierarchy === true && !facts.hierarchy) return false;
  return true;
}

/* -------------------------------------------------------------------------- */
/* Rank                                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Weighted score (docs/06 §2). Primacy leads, perceptual effectiveness next, a
 * bounded data-fit nudge last, and a negligible cost nudge:
 *
 *   score = W_INTENT     · primacy(1.0 primary / 0.6 secondary)
 *         + W_PERCEPTUAL · perceptualRank (0..1)
 *         + W_FIT        · dataFit (≈0..1.3)
 *         − W_COST       · (bundleWeight / 100)
 *
 * Weights are tuned so PRIMACY dominates: the primary→secondary gap (0.4) is
 * larger than the most a better-perceived, better-fit secondary can make up
 * (0.5·Δperc + 0.25·fit), so a secondary only overtakes a primary when it is
 * BOTH markedly clearer perceptually AND a markedly better fit — which is the
 * intended behavior, not an accident. These seed weights come from the
 * perceptual literature; the telemetry loop (docs/03) is meant to learn them.
 */
const W_INTENT = 1.0;
const W_PERCEPTUAL = 0.5;
const W_FIT = 0.25;
const W_COST = 0.05;

function primacyScore(
  metadata: ChartSelectionMetadata,
  request: ResolveRequest
): number {
  const tag = metadata.intents.find((t) => t.intent === request.intent);
  if (!tag) return 0;
  return tag.primacy === "primary" ? 1.0 : 0.6;
}

/**
 * Bounded soft fit on data characteristics (docs/06: "donut fine ≤~5 slices,
 * penalized at 20; histogram needs enough points"). Rewards headroom under
 * `maxCategories`, comfortable sample size, and having several series to show.
 */
function dataFit(metadata: ChartSelectionMetadata, facts: DataFacts): number {
  const c = metadata.constraints;
  let fit = 0;

  if (c.maxCategories != null && facts.cardinality > 0) {
    // 1 when far under the limit, ~0 at the limit (filter guarantees ≤ limit).
    fit += Math.max(0, 1 - facts.cardinality / c.maxCategories);
  }
  if (c.minSampleSize != null) {
    fit += facts.sampleSize >= c.minSampleSize * 3 ? 0.2 : 0;
  }
  if (c.minSeries != null && facts.seriesCount > c.minSeries) {
    fit += 0.1;
  }
  return fit;
}

function score(
  metadata: ChartSelectionMetadata,
  request: ResolveRequest,
  facts: DataFacts
): number {
  return (
    W_INTENT * primacyScore(metadata, request) +
    W_PERCEPTUAL * metadata.perceptualRank +
    W_FIT * dataFit(metadata, facts) -
    W_COST * (metadata.bundleWeight / 100)
  );
}

/* -------------------------------------------------------------------------- */
/* Fallback                                                                   */
/* -------------------------------------------------------------------------- */

function fallback(
  request: ResolveRequest,
  candidates: string[],
  reason: string
): ResolveResult {
  emitTelemetry({
    intent: request.intent,
    candidates,
    chosen: DATA_TABLE_NAME,
  });
  return {
    name: null,
    reason,
    candidates,
    render: () => renderFallbackTable(request.data, reason),
  };
}

function describeData(facts: DataFacts): string {
  const shape = facts.shapes[0] ?? facts.kind;
  const n = facts.cardinality;
  return `${shape} data (${n} ${n === 1 ? "item" : "items"})`;
}

/* ========================================================================== */
/* Tabularization — turn any request data into a DataTable model              */
/* ========================================================================== */

interface TableModel {
  columns: string[];
  rows: (string | number)[][];
}

/** Coerce any cell value to a table-safe primitive. Never throws. */
function coerce(value: unknown): string | number {
  if (typeof value === "number") return value; // DataTable guards NaN/Infinity.
  if (typeof value === "string") return value;
  if (value == null) return "—";
  if (value instanceof Date) return formatDayMonth(value);
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

/**
 * Convert request data into a `{ columns, rows }` model for the fallback table.
 * Total by construction — every branch returns a model, so it is safe to call
 * from a render path where throwing would blank the page.
 */
export function tabularize(data: unknown): TableModel {
  if (data == null) return { columns: [], rows: [] };

  if (Array.isArray(data)) {
    if (data.length === 0) return { columns: [], rows: [] };
    switch (detectKind(data)) {
      case "series":
        return seriesTable(data);
      case "category":
        return simpleTable(data, "category", "value", ["Category", "Value"]);
      case "funnel":
        return simpleTable(data, "stage", "value", ["Stage", "Value"]);
      case "stack-row":
        return stackTable(data);
      case "scatter":
        return scatterTable(data);
      case "heat-row":
        return heatTable(data);
      case "unknown":
        return genericArrayTable(data);
    }
  }

  // Non-array object → field/value; primitive → single cell.
  if (typeof data === "object") {
    const rows = Object.entries(data as Record<string, unknown>).map(
      ([k, v]) => [k, coerce(v)] as (string | number)[]
    );
    return { columns: ["Field", "Value"], rows };
  }
  return { columns: ["Value"], rows: [[coerce(data)]] };
}

function seriesTable(data: unknown[]): TableModel {
  const series = data as Array<{
    label?: unknown;
    id?: unknown;
    data?: Array<{ x?: unknown; y?: unknown }>;
  }>;
  const rows: (string | number)[][] = [];
  for (const s of series) {
    const label =
      typeof s.label === "string"
        ? s.label
        : typeof s.id === "string"
          ? s.id
          : "series";
    for (const p of s.data ?? []) {
      rows.push([label, coerce(p.x), p.y == null ? "—" : coerce(p.y)]);
    }
  }
  return { columns: ["Series", "X", "Value"], rows };
}

function simpleTable(
  data: unknown[],
  keyField: string,
  valueField: string,
  columns: [string, string]
): TableModel {
  const rows = (data as Array<Record<string, unknown>>).map((d) => [
    coerce(d[keyField]),
    coerce(d[valueField]),
  ]);
  return { columns, rows };
}

function stackTable(data: unknown[]): TableModel {
  const rows = data as Array<{
    category?: unknown;
    segments?: Array<{ key?: unknown; value?: unknown }>;
  }>;
  const keys = (rows[0]?.segments ?? [])
    .map((s) => (typeof s.key === "string" ? s.key : String(s.key)))
    .filter((k): k is string => k.length > 0);
  const out = rows.map((r) => {
    const byKey = new Map<string, unknown>();
    for (const seg of r.segments ?? []) {
      if (typeof seg.key === "string") byKey.set(seg.key, seg.value);
    }
    return [
      coerce(r.category),
      ...keys.map((k) => (byKey.has(k) ? coerce(byKey.get(k)) : "—")),
    ] as (string | number)[];
  });
  return { columns: ["Category", ...keys], rows: out };
}

function scatterTable(data: unknown[]): TableModel {
  const points = data as Array<{
    label?: unknown;
    x?: unknown;
    y?: unknown;
    group?: unknown;
  }>;
  const hasGroup = points.some((p) => typeof p.group === "string");
  const columns = hasGroup ? ["Label", "X", "Y", "Group"] : ["Label", "X", "Y"];
  const rows = points.map((p) => {
    const base: (string | number)[] = [
      typeof p.label === "string" ? p.label : "",
      coerce(p.x),
      coerce(p.y),
    ];
    if (hasGroup) base.push(typeof p.group === "string" ? p.group : "");
    return base;
  });
  return { columns, rows };
}

function heatTable(data: unknown[]): TableModel {
  const rows = data as Array<{ label?: unknown; values?: unknown[] }>;
  const maxCols = rows.reduce(
    (m, r) => Math.max(m, Array.isArray(r.values) ? r.values.length : 0),
    0
  );
  const columns = ["", ...Array.from({ length: maxCols }, (_, i) => String(i))];
  const out = rows.map((r) => {
    const cells: (string | number)[] = [coerce(r.label)];
    for (let i = 0; i < maxCols; i += 1) {
      const v = r.values?.[i];
      cells.push(v == null ? "—" : coerce(v));
    }
    return cells;
  });
  return { columns, rows: out };
}

function genericArrayTable(data: unknown[]): TableModel {
  const keys = new Set<string>();
  for (const item of data) {
    if (item != null && typeof item === "object" && !Array.isArray(item)) {
      for (const k of Object.keys(item as Record<string, unknown>)) {
        keys.add(k);
      }
    }
  }
  if (keys.size === 0) {
    // Array of primitives.
    return { columns: ["Value"], rows: data.map((v) => [coerce(v)]) };
  }
  const columns = [...keys];
  const rows = data.map((item) => {
    const record = (item ?? {}) as Record<string, unknown>;
    return columns.map((k) => coerce(record[k]));
  });
  return { columns, rows };
}

/**
 * Render the guaranteed DataTable fallback for a dataset, with a reason banner.
 * Exported so the demo's error boundary (resolved-chart) can reuse the exact
 * same fallback when a chosen chart throws at render time.
 */
export function renderFallbackTable(
  data: unknown,
  reason?: string,
  caption?: string
): ReactNode {
  const { columns, rows } = tabularize(data);
  return (
    <DataTable
      columns={columns}
      rows={rows}
      reason={reason}
      caption={caption}
    />
  );
}
