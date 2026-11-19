import {
  ChartArea,
  ChartBar,
  ChartGrid,
  ChartLine,
  ChartPlot,
  ChartRoot,
  ChartTooltipPart,
  ChartXAxis,
} from "./components";

/**
 * # Chart
 *
 * Parts to compose charts that `BarChart`, `LineChart` and `AreaChart` cannot
 * draw, for example bars and a line in one chart. Colors, labels, tooltip,
 * legend, loading and empty states are the same as in the six charts.
 * `PieChart`, `RadarChart` and `RadialChart` are not composable.
 *
 * @experimental This component is experimental and may change or be removed in future versions.
 */
export const Chart = {
  /**
   * # Chart.Root
   *
   * The root of a composed chart. Takes `data`, `config`, `aria-label`
   * (required) and an optional `series` list, and one `Chart.Plot` as child.
   *
   * @example
   * ```tsx
   * <Chart.Root aria-label="Orders" data={data} config={config}>
   *   <Chart.Plot>
   *     <Chart.XAxis dataKey="month" />
   *     <Chart.Bar dataKey="orders" />
   *   </Chart.Plot>
   * </Chart.Root>
   * ```
   */
  Root: ChartRoot,

  /**
   * # Chart.Plot
   *
   * The drawing area. Holds the grid, axis, tooltip and series parts.
   *
   * @example
   * ```tsx
   * <Chart.Plot>
   *   <Chart.Bar dataKey="orders" />
   * </Chart.Plot>
   * ```
   */
  Plot: ChartPlot,

  /**
   * # Chart.Grid
   *
   * Horizontal grid lines. Leave it out to hide the grid.
   *
   * @example
   * ```tsx
   * <Chart.Grid />
   * ```
   */
  Grid: ChartGrid,

  /**
   * # Chart.XAxis
   *
   * The x axis. `dataKey` is the data field that is shown on it.
   *
   * @example
   * ```tsx
   * <Chart.XAxis dataKey="month" />
   * ```
   */
  XAxis: ChartXAxis,

  /**
   * # Chart.Tooltip
   *
   * The tooltip of the active data point. Hidden when `showTooltip` of
   * `Chart.Root` is `false`.
   *
   * @example
   * ```tsx
   * <Chart.Tooltip />
   * ```
   */
  Tooltip: ChartTooltipPart,

  /**
   * # Chart.Bar
   *
   * A series drawn as vertical bars. Use `stacked` to stack.
   *
   * @example
   * ```tsx
   * <Chart.Bar dataKey="orders" />
   * ```
   */
  Bar: ChartBar,

  /**
   * # Chart.Line
   *
   * A series drawn as a smooth line.
   *
   * @example
   * ```tsx
   * <Chart.Line dataKey="trend" />
   * ```
   */
  Line: ChartLine,

  /**
   * # Chart.Area
   *
   * A series drawn as a smooth line with a filled area. Use `stacked` to
   * stack.
   *
   * @example
   * ```tsx
   * <Chart.Area dataKey="visitors" />
   * ```
   */
  Area: ChartArea,
};
