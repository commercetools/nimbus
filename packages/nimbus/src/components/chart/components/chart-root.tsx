import { ChartContainer } from "../chart-container";
import type { ChartRootProps } from "../chart.types";

/**
 * # Chart.Root
 *
 * The root of a composed chart. It sizes the chart, shows the loading and
 * empty states and the legend, resolves the series colors from `config`, and
 * shares them with the parts inside. It takes one `Chart.Plot` as child.
 * Pass the rows as `data`, the label and color of each series in `config`, and
 * `aria-label` (required). The legend is shown for two or more series.
 *
 * Needs the peer dependencies `recharts` and `react-is`.
 *
 * @example
 * ```tsx
 * <Chart.Root
 *   aria-label="Orders and trend per month"
 *   data={[
 *     { month: "Jan", orders: 186, trend: 150 },
 *     { month: "Feb", orders: 305, trend: 220 },
 *   ]}
 *   config={{
 *     orders: { label: "Orders", palette: "ctviolet" },
 *     trend: { label: "Trend", palette: "orange" },
 *   }}
 * >
 *   <Chart.Plot>
 *     <Chart.Grid />
 *     <Chart.XAxis dataKey="month" />
 *     <Chart.Tooltip />
 *     <Chart.Bar dataKey="orders" />
 *     <Chart.Line dataKey="trend" />
 *   </Chart.Plot>
 * </Chart.Root>
 * ```
 *
 * @supportsStyleProps
 *
 * @experimental This component is experimental and may change or be removed in future versions.
 */
export const ChartRoot = ({ series, config, ...rest }: ChartRootProps) => (
  <ChartContainer
    {...rest}
    config={config}
    seriesKeys={series ?? Object.keys(config)}
  />
);

ChartRoot.displayName = "Chart.Root";
