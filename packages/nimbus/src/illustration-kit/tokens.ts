import { designTokens } from "@commercetools/nimbus-tokens";

/**
 * Design values the illustrations are derived from. One illustration unit is
 * 4px for corner radii and 2.5px for shadows.
 */

type ColorMode = "light" | "dark";

const violet = designTokens.color["brand-palettes"].ctviolet;

/** Radius tokens an illustration may use, as `borderRadius` token names. */
export const RADIUS_TOKENS = ["50", "100", "150", "200", "300", "400"] as const;
export type RadiusToken = (typeof RADIUS_TOKENS)[number];

/** Nimbus `borderRadius` token px divided by 4 (one unit is 4px). */
export const RADII: Record<RadiusToken, number> = Object.fromEntries(
  RADIUS_TOKENS.map((token) => [
    token,
    parseFloat(designTokens.borderRadius[token]) / 4,
  ])
) as Record<RadiusToken, number>;

/**
 * Nimbus `shadow.3` (`0 4px 12px 0 hsla(0, 0%, 0%, 0.1)`) at one unit = 2.5px.
 * The dark value is stronger, because a soft shadow vanishes on dark surfaces.
 */
export const SHADOW = { dy: 1.6, blur: 2.4, light: 0.1, dark: 0.5 } as const;

/** The palette used when the SVG is not inlined and no page variables exist. */
export const FALLBACK_PALETTE = "ctviolet";

/** `ctviolet` color of a palette step, used as the CSS variable fallback. */
export const fallbackColor = (step: PaletteStep, mode: ColorMode): string => {
  const scale: Record<string, string> = violet[mode];
  const value = scale[String(step)];
  if (!value) {
    throw new Error(`No ${FALLBACK_PALETTE} ${mode} color for step ${step}`);
  }
  return value;
};

export type PaletteStep =
  1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | "contrast";
