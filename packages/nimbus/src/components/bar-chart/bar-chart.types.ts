import type { ChartBaseProps } from "@/components/chart/chart.types";

// ============================================================
// MAIN PROPS
// ============================================================

/**
 * Props of the `BarChart` component. Chakra style props apply to the root
 * element.
 */
export type BarChartProps = ChartBaseProps & {
  /**
   * Key of the data field that is shown on the x axis, for example `"month"`
   */
  xAxisKey: string;
  /**
   * Data keys of the series to draw, in drawing order. Each key must exist
   * in `config`; keys that are missing there are skipped.
   */
  series: string[];
  /**
   * Shows horizontal grid lines behind the bars
   * @default true
   */
  showGrid?: boolean;
  /**
   * Stacks the series on top of each other instead of placing them side by
   * side
   * @default false
   */
  stacked?: boolean;
};
