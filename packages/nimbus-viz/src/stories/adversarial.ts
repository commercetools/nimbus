/**
 * Adversarial input mutators.
 *
 * Every chart's `EdgeCase*` stories and the registry-wide invariant spec
 * (`src/selection/registry-invariants.spec.tsx`) need the same bad inputs:
 * rows that share a label, values that go negative, values that are all zero,
 * a single datum. Hand-rolling them per story drifts; these are the one set.
 *
 * Two layers:
 *
 * - **Typed row mutators** (`duplicateLabels`, `negateEveryOther`, `allZero`,
 *   `singleDatum`) work on plain arrays of flat rows — the shapes stories
 *   write inline (`CategoryDatum[]`, `FunnelStage[]`, `BulletDatum[]`, …).
 * - **`mutateFixture(kind, fixture, mutation)`** applies the right mutation to
 *   a registry fixture of any `DataKind`, including nested shapes (series
 *   points, stack segments, heat-row cells, flow graphs), and returns `null`
 *   when a mutation has no meaning for that kind (a scalar has no label to
 *   duplicate; a timeline has no value to negate).
 *
 * Hard rule (shared with `fixtures.ts`): mutations preserve STRUCTURE. The
 * selection engine classifies data by shape, so a mutated fixture must still
 * resolve to the same chart. Only values and label text change; arrays stay
 * arrays, keys stay present. That is also why "empty" is not a mutation here —
 * an empty array can change the detected kind, and every chart's own
 * `EdgeCaseEmpty` story already asserts the `null` render.
 */
import type { DataKind } from "../selection/types";
import type { Fixture } from "./fixtures";

export type MutationId =
  "duplicate-labels" | "negative-values" | "all-zero" | "single-datum";

export const MUTATIONS: readonly MutationId[] = [
  "duplicate-labels",
  "negative-values",
  "all-zero",
  "single-datum",
];

/* -------------------------------------------------------------------------- */
/* Typed row mutators (for stories)                                           */
/* -------------------------------------------------------------------------- */

const TEXT_FIELDS = ["category", "label", "stage", "name"] as const;

function textFieldOf(row: object): string | null {
  for (const f of TEXT_FIELDS) {
    if (typeof (row as Record<string, unknown>)[f] === "string") return f;
  }
  return null;
}

/**
 * Give every row the first row's label, so all rows share one label. The
 * values are untouched: a correct chart draws the same marks in the same
 * places and only the text changes (bug class BC-1 is exactly the case where
 * that stops being true).
 */
export function duplicateLabels<T extends object>(rows: readonly T[]): T[] {
  if (rows.length === 0) return [];
  const field = textFieldOf(rows[0]);
  if (!field) return rows.map((r) => ({ ...r }));
  const shared = (rows[0] as Record<string, unknown>)[field];
  return rows.map((r) => ({ ...r, [field]: shared }));
}

/**
 * Negate the numeric `field` on every other row (odd indices), so the data
 * crosses zero. The default field is `value`; pass `measure`, `count`, `size`,
 * `y`, … for other flat shapes.
 */
export function negateEveryOther<T extends object>(
  rows: readonly T[],
  field: keyof T & string = "value" as keyof T & string
): T[] {
  return rows.map((r, i) => {
    const v = (r as Record<string, unknown>)[field];
    return i % 2 === 1 && typeof v === "number"
      ? { ...r, [field]: -v }
      : { ...r };
  });
}

/** Set the numeric `field` (default `value`) to 0 on every row. */
export function allZero<T extends object>(
  rows: readonly T[],
  field: keyof T & string = "value" as keyof T & string
): T[] {
  return rows.map((r) =>
    typeof (r as Record<string, unknown>)[field] === "number"
      ? { ...r, [field]: 0 }
      : { ...r }
  );
}

/** Keep only the first row. */
export function singleDatum<T>(rows: readonly T[]): T[] {
  return rows.slice(0, 1);
}

/* -------------------------------------------------------------------------- */
/* Kind-aware fixture mutation (for the invariant spec)                       */
/* -------------------------------------------------------------------------- */

type Row = Record<string, unknown>;
const isRows = (d: unknown): d is Row[] =>
  Array.isArray(d) && d.every((r) => r !== null && typeof r === "object");
const isNumbers = (d: unknown): d is number[] =>
  Array.isArray(d) && d.every((v) => typeof v === "number");

function clone<T>(value: T): T {
  return structuredClone(value);
}

