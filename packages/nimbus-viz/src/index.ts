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
export { GridRows, leftTickLabel, bottomTickLabel } from "./chart/axes";
export { SvgTooltip } from "./chart/svg-tooltip";
export type { SvgTooltipProps } from "./chart/svg-tooltip";
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
