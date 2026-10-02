/**
 * Result of {@link getMeterSegments}.
 */
export type MeterSegmentsGeometry<T> = {
  /** Sum of all clamped segment amounts (never larger than the range) */
  total: number;
  /** Whether the segment amounts add up to more than the range */
  hasOverflow: boolean;
  /** Whether at least one segment has a negative amount */
  hasNegative: boolean;
  /** Input segments, in order, with their clamped amount and drawn width */
  items: Array<T & { clampedValue: number; widthPercent: number }>;
};

/**
 * Calculates how segments of a meter are drawn inside its track.
 *
 * Each segment value is an amount counted from `minValue`. Segments are placed
 * one after another; negative or non-finite amounts count as `0`, and the
 * segments are cut once the range between `minValue` and `maxValue` is full.
 * An empty or inverted range draws nothing.
 *
 * @param segments - The segments, in drawing order
 * @param minValue - Lower bound of the meter range
 * @param maxValue - Upper bound of the meter range
 * @returns The clamped amount and width in percent for every segment
 *
 * @example
 * getMeterSegments([{ value: 30 }, { value: 20 }], 0, 100);
 * // total: 50, widths: [30, 20]
 */
export const getMeterSegments = <T extends { value: number }>(
  segments: T[],
  minValue: number,
  maxValue: number
): MeterSegmentsGeometry<T> => {
  const range = Math.max(0, maxValue - minValue);
  let remaining = range;
  let requested = 0;
  let hasNegative = false;

  const items = segments.map((segment) => {
    if (segment.value < 0) hasNegative = true;
    const amount = Number.isFinite(segment.value)
      ? Math.max(0, segment.value)
      : 0;
    requested += amount;

    const clampedValue = Math.min(amount, remaining);
    remaining -= clampedValue;

    return {
      ...segment,
      clampedValue,
      widthPercent: range === 0 ? 0 : (clampedValue / range) * 100,
    };
  });

  return {
    total: range - remaining,
    hasOverflow: range > 0 && requested > range,
    hasNegative,
    items,
  };
};
