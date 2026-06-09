import { normalizeSizes } from "./normalize-sizes";

/**
 * Build the initial sizes record for a 2-pane splitter from `defaultSizes`.
 * There is a single initialization path:
 *   1. Explicit `defaultSizes` for both pane ids (normalized to sum 100, with
 *      full float precision preserved).
 *   2. Otherwise an equal 50/50 split.
 *
 * Initialization only ever runs once both panes have registered, so this
 * receives exactly two ids; any other count yields an empty record.
 *
 * @param paneIds - Registered pane ids, in DOM order (`[a, b]`).
 * @param defaultSizes - Optional explicit id-keyed sizes from `Splitter.Root`.
 * @returns An id-keyed sizes record summing to 100.
 *
 * @example
 * deriveInitialSizes(["nav", "main"], { nav: 31.25, main: 68.75 });
 * // → { nav: 31.25, main: 68.75 }
 */
export const deriveInitialSizes = (
  paneIds: string[],
  defaultSizes: Record<string, number> | undefined
): Record<string, number> => {
  if (paneIds.length !== 2) return {};
  const [a, b] = paneIds as [string, string];

  // Explicit defaults (normalized to sum 100) when usable, else an equal split.
  return normalizeSizes(defaultSizes, paneIds) ?? { [a]: 50, [b]: 50 };
};
