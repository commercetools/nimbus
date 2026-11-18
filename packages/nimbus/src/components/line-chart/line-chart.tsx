import {
  CartesianGrid,
  Line,
  LineChart as RechartsLineChart,
  Tooltip,
  XAxis,
} from "recharts";
import { ChartContainer } from "@/components/chart/chart-container";
import { useChartContext } from "@/components/chart/chart.context";
import { ChartTooltip } from "@/components/chart/components/chart-tooltip";
import type { LineChartProps } from "./line-chart.types";

/** Number of series up to which every line is solid and color is enough */
const MAX_SOLID_SERIES = 3;

/**
 * Dash patterns for charts with many series, in order. The first line is
 * solid. At a 2 px stroke the patterns differ in dash length, gap length or
 * rhythm: long dashes, short dots, a dash-dot cycle, very long dashes, and a
 * dot-dot-dash cycle. Each of the six is told apart from the others by more
 * than color. The list repeats after its last entry.
 */
const LINE_DASH_PATTERNS: readonly (string | undefined)[] = [
  undefined,
  "8 4",
  "2 4",
  "10 3 2 3",
  "14 4",
  "2 2 8 2 2 6",
];

type LineChartPlotProps = Pick<LineChartProps, "data" | "xAxisKey"> & {
  showGrid: boolean;
};

/**
 * The Recharts chart. It reads the resolved series, the animation setting and
 * the accessible name from the surrounding `ChartContainer`.
 */
const LineChartPlot = ({ data, xAxisKey, showGrid }: LineChartPlotProps) => {
  const { series, isAnimationActive, showTooltip, ariaLabel } =
    useChartContext();
  const isDashed = series.length > MAX_SOLID_SERIES;

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
      {showGrid && <CartesianGrid vertical={false} />}
      <XAxis
        dataKey={xAxisKey}
        axisLine={false}
        tickLine={false}
        interval="preserveStartEnd"
      />
      {showTooltip && <Tooltip content={<ChartTooltip />} />}
      {series.map((item, index) => (
        <Line
          key={item.key}
          dataKey={item.key}
          // "monotone", not "natural": natural interpolation can overshoot and
          // draw below the data minimum (even below zero), which shows values
          // that are not in the data. Monotone never overshoots.
          type="monotone"
          stroke={item.color}
          strokeWidth={2}
          strokeDasharray={
            isDashed
              ? LINE_DASH_PATTERNS[index % LINE_DASH_PATTERNS.length]
              : undefined
          }
          dot={false}
          isAnimationActive={isAnimationActive}
        />
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
 * Needs the peer dependencies `recharts` and `react-is`.
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
