import type { NimbusColorPalette } from "@/type-utils";

/**
 * Colors for segments without an explicit `colorPalette`, used in order and
 * repeated when there are more segments than colors.
 *
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
