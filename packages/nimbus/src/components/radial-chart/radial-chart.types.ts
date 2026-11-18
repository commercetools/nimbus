import type { ChartBaseProps } from "@/components/chart/chart.types";

// ============================================================
// MAIN PROPS
// ============================================================

/**
 * Props of the `RadialChart` component. Chakra style props apply to the root
 * element.
 */
export type RadialChartProps = ChartBaseProps & {
  /**
   * Key of the data field that holds the category name, for example
   * `"browser"`. The values of this field are the categories, in data order.
   * Each category takes its label and color from the `config` entry with the
   * same name. If two rows have the same name, both are drawn and the legend
   * lists the name once.
   */
  nameKey: string;
  /**
   * Key of the data field that holds the numeric value of each category, for
   * example `"visitors"`. The rings show relative size, not a share of a
   * total: the ring with the largest value is a full circle, and every other
   * ring is drawn relative to it.
   */
  valueKey: string;
};
