import type { SplitterPaneConfig } from "../splitter.types";

const DEFAULT_MIN = 0;

const config = (
  paneConfigs: Record<string, SplitterPaneConfig> | undefined,
  paneId: string
): SplitterPaneConfig => paneConfigs?.[paneId] ?? {};

export type ClampedResizeArgs = {
  /** Current sizes record (two entries, summing to 100). */
  sizes: Record<string, number>;
  /** Ids of the two panes the handle controls: `prev` grows when Δ > 0. */
  handlePanes: { prev: string; next: string };
  /** Δ in percentage points applied to `sizes[prev]`. Accepts floats. */
  delta: number;
  /** Per-pane configuration map (from Root's `panes` prop). */
  paneConfigs?: Record<string, SplitterPaneConfig>;
};

/**
 * Apply Δ to a 2-pane sizes record, clamping at each pane's `minSize`. There
 * is no cascade — with only two panes, there is nowhere to spill remainder,
 * and no separate `maxSize`: a pane's upper bound is simply
 * `100 − partner.minSize`, which the clamp below enforces. The result always
 * sums to 100, with full float precision preserved (no rounding).
 *
 * Behaviour:
 * 1. Attempt `prev += Δ` and `next −= Δ`.
 * 2. Clamp Δ so neither pane falls below its `minSize`.
 *
 * @see specs/nimbus-splitter/spec.md "Per-pane size constraints with clamping"
 */
export const clampedResize = ({
  sizes,
  handlePanes,
  delta,
  paneConfigs,
}: ClampedResizeArgs): Record<string, number> => {
  const { prev, next } = handlePanes;
  const prevMin = config(paneConfigs, prev).minSize ?? DEFAULT_MIN;
  const nextMin = config(paneConfigs, next).minSize ?? DEFAULT_MIN;

  const prevOld = sizes[prev] ?? 0;
  const nextOld = sizes[next] ?? 0;

  // Allowable Δ range so that both panes stay at or above their `minSize`.
  // prev cannot exceed its upper bound (`next` cannot fall below `nextMin`),
  // and prev cannot fall below `prevMin`.
  const maxDelta = nextOld - nextMin;
  const minDelta = prevMin - prevOld;

  const clamped = Math.min(Math.max(delta, minDelta), maxDelta);

  return {
    ...sizes,
    [prev]: prevOld + clamped,
    [next]: nextOld - clamped,
  };
};
