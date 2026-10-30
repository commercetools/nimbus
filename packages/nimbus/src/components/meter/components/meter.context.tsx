import { createContext, useContext } from "react";
import type { MeterSegment } from "../meter.types";

/**
 * A segment as `Meter.Track` and `Meter.Legend` draw it.
 */
export type MeterResolvedSegment = MeterSegment & {
  /** Amount that is drawn, after negative values and overflow are cut */
  clampedValue: number;
  /** Width in percent of the track */
  widthPercent: number;
  /** Number of segment gaps this segment gives up, so the fill ends at the value */
  gapShare: number;
  /** Formatted `clampedValue`, as shown in the legend */
  formattedValue: string;
};

/**
 * Values that `Meter.Root` computes and the parts show
 */
export type MeterContextValue = {
  /** Whether the meter shows `segments` (not a single `value`) */
  isSegmented: boolean;
  /** Segments to draw; a single value is one segment without a palette */
  items: MeterResolvedSegment[];
  /** Formatted total, or `valueLabel` when it is set */
  totalText: string;
  /** Whether Meter.Root has a `valueLabel` */
  hasValueLabel: boolean;
  /**
   * Registers a mounted `Meter.Legend`, so Root can warn about segments
   * without a legend. Returns the function that unregisters it.
   */
  registerLegend: () => () => void;
};

export const MeterContext = createContext<MeterContextValue | undefined>(
  undefined
);

/**
 * Hook to access the values that Meter.Root computes
 * @returns Segments, value text and legend registration from Meter.Root
 * @throws Error if used outside of Meter.Root
 */
export const useMeterContext = (): MeterContextValue => {
  const context = useContext(MeterContext);
  if (!context) {
    throw new Error("useMeterContext must be used within Meter.Root");
  }
  return context;
};
