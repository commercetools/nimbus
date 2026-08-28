import { designTokens } from "@commercetools/nimbus-tokens";

export type ColorMode = "light" | "dark";

const systemPalettes = designTokens.color["system-palettes"];

/**
 * Resolve a Nimbus system color step to its concrete value (an HSL string) for
 * the given color mode. This is the single seam through which chart color
 * reaches the library — every role in `roles.ts` is expressed as one of these
 * lookups, so no chart ever holds a literal color.
 */
export function systemStep(
  hue: string,
  step: number | string,
  mode: ColorMode
): string {
  const palette = systemPalettes[hue];
  if (!palette) {
    throw new Error(`nimbus-viz: unknown Nimbus system palette "${hue}"`);
  }
  const value = palette[mode][String(step)];
  if (!value) {
    throw new Error(
      `nimbus-viz: no step ${step} in palette "${hue}" (${mode})`
    );
  }
  return value;
}
