import type { SplitterPaneConfig } from "../splitter.types";

/**
 * Build the initial sizes record for a 2-pane splitter from defaults.
 * Preference order:
 *   1. Explicit `defaultSizes` (validated for both pane ids, normalized to 100).
 *   2. Per-pane `panes[id].defaultSize` (normalized to sum to 100).
 *   3. Equal split (50/50) across the two panes.
 *
 * Initialization only ever runs once both panes have registered, so this
 * receives exactly two ids; any other count yields an empty record.
 *
 * @param paneIds - Registered pane ids, in DOM order (`[a, b]`).
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
  if (paneIds.length !== 2) return {};
  const [a, b] = paneIds as [string, string];

  // 1. Explicit `defaultSizes` for both panes, within 5 points of 100.
  const da = defaultSizes?.[a];
  const db = defaultSizes?.[b];
  if (typeof da === "number" && typeof db === "number") {
    const sum = da + db;
    if (sum > 0 && Math.abs(sum - 100) < 5) {
      // Normalize floating-point drift to exactly 100.
      return { [a]: (da / sum) * 100, [b]: (db / sum) * 100 };
    }
  }

  // 2. Per-pane `defaultSize` for both panes, normalized to 100.
  const pa = panes?.[a]?.defaultSize;
  const pb = panes?.[b]?.defaultSize;
  if (typeof pa === "number" && typeof pb === "number") {
    const sum = pa + pb;
    if (sum > 0) {
      return { [a]: (pa / sum) * 100, [b]: (pb / sum) * 100 };
    }
  }

  // 3. Equal split.
  return { [a]: 50, [b]: 50 };
};
