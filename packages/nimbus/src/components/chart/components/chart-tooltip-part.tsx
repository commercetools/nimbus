import { Tooltip } from "recharts";
import { useChartContext } from "../chart.context";
import { ChartTooltip } from "./chart-tooltip";

/**
 * # Chart.Tooltip
 *
 * The tooltip of the active data point, with the label, color and value of
 * each series. It is announced by screen readers. It draws nothing when
 * `showTooltip` of `Chart.Root` is `false`.
 *
 * @example
 * ```tsx
 * <Chart.Tooltip />
 * ```
 */
export const ChartTooltipPart = () => {
  const { showTooltip } = useChartContext();
  if (!showTooltip) return null;
  return <Tooltip content={<ChartTooltip />} />;
};

ChartTooltipPart.displayName = "Chart.Tooltip";
