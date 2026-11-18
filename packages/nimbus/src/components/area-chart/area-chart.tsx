import { useId } from "react";
import {
  Area,
  AreaChart as RechartsAreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
} from "recharts";
import { ChartContainer } from "@/components/chart/chart-container";
import { useChartContext } from "@/components/chart/chart.context";
import { ChartTooltip } from "@/components/chart/components/chart-tooltip";
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
  const { series, isAnimationActive, showTooltip, ariaLabel } =
    useChartContext();
  // `useId` can contain characters that are not valid in a url(#...) reference
  const chartId = useId().replace(/[^a-zA-Z0-9_-]/g, "");

  return (
    <RechartsAreaChart data={data} aria-label={ariaLabel}>
      <defs>
        {series.map((item, index) => (
          <linearGradient
            key={item.key}
            id={`${chartId}-fill-${index}`}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="5%" stopColor={item.color} stopOpacity={0.8} />
            <stop offset="95%" stopColor={item.color} stopOpacity={0.1} />
          </linearGradient>
        ))}
      </defs>
      {showGrid && <CartesianGrid vertical={false} />}
      <XAxis dataKey={xAxisKey} axisLine={false} tickLine={false} />
      {showTooltip && <Tooltip content={<ChartTooltip />} />}
      {series.map((item, index) => (
        <Area
          key={item.key}
          dataKey={item.key}
          // "monotone", not "natural": natural interpolation can overshoot and
          // draw below the data minimum (even below zero), which shows values
          // that are not in the data. Monotone never overshoots.
          type="monotone"
          fill={`url(#${chartId}-fill-${index})`}
          stroke={item.color}
          strokeWidth={2}
          stackId={stacked ? "stack" : undefined}
          isAnimationActive={isAnimationActive}
        />
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
