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
