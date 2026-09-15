/**
 * Per-series stroke dash patterns — a redundant, non-color encoding for line
 * identity on STROKED marks (a plain line/path with no fill area). Color
 * alone fails for monochrome print, photocopies, and `forced-colors` mode —
 * exactly what `chart/patterns.tsx`'s `patternFill` addresses for a mark that
 * has a fill area to texture. A stroked line has none, so the honest
 * equivalent channel is stroke *rhythm*, not a fill pattern. Opt-in: pass
 * `strokeDasharrayFor(i)` as a line's `strokeDasharray`.
 */

// Kind per series, cycled by index. Slot 0 is solid so the most common
// single-series case renders exactly as it did before this existed.
const DASH_KINDS = [
  "solid",
  "dashed",
  "dotted",
  "dash-dot",
  "long-dash",
] as const;

export type DashKind = (typeof DASH_KINDS)[number];

const DASH_PATTERNS: Record<DashKind, string | undefined> = {
  solid: undefined,
  dashed: "7,4",
  dotted: "1.5,3.5",
  "dash-dot": "7,3,1.5,3",
  "long-dash": "11,4",
};

/** Dash kind for categorical slot `index`, cycling through {@link DASH_KINDS}. */
export function dashKindFor(index: number): DashKind {
  return DASH_KINDS[index % DASH_KINDS.length];
}

/**
 * `strokeDasharray` value for categorical slot `index`. `undefined` (a solid
 * stroke, i.e. no `strokeDasharray` attribute at all) for slot 0.
 */
export function strokeDasharrayFor(index: number): string | undefined {
  return DASH_PATTERNS[dashKindFor(index)];
}
