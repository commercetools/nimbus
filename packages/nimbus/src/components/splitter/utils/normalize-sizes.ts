/**
 * Normalize an aside size (a single percentage) into the valid `0–100` range,
 * with full float precision preserved (no rounding, no `minSize` clamp). Used
 * both to seed the initial size from `defaultSize` and to reconcile an inbound
 * controlled `size` prop.
 *
 * Returns `null` when the value is not a finite number — letting callers
 * distinguish "valid size" from "nothing usable" rather than silently inventing
 * a layout. A finite but out-of-range value is clamped into `[0, 100]`.
 *
 * @param size - The aside size as a percentage (e.g. `defaultSize` or `size`).
 * @returns A percentage in `[0, 100]`, or `null` when the input is unusable.
 *
 * @example
 * normalizeSize(25);   // → 25
 * normalizeSize(150);  // → 100
 * normalizeSize(NaN);  // → null
 */
export const normalizeSize = (
  size: number | null | undefined
): number | null => {
  if (typeof size !== "number" || !Number.isFinite(size)) return null;
  return Math.min(Math.max(size, 0), 100);
};
