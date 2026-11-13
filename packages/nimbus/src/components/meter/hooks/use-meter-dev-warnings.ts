import { useCallback, useEffect, useRef } from "react";

type UseMeterDevWarningsOptions = {
  /** Whether the meter shows `segments` (not a single `value`) */
  isSegmented: boolean;
  /** Whether there is at least one segment to show */
  hasSegmentsToShow: boolean;
  /** Whether the segment amounts add up to more than the range */
  hasOverflow: boolean;
  /** Whether at least one segment has a negative amount */
  hasNegative: boolean;
  /** Lower bound of the range, named in the overflow warning */
  minValue: number;
  /** Upper bound of the range, named in the overflow warning */
  maxValue: number;
};

type UseMeterDevWarningsReturn = {
  /**
   * Registers a mounted `Meter.Legend`, so the hook can warn about segments
   * without a legend. Returns the function that unregisters it.
   */
  registerLegend: () => () => void;
};

/**
 * Logs the development warnings of `Meter.Root`: segments that exceed the
 * range, negative segment values, and segments without a `Meter.Legend`. Each
 * warning is logged once per meter, also when StrictMode runs the effects twice
 * or the values change. Nothing is logged in production.
 *
 * `Meter.Legend` registers in a layout effect, so the legend count is final
 * when the effects of this hook run.
 *
 * @param options - What the warnings depend on
 * @returns `registerLegend`, for the legend to announce itself to the meter
 *
 * @example
 * const { registerLegend } = useMeterDevWarnings({
 *   isSegmented,
 *   hasSegmentsToShow,
 *   hasOverflow,
 *   hasNegative,
 *   minValue,
 *   maxValue,
 * });
 */
export const useMeterDevWarnings = ({
  isSegmented,
  hasSegmentsToShow,
  hasOverflow,
  hasNegative,
  minValue,
  maxValue,
}: UseMeterDevWarningsOptions): UseMeterDevWarningsReturn => {
  const legendCountRef = useRef(0);
  const registerLegend = useCallback(() => {
    legendCountRef.current += 1;
    return () => {
      legendCountRef.current -= 1;
    };
  }, []);

  const hasWarnedOverflowRef = useRef(false);
  const hasWarnedNegativeRef = useRef(false);
  useEffect(() => {
    if (process.env.NODE_ENV === "production" || !isSegmented) return;
    if (hasOverflow && !hasWarnedOverflowRef.current) {
      hasWarnedOverflowRef.current = true;
      console.warn(
        `Meter.Root: the sum of segment values exceeds the range (${minValue} to ${maxValue}). Segments are cut at maxValue.`
      );
    }
    if (hasNegative && !hasWarnedNegativeRef.current) {
      hasWarnedNegativeRef.current = true;
      console.warn(
        "Meter.Root: segment values must not be negative. Negative values are treated as 0."
      );
    }
  }, [isSegmented, hasOverflow, hasNegative, minValue, maxValue]);

  const hasWarnedMissingLegendRef = useRef(false);
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    if (
      !hasSegmentsToShow ||
      legendCountRef.current > 0 ||
      hasWarnedMissingLegendRef.current
    ) {
      return;
    }
    hasWarnedMissingLegendRef.current = true;
    console.warn(
      "Meter.Root: segments are told apart by color only. Add <Meter.Legend> so each segment shows its name and value."
    );
  }, [hasSegmentsToShow]);

  return { registerLegend };
};
