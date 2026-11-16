/**
 * Limits a value to the range between `minValue` and `maxValue`.
 *
 * A value inside the range is returned as it is, so no floating-point rounding
 * errors are added to it. `+Infinity` gives `maxValue`, `-Infinity` gives
 * `minValue`. `NaN` and an empty or inverted range (`maxValue` is not greater
 * than `minValue`) give `minValue`, like a meter that draws nothing.
 *
 * @param value - The value to limit
 * @param minValue - Lower bound of the range
 * @param maxValue - Upper bound of the range
 * @returns The value inside the range
 *
 * @example
 * clampToRange(150, 0, 100);
 * // 100
 */
export const clampToRange = (
  value: number,
  minValue: number,
  maxValue: number
): number => {
  if (Number.isNaN(value) || !(maxValue > minValue)) return minValue;
  return Math.min(Math.max(value, minValue), maxValue);
};
