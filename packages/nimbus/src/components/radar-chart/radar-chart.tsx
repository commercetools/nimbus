import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart as RechartsRadarChart,
  Tooltip,
} from "recharts";
import { ChartContainer } from "@/components/chart/chart-container";
import { useChartContext } from "@/components/chart/chart.context";
import { ChartTooltip } from "@/components/chart/components/chart-tooltip";
import type { RadarChartProps } from "./radar-chart.types";

/** Opacity of the polygon fill. The outline uses the full series color. */
const RADAR_FILL_OPACITY = 0.3;

type RadarChartPlotProps = Pick<RadarChartProps, "data" | "xAxisKey"> & {
  showGrid: boolean;
};

/**
 * The Recharts chart. It reads the resolved series, the animation setting and
 * the accessible name from the surrounding `ChartContainer`.
 */
const RadarChartPlot = ({ data, xAxisKey, showGrid }: RadarChartPlotProps) => {
  const { series, isAnimationActive, showTooltip, ariaLabel } =
    useChartContext();

  return (
    <RechartsRadarChart data={data} aria-label={ariaLabel}>
      {showGrid && <PolarGrid />}
      <PolarAngleAxis dataKey={xAxisKey} />
      {showTooltip && <Tooltip content={<ChartTooltip />} />}
      {series.map((item) => (
        <Radar
          key={item.key}
          dataKey={item.key}
          stroke={item.color}
          strokeWidth={2}
          fill={item.color}
          fillOpacity={RADAR_FILL_OPACITY}
          dot={false}
          isAnimationActive={isAnimationActive}
        />
      ))}
    </RechartsRadarChart>
  );
};

/**
 * # RadarChart
 *
 * Compares several measures of one or more series on spokes around a center.
 * Each series is a polygon with a low-opacity fill and a full-color outline.
 * Pass the rows as `data`, the field that names each spoke as `xAxisKey`, the
 * data keys to draw as `series`, and the label and color of each series in
 * `config`. The legend is shown for two or more series.
 *
 * Needs the peer dependencies `recharts` and `react-is`.
 *
 * @example
 * ```tsx
 * <RadarChart
 *   aria-label="Skills by player"
 *   data={[
 *     { skill: "Speed", alpha: 120, beta: 80 },
 *     { skill: "Power", alpha: 98, beta: 130 },
 *     { skill: "Range", alpha: 86, beta: 100 },
 *   ]}
 *   xAxisKey="skill"
 *   series={["alpha", "beta"]}
 *   config={{
 *     alpha: { label: "Alpha", palette: "ctviolet" },
 *     beta: { label: "Beta", palette: "orange" },
 *   }}
 * />
 * ```
 *
 * @supportsStyleProps
 *
 * @experimental This component is experimental and may change or be removed in future versions.
 */
export const RadarChart = (props: RadarChartProps) => {
  const { xAxisKey, series, showGrid = true, ...rest } = props;

  return (
    <ChartContainer {...rest} seriesKeys={series}>
      <RadarChartPlot
        data={rest.data}
        xAxisKey={xAxisKey}
        showGrid={showGrid}
      />
    </ChartContainer>
  );
};

RadarChart.displayName = "RadarChart";