/** Negate every other entry of a numeric array (nulls preserved). */
function negateOdd(values: unknown[]): unknown[] {
  return values.map((v, i) => (i % 2 === 1 && typeof v === "number" ? -v : v));
}
function zeroAll(values: unknown[]): unknown[] {
  return values.map((v) => (typeof v === "number" ? 0 : v));
}

function mutateRowsField(
  rows: Row[],
  fields: readonly string[],
  mutation: "negative-values" | "all-zero"
): Row[] {
  return rows.map((r, i) => {
    const out: Row = { ...r };
    for (const f of fields) {
      const v = out[f];
      if (typeof v !== "number") continue;
      if (mutation === "all-zero") out[f] = 0;
      else if (i % 2 === 1) out[f] = -v;
    }
    return out;
  });
}

/**
 * Apply `mutation` to a registry fixture of the given `DataKind`. Returns a new
 * fixture, or `null` when the mutation does not apply to that kind.
 */
export function mutateFixture(
  kind: DataKind,
  fixture: Fixture,
  mutation: MutationId
): Fixture | null {
  const data = clone(fixture.data);
  const withData = (d: unknown): Fixture => ({ ...fixture, data: d });

  // ── flat rows with one text field and one or more numeric fields ────────
  const flat: Partial<
    Record<DataKind, { text: string | null; nums: string[] }>
  > = {
    category: { text: "category", nums: ["value"] },
    funnel: { text: "stage", nums: ["value"] },
    "slope-row": { text: "label", nums: ["left", "right"] },
    "dumbbell-row": { text: "category", nums: ["start", "end"] },
    bubble: { text: "label", nums: ["size"] },
    calendar: { text: null, nums: ["value"] },
    rfm: { text: null, nums: ["count"] },
    "delta-steps": { text: "label", nums: ["value"] },
    "bullet-row": { text: "label", nums: ["measure", "target"] },
    scatter: { text: "label", nums: ["y"] },
    ohlc: { text: null, nums: [] },
    "timeline-events": { text: "label", nums: [] },
    "parallel-row": { text: null, nums: [] },
  };

  const spec = flat[kind];
  if (spec && isRows(data)) {
    switch (mutation) {
      case "duplicate-labels": {
        if (!spec.text) return null;
        if (!data.every((r) => typeof r[spec.text as string] === "string"))
          return null;
        const shared = data[0][spec.text];
        return withData(
          data.map((r) => ({ ...r, [spec.text as string]: shared }))
        );
      }
      case "negative-values":
      case "all-zero":
        if (spec.nums.length === 0) return null;
        return withData(mutateRowsField(data, spec.nums, mutation));
      case "single-datum":
        return withData(data.slice(0, 1));
    }
  }

  // ── nested shapes ────────────────────────────────────────────────────────
  switch (kind) {
    case "series": {
      if (!isRows(data)) return null;
      const series = data as Array<Row & { data: Row[] }>;
      switch (mutation) {
        case "duplicate-labels":
          return withData(
            series.map((s) => ({ ...s, label: series[0].label }))
          );
        case "negative-values":
          return withData(
            series.map((s) => ({
              ...s,
              data: s.data.map((p, i) =>
                i % 2 === 1 && typeof p.y === "number" ? { ...p, y: -p.y } : p
              ),
            }))
          );
        case "all-zero":
          return withData(
            series.map((s) => ({
              ...s,
              data: s.data.map((p) =>
                typeof p.y === "number" ? { ...p, y: 0 } : p
              ),
            }))
          );
        case "single-datum":
          return withData([{ ...series[0], data: series[0].data.slice(0, 1) }]);
        default:
          return null;
      }
    }
    case "stack-row": {
      if (!isRows(data)) return null;
      const rows = data as Array<Row & { segments: Row[] }>;
      switch (mutation) {
        case "duplicate-labels":
          return withData(
            rows.map((r) => ({ ...r, category: rows[0].category }))
          );
        case "negative-values":
          return withData(
            rows.map((r, i) => ({
              ...r,
              segments:
                i % 2 === 1
                  ? r.segments.map((s) =>
                      typeof s.value === "number"
                        ? { ...s, value: -s.value }
                        : s
                    )
                  : r.segments,
            }))
          );
        case "all-zero":
          return withData(
            rows.map((r) => ({
              ...r,
              segments: r.segments.map((s) =>
                typeof s.value === "number" ? { ...s, value: 0 } : s
              ),
            }))
          );
        case "single-datum":
          return withData(rows.slice(0, 1));
        default:
          return null;
      }
    }
    case "heat-row":
    case "radar-series":
    case "sample-groups": {
      if (!isRows(data)) return null;
      const arrayField = kind === "sample-groups" ? "samples" : "values";
      const rows = data as Array<Row & Record<typeof arrayField, unknown[]>>;
      switch (mutation) {
        case "duplicate-labels":
          return withData(rows.map((r) => ({ ...r, label: rows[0].label })));
        case "negative-values":
          return withData(
            rows.map((r) => ({ ...r, [arrayField]: negateOdd(r[arrayField]) }))
          );
        case "all-zero":
          return withData(
            rows.map((r) => ({ ...r, [arrayField]: zeroAll(r[arrayField]) }))
          );
        case "single-datum":
          return withData(rows.slice(0, 1));
        default:
          return null;
      }
    }
    case "box-group": {
      if (!isRows(data)) return null;
      const FIVE = ["min", "firstQuartile", "median", "thirdQuartile", "max"];
      switch (mutation) {
        case "duplicate-labels":
          return withData(data.map((r) => ({ ...r, label: data[0].label })));
        case "negative-values":
          // Shift every other box below zero while keeping min ≤ q1 ≤ … ≤ max.
          return withData(
            data.map((r, i) => {
              if (i % 2 === 0) return r;
              const shift = 2 * (Number(r.max) || 1);
              const out: Row = { ...r };
              for (const f of FIVE)
                if (typeof out[f] === "number")
                  out[f] = (out[f] as number) - shift;
              return out;
            })
          );
        case "all-zero":
          return withData(
            data.map((r) => {
              const out: Row = { ...r };
              for (const f of FIVE) if (typeof out[f] === "number") out[f] = 0;
              return out;
            })
          );
        case "single-datum":
          return withData(data.slice(0, 1));
        default:
          return null;
      }
    }
    case "samples": {
      if (!isNumbers(data)) return null;
      switch (mutation) {
        case "duplicate-labels":
          return null;
        case "negative-values":
          return withData(negateOdd(data));
        case "all-zero":
          return withData(zeroAll(data));
        case "single-datum":
          return withData(data.slice(0, 1));
        default:
          return null;
      }
    }
    case "scalar": {
      if (typeof data !== "number") return null;
      switch (mutation) {
        case "duplicate-labels":
        case "single-datum":
          return null;
        case "negative-values":
          return withData(-data);
        case "all-zero":
          return withData(0);
        default:
          return null;
      }
    }
    case "flow-graph": {
      const g = data as { nodes: Row[]; links: Row[] };
      if (!g || !Array.isArray(g.nodes) || !Array.isArray(g.links)) return null;
      switch (mutation) {
        case "duplicate-labels":
          return withData({
            ...g,
            nodes: g.nodes.map((n) => ({ ...n, name: g.nodes[0].name })),
          });
        case "negative-values":
          return withData({
            ...g,
            links: mutateRowsField(g.links, ["value"], "negative-values"),
          });
        case "all-zero":
          return withData({
            ...g,
            links: mutateRowsField(g.links, ["value"], "all-zero"),
          });
        case "single-datum":
          return null;
        default:
          return null;
      }
    }
    case "hierarchy": {
      const root = data as Row & { children?: Row[] };
      if (!root || !Array.isArray(root.children)) return null;
      const children = root.children;
      switch (mutation) {
        case "duplicate-labels":
          return withData({
            ...root,
            children: children.map((c) => ({ ...c, name: children[0].name })),
          });
        case "negative-values":
          return withData({
            ...root,
            children: mutateRowsField(children, ["value"], "negative-values"),
          });
        case "all-zero":
          return withData({
            ...root,
            children: mutateRowsField(children, ["value"], "all-zero"),
          });
        case "single-datum":
          return withData({ ...root, children: children.slice(0, 1) });
        default:
          return null;
      }
    }
    case "flow-matrix": {
      const m = data as { labels: string[]; matrix: number[][] };
      if (!m || !Array.isArray(m.labels) || !Array.isArray(m.matrix))
        return null;
      switch (mutation) {
        case "duplicate-labels":
          return withData({ ...m, labels: m.labels.map(() => m.labels[0]) });
        case "negative-values":
          return withData({
            ...m,
            matrix: m.matrix.map((row, i) =>
              i % 2 === 1 ? row.map((v) => -v) : row
            ),
          });
        case "all-zero":
          return withData({
            ...m,
            matrix: m.matrix.map((row) => row.map(() => 0)),
          });
        case "single-datum":
          return null;
        default:
          return null;
      }
    }
    case "unknown":
      return null;
  }

  return null;
}
