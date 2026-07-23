import { SYSTEM_COLOR_PALETTES } from "@/constants";
import type { SystemColorPalette } from "@/type-utils";

/**
 * Deterministically maps a seed string to a 32-bit unsigned hash.
 *
 * Uses the djb2 algorithm (Daniel J. Bernstein), folding to an unsigned 32-bit
 * integer after every step so the result is stable across runs and platforms —
 * no dependency on `Math.random`, `crypto`, or engine-specific number handling.
 */
const hashSeed = (seed: string): number => {
  let hash = 5381;
  for (let i = 0; i < seed.length; i++) {
    // hash * 33 + charCode, kept within the unsigned 32-bit range.
    hash = (hash * 33 + seed.charCodeAt(i)) >>> 0;
  }
  return hash;
};

/**
 * Picks a system color palette that looks randomly assigned but is fully
 * reproducible from the given seed: the same seed always yields the same
 * palette, so a given user, tag, or category keeps a consistent color across
 * renders, reloads, and machines.
 *
 * Useful for decorative, non-semantic coloring — e.g. tinting an {@link Avatar},
 * Badge, or Tag by a stable identifier.
 *
 * @beta This utility is in **Beta**: more stable but still subject to breaking
 * changes. Use with caution in non-critical production.
 *
 * @param seed - Any string to derive the palette from (a user id, name, tag, …).
 *   An empty string is valid and returns a deterministic palette.
 * @returns One of the 25 {@link SYSTEM_COLOR_PALETTES} names.
 *
 * @example
 * ```tsx
 * <Avatar colorPalette={randomSystemColorPalette(user.id)} />
 * ```
 */
export const randomSystemColorPalette = (seed: string): SystemColorPalette => {
  const index = hashSeed(seed) % SYSTEM_COLOR_PALETTES.length;
  return SYSTEM_COLOR_PALETTES[index];
};
