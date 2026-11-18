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
   * same name.
   */
  nameKey: string;
  /**
   * Key of the data field that holds the numeric value of each category, for
   * example `"visitors"`
   */
  valueKey: string;
};
