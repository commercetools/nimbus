import type { ChartBaseProps } from "@/components/chart/chart.types";

// ============================================================
// MAIN PROPS
// ============================================================

/**
 * Props of the `PieChart` component. Chakra style props apply to the root
 * element.
 */
export type PieChartProps = ChartBaseProps & {
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
   * example `"visitors"`. The size of a slice is its value divided by the sum
   * of all values.
   */
  valueKey: string;
};
