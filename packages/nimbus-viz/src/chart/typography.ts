import type { CSSProperties } from "react";

/**
 * Chart typography isolation + fluid sizing.
 *
 * Why this exists: a host global reset (Nimbus/Chakra ships
 * `* { font-size: inherit; font-family: inherit }` in its `@layer reset`)
 * matches every SVG `<text>`, and a real CSS rule always beats an SVG
 * *presentation attribute* — so a chart's `font-size="10"` attribute is
 * ignored and labels inherit the page's body size (typically 16px). The fix
 * is to establish the chart's typography with declarations that WIN the
 * cascade: an inline `style` on the root `<svg>` (below), from which — because
 * the reset makes everything inherit — every label then inherits a known
 * baseline. Per-label sizes that differ from the baseline are expressed in
 * `em` (relative to that baseline) via `emText`, so they both win the cascade
 * and scale with the chart.
 */

/** Pinned so charts render identically inside and outside a Nimbus host. */
export const CHART_FONT_STACK =
  "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

/** Reference size for mark scaling (see `chartScale`), and the size the legacy
 * `emText` args were authored against. */
export const BASE_FONT_REFERENCE = 10;

/**
 * The two legible chart-text tiers, in px. Chart text is intentionally NOT
 * fluid: a 12px label is legible whether the chart is a 200px card or an 800px
 * dashboard panel, and below ~12px SVG text hurts (low-vision readers most).
 * So every piece of text renders at one of exactly two fixed sizes:
 *
 *   - LABEL_PX (12) — secondary chrome: axis ticks, legend, annotations.
 *   - EMPHASIS_PX (14) — primary text you read off the chart: data/series
 *     labels, tooltips, stage/callout labels.
 *
 * Genuine display readouts (a StatCard's hero number, a donut/sunburst centre)
 * sit above both tiers and keep their own larger size.
 */
export const LABEL_PX = 12;
export const EMPHASIS_PX = 14;

/**
 * Fluid size driver for NON-text marks only (dot radii, stroke widths, tick
 * lengths) via {@link chartScale}. Text no longer uses this — it uses the fixed
 * {@link LABEL_PX}/{@link EMPHASIS_PX} tiers — so marks may still track chart
 * size while labels stay at a fixed legible size.
 */
export function baseFontSize(width: number, height: number): number {
  const s = Math.min(width, height);
  return Math.max(9, Math.min(13, s / 28));
}

/**
 * Scale factor for non-text marks (dot radii, stroke widths, tick lengths) so
 * they track the fluid type. 1 at the reference size.
 */
export function chartScale(width: number, height: number): number {
  return baseFontSize(width, height) / BASE_FONT_REFERENCE;
}

/**
 * Inline typographic baseline for a chart's root `<svg>`. Inline so it beats
 * the host's `*{…:inherit}` reset; neutral weight/spacing/line-height so no
 * ambient typography leaks in. The inherited baseline is the secondary tier
 * ({@link LABEL_PX}), so every label that sets no size of its own — axis ticks
 * especially — renders at a legible 12px.
 */
export function chartRootStyle(): CSSProperties {
  return {
    fontFamily: CHART_FONT_STACK,
    fontSize: LABEL_PX,
    fontWeight: 400,
    fontStyle: "normal",
    letterSpacing: "normal",
    lineHeight: 1,
  };
}

/**
 * A per-label font size, returned as an inline `style` that wins the host reset
 * cascade. Historically this took the px size a label was authored at (against
 * `BASE_FONT_REFERENCE`) and returned an `em`; now that chart text uses two
 * fixed legible tiers, the historical size is snapped onto them:
 *
 *   - ≤ 10px  → {@link LABEL_PX} (12) — ticks, annotations, secondary chrome
 *   - 11–14px → {@link EMPHASIS_PX} (14) — data/series labels, tooltips
 *   - ≥ 15px  → unchanged — genuine display readouts (donut/sunburst centre)
 *
 * Call sites still read naturally (`emText(11)`); a later pass can rename to
 * explicit `label()` / `emphasis()` helpers once the tiers are settled.
 */
export function emText(px: number): CSSProperties {
  const size = px <= 10 ? LABEL_PX : px <= 14 ? EMPHASIS_PX : px;
  return { fontSize: size };
}
