import { useId } from "react";
import { Area } from "recharts";
import { useChartContext } from "../chart.context";

/** Props of `Chart.Area` */
export type ChartAreaProps = {
  /** Data key of the series. It must be one of the `series` of `Chart.Root`. */
  dataKey: string;
  /**
   * Stacks this series on top of the other stacked series
   * @default false
   */
  stacked?: boolean;
};

/**
 * # Chart.Area
 *
 * Draws a series as a smooth line with a filled area. The fill fades from the
 * series color at the line to almost transparent at the baseline. Color,
 * label and animation come from `Chart.Root`.
 *
 * @example
 * ```tsx
 * <Chart.Area dataKey="visitors" />
 * ```
 */
export const ChartArea = ({ dataKey, stacked = false }: ChartAreaProps) => {
  const { series, isAnimationActive } = useChartContext();
  // `useId` can contain characters that are not valid in a url(#...) reference
  const gradientId = `${useId().replace(/[^a-zA-Z0-9_-]/g, "")}-fill`;
  const item = series.find((s) => s.key === dataKey);
  if (!item) return null;
  return (
    <>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor={item.color} stopOpacity={0.8} />
          <stop offset="95%" stopColor={item.color} stopOpacity={0.1} />
        </linearGradient>
      </defs>
      <Area
        dataKey={dataKey}
        // "monotone", not "natural": natural interpolation can overshoot and
        // draw below the data minimum (even below zero), which shows values
        // that are not in the data. Monotone never overshoots.
        type="monotone"
        fill={`url(#${gradientId})`}
        stroke={item.color}
        strokeWidth={2}
        stackId={stacked ? "stack" : undefined}
        isAnimationActive={isAnimationActive}
      />
    </>
  );
};

ChartArea.displayName = "Chart.Area";
