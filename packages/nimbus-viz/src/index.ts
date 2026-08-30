// @commercetools/nimbus-viz — data visualization library for the Nimbus design
// system. Prototype-stage: the public surface grows as components land.

// Theming
export * from "./theme";

// Shared chart chrome
export * from "./chart/types";
export { ChartFrame } from "./chart/chart-frame";
export type { ChartFrameProps, InnerDims } from "./chart/chart-frame";
export { Legend } from "./chart/legend";
export type { LegendItem } from "./chart/legend";
export {
  GridRows,
  leftTickLabel,
  bottomTickLabel,
  fitBandLabel,
} from "./chart/axes";
export { SvgTooltip } from "./chart/svg-tooltip";
export type { SvgTooltipProps } from "./chart/svg-tooltip";
export { ChartScaleProvider, useChartScales } from "./chart/scale-context";
export type {
  ChartScales,
  ChartScaleProviderProps,
} from "./chart/scale-context";
export * from "./chart/format";

// Infrastructure
export { ResponsiveContainer } from "./infra/responsive-container";
export type { ResponsiveContainerProps } from "./infra/responsive-container";

// Charts
export { LineChart } from "./components/line-chart";
export type { LineChartProps } from "./components/line-chart";
export { BarChart } from "./components/bar-chart";
export type { BarChartProps } from "./components/bar-chart";
export { StatCard } from "./components/stat-card";
export type { StatCardProps } from "./components/stat-card";
export { LollipopChart } from "./components/lollipop-chart";
export type { LollipopChartProps } from "./components/lollipop-chart";
export { RadialBarChart } from "./components/radial-bar-chart";
export type { RadialBarChartProps } from "./components/radial-bar-chart";
export { WaffleChart } from "./components/waffle-chart";
export type { WaffleChartProps } from "./components/waffle-chart";
export { DivergingBarChart } from "./components/diverging-bar-chart";
export type { DivergingBarChartProps } from "./components/diverging-bar-chart";
export { DonutChart } from "./components/donut-chart";
export type { DonutChartProps } from "./components/donut-chart";
export { StackedBarChart } from "./components/stacked-bar-chart";
export type { StackedBarChartProps } from "./components/stacked-bar-chart";
export { ScatterPlot } from "./components/scatter-plot";
export type { ScatterPlotProps } from "./components/scatter-plot";
export { Heatmap } from "./components/heatmap";
export type { HeatmapProps } from "./components/heatmap";
export { GroupedBarChart } from "./components/grouped-bar-chart";
export type { GroupedBarChartProps } from "./components/grouped-bar-chart";
export { FunnelChart } from "./components/funnel-chart";
export type { FunnelChartProps } from "./components/funnel-chart";
export { SankeyDiagram } from "./components/sankey-diagram";
export type { SankeyDiagramProps } from "./components/sankey-diagram";
export { WaterfallChart } from "./components/waterfall-chart";
export type {
  WaterfallChartProps,
  WaterfallStep,
} from "./components/waterfall-chart";
export { BulletChart } from "./components/bullet-chart";
export type { BulletChartProps, BulletDatum } from "./components/bullet-chart";
export { Gauge } from "./components/gauge";
export type { GaugeProps } from "./components/gauge";
export { Histogram } from "./components/histogram";
export type { HistogramProps } from "./components/histogram";
export { BoxPlot } from "./components/box-plot";
export type { BoxPlotProps, BoxPlotGroupStats } from "./components/box-plot";
export { Treemap } from "./components/treemap";
export type { TreemapProps, TreemapNode } from "./components/treemap";
export { StackedAreaChart } from "./components/stacked-area-chart";
export type { StackedAreaChartProps } from "./components/stacked-area-chart";
export { Streamgraph } from "./components/streamgraph";
export type { StreamgraphProps } from "./components/streamgraph";
export { SlopeChart } from "./components/slope-chart";
export type { SlopeChartProps, SlopeRow } from "./components/slope-chart";
export { DumbbellChart } from "./components/dumbbell-chart";
export type {
  DumbbellChartProps,
  DumbbellRow,
} from "./components/dumbbell-chart";
export { BumpChart } from "./components/bump-chart";
export type { BumpChartProps } from "./components/bump-chart";
export { BubbleChart } from "./components/bubble-chart";
export type { BubbleChartProps, BubblePoint } from "./components/bubble-chart";
export { Sparkline } from "./components/sparkline";
export type { SparklineProps } from "./components/sparkline";
export { RadarChart } from "./components/radar-chart";
export type { RadarChartProps, RadarSeries } from "./components/radar-chart";
export { ParallelCoordinates } from "./components/parallel-coordinates";
export type {
  ParallelCoordinatesProps,
  ParallelDimension,
  ParallelRow,
} from "./components/parallel-coordinates";
export { CalendarHeatmap } from "./components/calendar-heatmap";
export type {
  CalendarHeatmapProps,
  CalendarDatum,
} from "./components/calendar-heatmap";
export { RfmGrid } from "./components/rfm-grid";
export type { RfmGridProps, RfmCell } from "./components/rfm-grid";
export { CohortTriangle } from "./components/cohort-triangle";
export type { CohortTriangleProps } from "./components/cohort-triangle";
export { ControlChart } from "./components/control-chart";
export type { ControlChartProps } from "./components/control-chart";
export { ParetoChart } from "./components/pareto-chart";
export type { ParetoChartProps } from "./components/pareto-chart";

// Layer-2 overlays (composable annotations over base charts)
export * from "./overlays";

// Selection engine ("the brain") + DataTable fallback
export * from "./selection";
