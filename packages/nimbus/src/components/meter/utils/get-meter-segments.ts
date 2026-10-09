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
  /**
   * Input segments, in order, with their clamped amount, drawn width and
   * share of the gaps between drawn segments
   */
  items: Array<
    T & { clampedValue: number; widthPercent: number; gapShare: number }
  >;
};

/**
 * Calculates how segments of a meter are drawn inside its track.
 *
 * Each segment value is an amount counted from `minValue`. Segments are placed
 * one after another; negative or non-finite amounts count as `0`, and the
 * segments are cut once the range between `minValue` and `maxValue` is full.
 * An empty or inverted range draws nothing.
 *
 * The track puts a gap between drawn segments. So that the fill still ends at
 * the total, each drawn segment gives up `gapShare` gaps of its width, in
 * proportion to its width: the shares add up to the number of gaps.
 *
 * @param segments - The segments, in drawing order
 * @param minValue - Lower bound of the meter range
 * @param maxValue - Upper bound of the meter range
 * @returns The clamped amount, width in percent and gap share for every segment
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

  const clamped = segments.map((segment) => {
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

  const total = range - remaining;
  const gapCount = Math.max(
    0,
    clamped.filter((item) => item.widthPercent > 0).length - 1
  );
  const items = clamped.map((item) => ({
    ...item,
    gapShare: total > 0 ? (item.clampedValue / total) * gapCount : 0,
  }));

  return {
    total,
    hasOverflow: range > 0 && requested > range,
    hasNegative,
    items,
  };
};
