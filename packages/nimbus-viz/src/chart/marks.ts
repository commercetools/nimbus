/**
 * The dataviz mark & layout spec, centralized. These were scattered as magic
 * numbers across ~40 charts (radius 3 vs 4; markers as small as r=2, below the
 * 8px minimum; legend strips drifting 24 vs 26). Charts should read these so the
 * spec is enforced in one place.
 */

/** Rounded radius on data-ends (bar caps, etc.). */
export const DATA_END_RADIUS = 4;
/** Surface gap between adjacent fills, and ring width on overlapping marks. */
export const SURFACE_GAP = 2;
/** Minimum marker size (diameter, px) so points stay hittable and visible. */
export const MIN_MARKER = 8;
/** Series line stroke width. */
export const SERIES_STROKE = 2;

/** Reserved strip height for the categorical legend (was copy-pasted as 26). */
export const LEGEND_HEIGHT = 26;
/** Reserved strip for a low→high gradient ramp legend (was copy-pasted as 24). */
export const GRADIENT_LEGEND_HEIGHT = 24;

/**
 * Named margin presets, replacing per-chart magic numbers. `axis` is the default
 * Cartesian inset; `bare` suits axis-less charts (donut, radial); `ranked` suits
 * horizontal bars whose category labels need a wide left gutter.
 */
export const MARGINS = {
  axis: { top: 12, right: 16, bottom: 28, left: 44 },
  bare: { top: 8, right: 8, bottom: 8, left: 8 },
  ranked: { top: 8, right: 48, bottom: 12, left: 100 },
} as const;

export type MarginPreset = keyof typeof MARGINS;

/**
 * Hover/active-mark emphasis: outline the ACTIVE mark; never dim its
 * siblings. This is the convention `treemap.tsx`, `heatmap.tsx`, and
 * `sankey-diagram.tsx` already used (each with its own copy of the same
 * `1.5`, before this constant existed) — every other chart independently
 * reinvented a "dim everyone else to some opacity" pattern instead, each
 * with a different, unrelated number (0.1-0.85, `docs/bug-classes.md`-style
 * drift). This constant is the one considered replacement for all of them.
 * Pair with the theme's `ink` role for the stroke color (a theme role, not
 * a fixed hex, so it adapts to light/dark) — e.g.
 * `stroke={active ? theme.ink : "none"}`, `strokeWidth={active ?
 * ACTIVE_STROKE_WIDTH : 0}`. For a mark shape where an outline doesn't read
 * well (a thin line, a small point), a size bump is the equivalent —
 * `radar-chart.tsx`'s vertex dots (`r={active ? 5 : 3}`) and
 * `bump-chart.tsx`'s active line (`strokeWidth={active ? 3 :
 * SERIES_STROKE}`) already do this; pick whichever mechanism fits the mark,
 * not one forced convention.
 */
export const ACTIVE_STROKE_WIDTH = 1.5;
