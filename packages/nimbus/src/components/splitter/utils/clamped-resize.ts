import type { SplitterPaneConfig } from "../splitter.types";

const DEFAULT_MIN = 0;
const DEFAULT_MAX = 100;

const config = (
  paneConfigs: Record<string, SplitterPaneConfig> | undefined,
  paneId: string
): SplitterPaneConfig => paneConfigs?.[paneId] ?? {};

/**
 * Compute the effective min/max for a pane. `collapsedSize` (when defined and
 * less than `minSize`) lowers the floor only when `commitCollapse` is true —
 * during normal drag, the minimum is `minSize`; only when committing a
 * collapse (Enter, double-click, or `useMove` end-of-drag intent) may a pane
 * fall through to `collapsedSize`.
 */
const effectiveBounds = (
  cfg: SplitterPaneConfig,
  options: { commitCollapse?: boolean } = {}
): { min: number; max: number } => {
  const min = cfg.minSize ?? DEFAULT_MIN;
  const max = cfg.maxSize ?? DEFAULT_MAX;
  if (options.commitCollapse && cfg.collapsible) {
    const collapsedSize = cfg.collapsedSize ?? 0;
    return { min: Math.min(min, collapsedSize), max };
  }
  return { min, max };
};

/**
 * Snap a value to `collapsedSize` when the user is committing a collapse and
 * the resulting size would otherwise sit below the regular `minSize`. Returns
 * the input unchanged outside the commit-collapse path.
 */
const snapToCollapsedSize = (
  size: number,
  cfg: SplitterPaneConfig,
  options: { commitCollapse?: boolean }
): number => {
  if (!options.commitCollapse || !cfg.collapsible) return size;
  const minSize = cfg.minSize ?? DEFAULT_MIN;
  const collapsedSize = cfg.collapsedSize ?? 0;
  if (size < minSize && size <= (minSize + collapsedSize) / 2) {
    return collapsedSize;
  }
  return size;
};

export type ClampedResizeOptions = {
  /**
   * When true, a collapsible pane may pass through its `minSize` and snap to
   * `collapsedSize`. Used by Enter / double-click / imperative collapse paths.
   * During regular drag this is false — drag stops at `minSize`.
   */
  commitCollapse?: boolean;
};

export type ClampedResizeArgs = {
  /** Current sizes record (two entries, summing to 100). */
  sizes: Record<string, number>;
  /** Ids of the two panes the handle controls: `prev` grows when Δ > 0. */
  handlePanes: { prev: string; next: string };
  /** Δ in percentage points applied to `sizes[prev]`. */
  delta: number;
  /** Per-pane configuration map (from Root's `panes` prop). */
  paneConfigs?: Record<string, SplitterPaneConfig>;
  /** Optional behavior flags (e.g., commitCollapse for Enter / double-click). */
  options?: ClampedResizeOptions;
};

/**
 * Apply Δ to a 2-pane sizes record, clamping at each pane's min/max. There
 * is no cascade — with only two panes, there is nowhere to spill remainder.
 * The result always sums to 100 (within floating-point tolerance).
 *
 * Behaviour:
 * 1. Attempt `next = prev + Δ` and `nextSize = nextOld − Δ`.
 * 2. Clamp Δ to whatever fits within both panes' effective bounds.
 * 3. When `options.commitCollapse` is true and the resulting `next` pane
 *    would fall below its `minSize`, snap it to `collapsedSize` instead
 *    (only when the pane is `collapsible`).
 *
 * @see specs/nimbus-splitter/spec.md "Per-pane size constraints with clamping"
 */
export const clampedResize = ({
  sizes,
  handlePanes,
  delta,
  paneConfigs,
  options = {},
}: ClampedResizeArgs): Record<string, number> => {
  const { prev, next } = handlePanes;
  const prevCfg = config(paneConfigs, prev);
  const nextCfg = config(paneConfigs, next);

  const prevBounds = effectiveBounds(prevCfg, options);
  const nextBounds = effectiveBounds(nextCfg, options);

  const prevOld = sizes[prev] ?? 0;
  const nextOld = sizes[next] ?? 0;

  const total = prevOld + nextOld;

  // Compute the allowable Δ range so that both panes remain within bounds.
  const maxDelta = Math.min(
    prevBounds.max - prevOld, // prev cannot exceed its max
    nextOld - nextBounds.min // next cannot fall below its min
  );
  const minDelta = Math.max(
    prevBounds.min - prevOld, // prev cannot fall below its min
    nextOld - nextBounds.max // next cannot exceed its max
  );

  const clamped = Math.min(Math.max(delta, minDelta), maxDelta);

  let prevNew = prevOld + clamped;
  let nextNew = nextOld - clamped;

  // Commit-collapse path: snap the shrinking pane to `collapsedSize` when
  // the user has expressed collapse intent (Enter, double-click).
  if (options.commitCollapse) {
    if (clamped < 0) {
      const snapped = snapToCollapsedSize(prevNew, prevCfg, options);
      if (snapped !== prevNew) {
        prevNew = snapped;
        nextNew = total - prevNew;
      }
    } else if (clamped > 0) {
      const snapped = snapToCollapsedSize(nextNew, nextCfg, options);
      if (snapped !== nextNew) {
        nextNew = snapped;
        prevNew = total - nextNew;
      }
    }
  }

  return { ...sizes, [prev]: prevNew, [next]: nextNew };
};
