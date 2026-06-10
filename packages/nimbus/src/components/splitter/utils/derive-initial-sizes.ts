import { normalizeSize } from "./normalize-sizes";

/**
 * Derive the initial aside size (%) for a splitter from `defaultSize`. There is
 * a single initialization path:
 *   1. Explicit `defaultSize` (clamped into `0–100`, full float precision).
 *   2. Otherwise an equal 50/50 split.
 *
 * @param defaultSize - Optional explicit aside size from `Splitter.Root`.
 * @returns The aside size as a percentage (`0–100`).
 *
 * @example
 * deriveInitialSize(31.25); // → 31.25
 * deriveInitialSize(undefined); // → 50
 */
export const deriveInitialSize = (defaultSize: number | undefined): number =>
  normalizeSize(defaultSize) ?? 50;
