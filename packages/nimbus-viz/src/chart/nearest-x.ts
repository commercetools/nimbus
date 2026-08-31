import { bisector } from "d3-array";

/** A continuous scale that can map a pixel position back to a domain value. */
export interface InvertibleScale<D extends number | Date> {
  invert: (pixel: number) => D;
}

/**
 * Index of the datum whose x is nearest a pixel position `px`, found by
 * inverting the scale to a domain value and bisecting.
 *
 * This is correct for **irregular / non-uniform** x spacing, unlike the
 * proportional `Math.round((px / innerWidth) * (n - 1))` mapping it replaces —
 * that only lands on the right datum when samples are perfectly evenly spaced,
 * and otherwise silently snaps the crosshair/readout to the wrong point (e.g.
 * a series with a data gap, or one whose sampling is denser at one end).
 *
 * `data` must be sorted ascending by `accessor` (charts build their series that
 * way). Returns `-1` for empty data and `0` for a single point. Values are
 * compared numerically (`Date` via its epoch), so number and time scales both
 * work.
 */
export function nearestIndexByX<T, D extends number | Date>(
  px: number,
  xScale: InvertibleScale<D>,
  data: readonly T[],
  accessor: (d: T) => D
): number {
  if (data.length === 0) return -1;
  if (data.length === 1) return 0;

  const x0 = xScale.invert(px);
  const i = bisector(accessor).left(data as T[], x0);
  if (i <= 0) return 0;
  if (i >= data.length) return data.length - 1;

  // `left` lands on the first datum whose x is >= x0; pick whichever neighbor
  // is actually closer in value.
  const target = Number(x0);
  const prev = Number(accessor(data[i - 1]));
  const next = Number(accessor(data[i]));
  return target - prev <= next - target ? i - 1 : i;
}
