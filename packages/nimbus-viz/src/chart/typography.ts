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

/** Reference size the `em` label sizes are authored against (see `emText`). */
export const BASE_FONT_REFERENCE = 10;

/**
 * The baseline label size in px, fluid with the chart's size (clamped so it
 * stays legible on small cards and doesn't balloon on large canvases). Drives
 * both the inherited baseline and — via `em` — every other label.
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
 * ambient typography leaks in.
 */
export function chartRootStyle(width: number, height: number): CSSProperties {
  return {
    fontFamily: CHART_FONT_STACK,
    fontSize: baseFontSize(width, height),
    fontWeight: 400,
    fontStyle: "normal",
    letterSpacing: "normal",
    lineHeight: 1,
  };
}

/**
 * A per-label size expressed relative to the inherited baseline. Pass the px
 * size the label was historically authored at (against `BASE_FONT_REFERENCE`);
 * returns an inline `style` in `em` that wins the cascade and scales with the
 * chart. e.g. `emText(11)` → `{ fontSize: "1.1em" }`.
 */
export function emText(px: number): CSSProperties {
  return { fontSize: `${+(px / BASE_FONT_REFERENCE).toFixed(3)}em` };
}
