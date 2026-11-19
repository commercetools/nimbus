import { BarChart as RechartsBarChart } from "recharts";
import { ChartContainer } from "@/components/chart/chart-container";
import { useChartContext } from "@/components/chart/chart.context";
import {
  ChartBar,
  ChartGrid,
  ChartTooltipPart,
  ChartXAxis,
} from "@/components/chart/components";
import type { BarChartProps } from "./bar-chart.types";

type BarChartPlotProps = Pick<
  BarChartProps,
  "data" | "xAxisKey" | "stacked"
> & {
  showGrid: boolean;
};

/**
 * The Recharts chart. It reads the resolved series, the animation setting and
 * the accessible name from the surrounding `ChartContainer`.
 */
const BarChartPlot = ({
  data,
  xAxisKey,
  stacked,
  showGrid,
}: BarChartPlotProps) => {
  const { series, ariaLabel } = useChartContext();

  return (
    <RechartsBarChart data={data} aria-label={ariaLabel}>
      {showGrid && <ChartGrid />}
      <ChartXAxis dataKey={xAxisKey} />
      <ChartTooltipPart />
      {series.map((item) => (
        <ChartBar key={item.key} dataKey={item.key} stacked={stacked} />
      ))}
    </RechartsBarChart>
  );
};

/**
 * # BarChart
 *
 * Compares values across categories with vertical bars. Pass the rows as
 * `data`, the x axis field as `xAxisKey`, the data keys to draw as `series`,
 * and the label and color of each series in `config`. Series sit side by side,
 * or on top of each other with `stacked`. The legend is shown for two or more
 * series.
 *
 * @example
 * ```tsx
 * <BarChart
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
export const BarChart = (props: BarChartProps) => {
  const { xAxisKey, series, showGrid = true, stacked = false, ...rest } = props;

  return (
    <ChartContainer {...rest} seriesKeys={series}>
      <BarChartPlot
        data={rest.data}
        xAxisKey={xAxisKey}
        stacked={stacked}
        showGrid={showGrid}
      />
    </ChartContainer>
  );
};

BarChart.displayName = "BarChart";
