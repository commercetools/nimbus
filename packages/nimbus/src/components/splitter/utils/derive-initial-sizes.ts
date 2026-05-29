import type { SplitterPaneConfig } from "../splitter.types";

/**
 * Build the initial sizes record for a 2-pane splitter from defaults.
 * Preference order:
 *   1. Explicit `defaultSizes` (validated for both pane ids, normalized to 100).
 *   2. Per-pane `panes[id].defaultSize` (normalized to sum to 100).
 *   3. Equal split (50/50) across the two panes.
 *
 * Initialization only ever runs once both panes have registered, so this
 * receives exactly two ids; an empty `paneIds` array yields an empty record.
 *
 * @param paneIds - Registered pane ids, in DOM order.
 * @param defaultSizes - Optional explicit id-keyed sizes from `Splitter.Root`.
 * @param panes - Optional per-pane configuration map from `Splitter.Root`.
 * @returns An id-keyed sizes record summing to 100.
 *
 * @example
 * deriveInitialSizes(["nav", "main"], undefined, { nav: { defaultSize: 30 }, main: { defaultSize: 70 } });
 * // → { nav: 30, main: 70 }
 */
export const deriveInitialSizes = (
  paneIds: string[],
  defaultSizes: Record<string, number> | undefined,
  panes: Record<string, SplitterPaneConfig> | undefined
): Record<string, number> => {
  if (paneIds.length === 0) return {};

  if (defaultSizes) {
    const present = paneIds.every((id) => typeof defaultSizes[id] === "number");
    if (present) {
      const sum = paneIds.reduce((acc, id) => acc + defaultSizes[id]!, 0);
      if (sum > 0 && Math.abs(sum - 100) < 5) {
        // Normalize floating-point drift to exactly 100.
        return Object.fromEntries(
          paneIds.map((id) => [id, (defaultSizes[id]! / sum) * 100])
        );
      }
    }
  }

  const fromPanes = paneIds.map((id) => panes?.[id]?.defaultSize);
  const allDefined = fromPanes.every((s) => typeof s === "number");
  if (allDefined) {
    const sum = fromPanes.reduce<number>((acc, s) => acc + (s as number), 0);
    if (sum > 0) {
      return Object.fromEntries(
        paneIds.map((id, i) => [id, ((fromPanes[i] as number) / sum) * 100])
      );
    }
  }

  const share = 100 / paneIds.length;
  return Object.fromEntries(paneIds.map((id) => [id, share]));
};
