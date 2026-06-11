import type { ResolvedAsideConfig } from "../splitter.types";

/**
 * The lowest size the aside can reach. Normally its `minSize`, but a collapsible
 * aside can sit at its `collapsedSize` (the discrete collapse state, below
 * `minSize`), so the floor must include that — otherwise `aria-valuenow` would
 * fall outside the announced range while the aside is collapsed.
 */
const asideFloor = (cfg: ResolvedAsideConfig): number =>
  cfg.collapsible ? Math.min(cfg.minSize, cfg.collapsedSize) : cfg.minSize;

/**
 * Compute the W3C window-splitter ARIA bounds for the boundary, expressed for
 * the **leading** pane (the handle's `aria-valuenow` tracks the leading pane's
 * size). The aside's allowed window is `[asideFloor, maxSize]`; the bounds are
 * mapped onto whichever pane leads:
 *
 *   - aside leads → `{ min: asideFloor, max: maxSize }`
 *   - main leads  → `{ min: 100 − maxSize, max: 100 − asideFloor }`
 *
 * Bounds are collapse-aware so `aria-valuenow` stays in range even when the
 * aside is collapsed below its `minSize`.
 *
 * @param asideConfig - Resolved aside constraints.
 * @param asideLeads - True when the aside is the leading (prev) sibling.
 * @returns `{ min, max }` for `aria-valuemin` / `aria-valuemax`.
 *
 * @example
 * computeAriaBounds({ minSize: 10, maxSize: 80, collapsible: false, collapsedSize: 0 }, true);
 * // → { min: 10, max: 80 }
 */
export const computeAriaBounds = (
  asideConfig: ResolvedAsideConfig,
  asideLeads: boolean
): { min: number; max: number } => {
  const floor = asideFloor(asideConfig);
  const ceil = asideConfig.maxSize;
  return asideLeads
    ? { min: floor, max: ceil }
    : { min: 100 - ceil, max: 100 - floor };
};
