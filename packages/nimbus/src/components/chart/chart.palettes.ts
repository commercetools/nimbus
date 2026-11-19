/**
 * A chart colors a series with the palette solid, `var(--nimbus-colors-<palette>-9)`,
 * the same token that components use through `colorPalette.9`.
 */

/** The palettes that can be used as chart colors (palettes with a white contrast color). */
export const chartPaletteNames = [
  "blue",
  "bronze",
  "brown",
  "crimson",
  "ctviolet",
  "cyan",
  "gold",
  "grass",
  "gray",
  "green",
  "indigo",
  "iris",
  "jade",
  "orange",
  "pink",
  "plum",
  "purple",
  "red",
  "ruby",
  "slate",
  "teal",
  "tomato",
  "violet",
] as const;

/** The name of a chart palette. */
export type ChartPalette = (typeof chartPaletteNames)[number];

/**
 * The order in which charts assign palettes to series by default. Palettes next
 * to each other, and any two palettes in this list, are easy to tell apart.
 */
export const defaultChartPaletteOrder = [
  "ctviolet",
  "orange",
  "teal",
  "crimson",
  "blue",
  "grass",
  "plum",
  "bronze",
  "cyan",
  "red",
  "slate",
] as const satisfies readonly ChartPalette[];
