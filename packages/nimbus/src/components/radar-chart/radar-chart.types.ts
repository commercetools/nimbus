import type { ChartBaseProps } from "@/components/chart/chart.types";

// ============================================================
// MAIN PROPS
// ============================================================

/**
 * Props of the `RadarChart` component. Chakra style props apply to the root
 * element.
 */
export type RadarChartProps = ChartBaseProps & {
  /**
   * Key of the data field that names each spoke of the radar, for example
   * `"skill"`
   */
  xAxisKey: string;
  /**
   * Data keys of the series to draw, in drawing order. Each key must exist
   * in `config`; keys that are missing there are skipped.
   */
  series: string[];
  /**
   * Shows the polar grid (the rings and spokes) behind the series
   * @default true
   */
  showGrid?: boolean;
};
