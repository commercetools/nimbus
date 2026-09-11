/* -------------------------------------------------------------------------- */
/* Runtime text-legibility helper.                                            */
/*                                                                            */
/* Picks black-vs-white (ink vs surface) text for a colored cell background by */
/* the background's ACTUAL WCAG contrast — not a fixed data-value threshold —  */
/* so in-cell labels flip at the point the background truly darkens, for any   */
/* hue and either color mode.                                                  */
/* -------------------------------------------------------------------------- */

import { hexToRgb } from "./oklab";

const srgbToLinear = (c: number): number =>
  c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

/** WCAG 2.1 relative luminance of an sRGB hex color. */
function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex);
  return (
    0.2126 * srgbToLinear(r) +
    0.7152 * srgbToLinear(g) +
    0.0722 * srgbToLinear(b)
  );
}

/** WCAG 2.1 contrast ratio between two hex colors (1..21). */
export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const hi = Math.max(la, lb);
  const lo = Math.min(la, lb);
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * Return whichever of `ink` / `surface` reads more legibly on `bg`, by actual
 * WCAG contrast. Use for text placed on a colored cell (heatmap, RFM grid,
 * cohort triangle) instead of a value-based cutoff.
 */
export function readableTextColor(
  bg: string,
  ink: string,
  surface: string
): string {
  return contrastRatio(bg, surface) >= contrastRatio(bg, ink) ? surface : ink;
}
