import { createContext, useContext } from "react";
import type { ResolvedChartSeries } from "./utils/chart-config";

/**
 * Values that `ChartContainer` resolves once and shares with the chart,
 * tooltip and legend, so labels and colors always match the drawing.
 */
export type ChartContextValue = {
  /** Series with resolved label and CSS color, unknown keys already removed */
  series: ResolvedChartSeries[];
  /** Whether Recharts animates the drawing (prop, else off under reduced motion) */
  isAnimationActive: boolean;
  /** Whether the chart renders its tooltip */
  showTooltip: boolean;
  /** Accessible name of the chart, for the Recharts chart element */
  ariaLabel: string;
};

export const ChartContext = createContext<ChartContextValue | undefined>(
  undefined
);

/**
 * Hook to access the resolved series and the animation setting.
 * @returns The values from the surrounding `ChartContainer`
 * @throws Error if used outside of `ChartContainer`
 */
export const useChartContext = (): ChartContextValue => {
  const context = useContext(ChartContext);
  if (!context) {
    throw new Error("useChartContext must be used within ChartContainer");
  }
  return context;
};
