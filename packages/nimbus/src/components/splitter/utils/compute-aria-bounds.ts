import type { SplitterPaneConfig } from "../splitter.types";

/**
 * The lowest position a pane's edge of the boundary can reach. Normally a
 * pane's `minSize`, but a collapsible pane can sit at its `collapsedSize` (the
 * discrete collapse state, below `minSize`), so the floor must include that —
 * otherwise `aria-valuenow` would fall outside the announced range while the
 * pane is collapsed.
 */
const collapseFloor = (cfg: SplitterPaneConfig): number =>
  cfg.collapsible
    ? Math.min(cfg.minSize ?? 0, cfg.collapsedSize ?? 0)
    : (cfg.minSize ?? 0);

/**
 * Compute the W3C window-splitter ARIA bounds for the boundary between two
 * panes — the lowest / highest position (0–100) the boundary can occupy:
 *
 *   min = collapseFloor(prev)
 *   max = 100 − collapseFloor(next)
 *
 * There is no separate `maxSize`: a pane's upper bound is simply its partner's
 * complement. Bounds are collapse-aware so `aria-valuenow` stays in range even
 * when a pane is collapsed below its `minSize`.
 *
 * @param prevCfg - Config of the previous (left/top) pane.
 * @param nextCfg - Config of the next (right/bottom) pane.
 * @returns `{ min, max }` for `aria-valuemin` / `aria-valuemax`.
 *
 * @example
 * computeAriaBounds({ minSize: 10 }, { minSize: 20 });
 * // → { min: 10, max: 80 }
 */
export const computeAriaBounds = (
  prevCfg: SplitterPaneConfig,
  nextCfg: SplitterPaneConfig
): { min: number; max: number } => ({
  min: collapseFloor(prevCfg),
  max: 100 - collapseFloor(nextCfg),
});
