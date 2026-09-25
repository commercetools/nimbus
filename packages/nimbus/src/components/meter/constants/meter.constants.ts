import type { NimbusColorPalette } from "@/type-utils";

/**
 * Colors for segments without an explicit `colorPalette`, used in order and
 * repeated when there are more segments than colors.
 *
 * Every palette's step 11 (the fill step) has a contrast ratio of at least
 * 3:1 against the meter track in light and dark mode (WCAG 2.1 SC 1.4.11).
 * Semantic state palettes (positive, warning, critical) are left out so a
 * default segment never looks like a status.
 */
export const METER_SEGMENT_PALETTES = [
  "primary",
  "teal",
  "orange",
  "pink",
  "blue",
  "brown",
] as const satisfies readonly NimbusColorPalette[];
