import type { NimbusColorPalette } from "@/type-utils";

/**
 * Colors for segments without an explicit `colorPalette`, used in order and
 * repeated when there are more segments than colors.
 *
 * The order keeps the first colors as far apart as possible, also for color
 * vision deficiencies: it was chosen by CIEDE2000 distance between the step 9
 * colors, under normal vision and simulated protanopia, deuteranopia and
 * tritanopia. The first four colors keep a worst-case distance of 12.8 (the
 * earlier order: 6.1). The reasoning is in decision D6 of the OpenSpec change
 * `add-meter-component`. Palettes that look like a status are left out: the
 * semantic ones (positive, warning, critical, info) and those with the same
 * step 9 (blue = info, red = critical, grass = positive).
 */
export const METER_SEGMENT_PALETTES = [
  "primary",
  "orange",
  "teal",
  "gold",
  "pink",
  "brown",
] as const satisfies readonly NimbusColorPalette[];
