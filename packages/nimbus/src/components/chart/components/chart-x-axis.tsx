import { XAxis } from "recharts";

/** Props of `Chart.XAxis` */
export type ChartXAxisProps = {
  /** Key of the data field that is shown on the x axis, for example `"month"` */
  dataKey: string;
};

/**
 * # Chart.XAxis
 *
 * The x axis, without axis line and tick marks. The first and last label are
 * always drawn; middle labels that would overlap are dropped.
 *
 * @example
 * ```tsx
 * <Chart.XAxis dataKey="month" />
 * ```
 */
export const ChartXAxis = ({ dataKey }: ChartXAxisProps) => (
  // `preserveStartEnd` always draws the first and last x axis label; middle
  // labels that would overlap are dropped.
  <XAxis
    dataKey={dataKey}
    axisLine={false}
    tickLine={false}
    interval="preserveStartEnd"
  />
);

ChartXAxis.displayName = "Chart.XAxis";
