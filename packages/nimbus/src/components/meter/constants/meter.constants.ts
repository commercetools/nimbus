import type { NimbusColorPalette } from "@/type-utils";

/**
 * Colors for segments without an explicit `colorPalette`, used in order and
 * repeated when there are more segments than colors.
 *
 * The order keeps the first colors as far apart as possible, also for color
 * vision deficiencies (CIEDE2000 on step 9; see `design.md` D6). Palettes
 * that look like a status are left out: the semantic ones (positive, warning,
 * critical, info) and those with the same step 9 (blue = info, red =
 * critical, green = positive).
 */
export const METER_SEGMENT_PALETTES = [
  "primary",
  "orange",
  "teal",
  "gold",
  "pink",
  "brown",
] as const satisfies readonly NimbusColorPalette[];
