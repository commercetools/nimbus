import { Bar } from "recharts";
import { useChartContext } from "../chart.context";

/** Props of `Chart.Bar` */
export type ChartBarProps = {
  /** Data key of the series. It must be one of the `series` of `Chart.Root`. */
  dataKey: string;
  /**
   * Stacks this series on top of the other stacked series
   * @default false
   */
  stacked?: boolean;
};

/**
 * # Chart.Bar
 *
 * Draws a series as vertical bars. Color, label and animation come from
 * `Chart.Root`. Adjacent bars are separated by a stroke in the background color.
 *
 * @example
 * ```tsx
 * <Chart.Bar dataKey="orders" />
 * ```
 */
export const ChartBar = ({ dataKey, stacked = false }: ChartBarProps) => {
  const { series, isAnimationActive } = useChartContext();
  const item = series.find((s) => s.key === dataKey);
  if (!item) return null;
  return (
    <Bar
      dataKey={dataKey}
      fill={item.color}
      stroke="var(--nimbus-colors-bg)"
      strokeWidth={2}
      stackId={stacked ? "stack" : undefined}
      isAnimationActive={isAnimationActive}
    />
  );
};

ChartBar.displayName = "Chart.Bar";
