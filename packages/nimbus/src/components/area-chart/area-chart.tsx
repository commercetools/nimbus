import { AreaChart as RechartsAreaChart } from "recharts";
import { ChartContainer } from "@/components/chart/chart-container";
import { useChartContext } from "@/components/chart/chart.context";
import {
  ChartArea,
  ChartGrid,
  ChartTooltipPart,
  ChartXAxis,
} from "@/components/chart/components";
import type { AreaChartProps } from "./area-chart.types";

type AreaChartPlotProps = Pick<
  AreaChartProps,
  "data" | "xAxisKey" | "stacked"
> & {
  showGrid: boolean;
};

/**
 * The Recharts chart. It reads the resolved series, the animation setting and
 * the accessible name from the surrounding `ChartContainer`.
 */
const AreaChartPlot = ({
  data,
  xAxisKey,
  stacked,
  showGrid,
}: AreaChartPlotProps) => {
  const { series, ariaLabel } = useChartContext();

  // The margin gives the first and last x axis label room at the chart edge.
  // `preserveStartEnd` always draws the first and last label, even when a
  // long label would cross the edge (the default interval drops it, and
  // `interval={0}` cuts it off). Middle labels that would overlap are dropped.
  return (
    <RechartsAreaChart
      data={data}
      aria-label={ariaLabel}
      margin={{ left: 12, right: 12 }}
    >
      {showGrid && <ChartGrid />}
      <ChartXAxis dataKey={xAxisKey} />
      <ChartTooltipPart />
      {series.map((item) => (
        <ChartArea key={item.key} dataKey={item.key} stacked={stacked} />
      ))}
    </RechartsAreaChart>
  );
};

/**
 * # AreaChart
 *
 * Shows how values change along an ordered x axis, with a smooth line and a
 * filled area per series. The fill fades from the series color at the line to
 * almost transparent at the baseline. Pass the rows as `data`, the x axis
 * field as `xAxisKey`, the data keys to draw as `series`, and the label and
 * color of each series in `config`. Use `stacked` to add the series up. The
 * legend is shown for two or more series.
 *
 * Needs the peer dependencies `recharts` and `react-is`.
 *
 * @example
 * ```tsx
 * <AreaChart
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
export const AreaChart = (props: AreaChartProps) => {
  const { xAxisKey, series, showGrid = true, stacked = false, ...rest } = props;

  return (
    <ChartContainer {...rest} seriesKeys={series}>
      <AreaChartPlot
        data={rest.data}
        xAxisKey={xAxisKey}
        stacked={stacked}
        showGrid={showGrid}
      />
    </ChartContainer>
  );
};

AreaChart.displayName = "AreaChart";
