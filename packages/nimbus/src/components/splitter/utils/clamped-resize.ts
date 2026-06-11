export type ClampedResizeArgs = {
  /** Current aside size (%), `0–100`. */
  size: number;
  /**
   * Δ in percentage points applied to the aside size. Accepts floats. The
   * handle translates its "grow the leading pane" gesture into an aside Δ before
   * calling (aside leading → `+Δ`; aside trailing → `−Δ`).
   */
  delta: number;
  /** Aside lower bound (%). */
  minSize: number;
  /** Aside upper bound (%) — caps aside growth; main's floor is `100 − maxSize`. */
  maxSize: number;
};

/**
 * Apply Δ to the aside size, clamped into the aside's `[minSize, maxSize]`
 * window. With one boundary, that window fully describes the constraint: the
 * main pane's floor is the complement (`100 − maxSize`), enforced here by the
 * `maxSize` ceiling. The result preserves full float precision (no rounding).
 *
 * @see specs/nimbus-splitter/spec.md "Aside size constraints with clamping"
 */
export const clampedResize = ({
  size,
  delta,
  minSize,
  maxSize,
}: ClampedResizeArgs): number =>
  Math.min(Math.max(size + delta, minSize), maxSize);
