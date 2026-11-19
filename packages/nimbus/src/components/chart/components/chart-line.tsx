import { Line } from "recharts";
import { useChartContext } from "../chart.context";

/** Number of series up to which every line is solid and color is enough */
export const MAX_SOLID_SERIES = 3;

/**
 * Dash patterns for charts with many series, in order. The first line is
 * solid. At a 2 px stroke the patterns differ in dash length, gap length or
 * rhythm: long dashes, short dots, a dash-dot cycle, very long dashes, and a
 * dot-dot-dash cycle. Each of the six is told apart from the others by more
 * than color. The list repeats after its last entry.
 */
export const LINE_DASH_PATTERNS: readonly (string | undefined)[] = [
  undefined,
  "8 4",
  "2 4",
  "10 3 2 3",
  "14 4",
  "2 2 8 2 2 6",
];

/** Props of `Chart.Line` */
export type ChartLineProps = {
  /** Data key of the series. It must be one of the `series` of `Chart.Root`. */
  dataKey: string;
};

/**
 * # Chart.Line
 *
 * Draws a series as a smooth line. Color, label and animation come from
 * `Chart.Root`. With more than 3 series in the chart, each line also gets a
 * dash pattern, so color is not the only signal.
 *
 * @example
 * ```tsx
 * <Chart.Line dataKey="trend" />
 * ```
 */
export const ChartLine = ({ dataKey }: ChartLineProps) => {
  const { series, isAnimationActive } = useChartContext();
  const index = series.findIndex((s) => s.key === dataKey);
  if (index === -1) return null;
  const isDashed = series.length > MAX_SOLID_SERIES;
  return (
    <Line
      dataKey={dataKey}
      // "monotone", not "natural": natural interpolation can overshoot and
      // draw below the data minimum (even below zero), which shows values
      // that are not in the data. Monotone never overshoots.
      type="monotone"
      stroke={series[index].color}
      strokeWidth={2}
      strokeDasharray={
        isDashed
          ? LINE_DASH_PATTERNS[index % LINE_DASH_PATTERNS.length]
          : undefined
      }
      dot={false}
      isAnimationActive={isAnimationActive}
    />
  );
};

ChartLine.displayName = "Chart.Line";
