import { LineChart as RechartsLineChart } from "recharts";
import { ChartContainer } from "@/components/chart/chart-container";
import { useChartContext } from "@/components/chart/chart.context";
import {
  ChartGrid,
  ChartLine,
  ChartTooltipPart,
  ChartXAxis,
} from "@/components/chart/components";
import type { LineChartProps } from "./line-chart.types";

type LineChartPlotProps = Pick<LineChartProps, "data" | "xAxisKey"> & {
  showGrid: boolean;
};

/**
 * The Recharts chart. It reads the resolved series, the animation setting and
 * the accessible name from the surrounding `ChartContainer`.
 */
const LineChartPlot = ({ data, xAxisKey, showGrid }: LineChartPlotProps) => {
  const { series, ariaLabel } = useChartContext();

  // The margin gives the first and last x axis label room at the chart edge.
  // `preserveStartEnd` always draws the first and last label, even when a
  // long label would cross the edge (the default interval drops it, and
  // `interval={0}` cuts it off). Middle labels that would overlap are dropped.
  return (
    <RechartsLineChart
      data={data}
      aria-label={ariaLabel}
      margin={{ left: 12, right: 12 }}
    >
      {showGrid && <ChartGrid />}
      <ChartXAxis dataKey={xAxisKey} />
      <ChartTooltipPart />
      {series.map((item) => (
        <ChartLine key={item.key} dataKey={item.key} />
      ))}
    </RechartsLineChart>
  );
};

/**
 * # LineChart
 *
 * Shows how values change along an ordered x axis, with one smooth line per
 * series. Pass the rows as `data`, the x axis field as `xAxisKey`, the data
 * keys to draw as `series`, and the label and color of each series in
 * `config`. With more than 3 series, each line also gets a dash pattern (six patterns in total; with more than 6 series the patterns repeat),
 * so color is not the only signal. The legend is shown for two or more series.
 *
 * @example
 * ```tsx
 * <LineChart
 *   aria-label="Visitors per month"
 *   data={[
 *     { month: "Jan", desktop: 186, mobile: 80 },
 *     { month: "Feb", desktop: 305, mobile: 200 },
 *   ]}
 *   xAxisKey="month"
 *   series={["desktop", "mobile"]}
 *   config={{
 *     desktop: { label: "Desktop", palette: "ctviolet" },
 *     mobile: { label: "Mobile", palette: "orange" },
 *   }}
 * />
 * ```
 *
 * @supportsStyleProps
 *
 * @experimental This component is experimental and may change or be removed in future versions.
 */
export const LineChart = (props: LineChartProps) => {
  const { xAxisKey, series, showGrid = true, ...rest } = props;

  return (
    <ChartContainer {...rest} seriesKeys={series}>
      <LineChartPlot data={rest.data} xAxisKey={xAxisKey} showGrid={showGrid} />
    </ChartContainer>
  );
};

LineChart.displayName = "LineChart";
