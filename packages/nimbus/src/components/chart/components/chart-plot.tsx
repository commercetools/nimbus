import type { ReactNode } from "react";
import { ComposedChart } from "recharts";
import { useChartContext } from "../chart.context";

/** Props of `Chart.Plot` */
export type ChartPlotProps = {
  /**
   * The parts to draw: `Chart.Grid`, `Chart.XAxis`, `Chart.Tooltip` and the
   * series (`Chart.Bar`, `Chart.Line`, `Chart.Area`), in any mix
   */
  children: ReactNode;
};

/**
 * # Chart.Plot
 *
 * The drawing area of a composed chart. It takes the rows and the accessible
 * name from `Chart.Root`, and holds the grid, axis, tooltip and series parts.
 * A 12 px margin at both sides gives the first and last x axis label room.
 *
 * @example
 * ```tsx
 * <Chart.Plot>
 *   <Chart.XAxis dataKey="month" />
 *   <Chart.Bar dataKey="orders" />
 * </Chart.Plot>
 * ```
 */
export const ChartPlot = ({ children }: ChartPlotProps) => {
  const { data, ariaLabel } = useChartContext();
  return (
    <ComposedChart
      data={data}
      aria-label={ariaLabel}
      margin={{ left: 12, right: 12 }}
    >
      {children}
    </ComposedChart>
  );
};

ChartPlot.displayName = "Chart.Plot";
