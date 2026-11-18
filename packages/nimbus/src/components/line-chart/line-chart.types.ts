import type { ChartBaseProps } from "@/components/chart/chart.types";

// ============================================================
// MAIN PROPS
// ============================================================

/**
 * Props of the `LineChart` component. Chakra style props apply to the root
 * element.
 */
export type LineChartProps = ChartBaseProps & {
  /**
   * Key of the data field that is shown on the x axis, for example `"month"`
   */
  xAxisKey: string;
  /**
   * Data keys of the series to draw, in drawing order. Each key must exist
   * in `config`; keys that are missing there are skipped. With more than 3
   * series, each line also gets its own dash pattern, so color is not the
   * only way to tell the lines apart.
   */
  series: string[];
  /**
   * Shows horizontal grid lines behind the lines
   * @default true
   */
  showGrid?: boolean;
};
