import chroma from "chroma-js";

/**
 * Contrast color for a palette's solid color: white when white on the solid has
 * a contrast ratio above 2.9, black otherwise. Shared by the palette generator
 * (`index.ts`) and the chart color generator (`chart-colors.ts`), so both agree
 * on which palettes have a white contrast color.
 */
export function calculateContrastColor(color: string): "#ffffff" | "#000000" {
  const white = "#ffffff";
  const black = "#000000";

  return chroma.contrast(white, color) > 2.9 ? white : black;
}
