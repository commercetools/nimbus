import { SYSTEM_COLOR_PALETTES } from "@/constants/color-palettes";

type SystemColorPalette = (typeof SYSTEM_COLOR_PALETTES)[number];

/**
 * Deterministically maps an input string to one of the 25 system color palettes.
 *
 * Uses the djb2 hashing algorithm to produce a stable, evenly-distributed
 * mapping. The same input always returns the same palette, making it suitable
 * for assigning consistent colors to entities such as user avatars, category
 * tags, or data visualization labels.
 *
 * @param input - The string to hash into a color palette.
 * @returns A system color palette name from the 25 available options.
 *
 * @example
 * ```tsx
 * const palette = stringToColorPalette("John Doe");
 * // palette is always the same value for "John Doe", e.g. "violet"
 *
 * <Avatar colorPalette={stringToColorPalette(user.name)}>JD</Avatar>
 * ```
 */
export const stringToColorPalette = (input: string): SystemColorPalette => {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0; // Convert to 32-bit integer
  }
  const index = Math.abs(hash) % SYSTEM_COLOR_PALETTES.length;
  return SYSTEM_COLOR_PALETTES[index];
};
