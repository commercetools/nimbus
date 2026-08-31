// @commercetools/nimbus-viz — data visualization library for the Nimbus design
// system. Prototype-stage: the public surface grows as components land.

// Theming
export * from "./theme";

// Shared chart chrome
export * from "./chart/types";
export { ChartFrame } from "./chart/chart-frame";
export type { ChartFrameProps, InnerDims } from "./chart/chart-frame";
export { ChartContainer } from "./chart/chart-container";
export type { ChartContainerProps } from "./chart/chart-container";
export { Legend } from "./chart/legend";
export type { LegendItem } from "./chart/legend";
export {
  DATA_END_RADIUS,
  SURFACE_GAP,
  MIN_MARKER,
  SERIES_STROKE,
  LEGEND_HEIGHT,
  GRADIENT_LEGEND_HEIGHT,
  MARGINS,
} from "./chart/marks";
export type { MarginPreset } from "./chart/marks";
export { makeValueScale } from "./chart/scales";
export type { ValueScaleKind, ValueScaleConfig } from "./chart/scales";
export { useReducedMotion, MOTION } from "./chart/use-reduced-motion";
export { useForcedColors } from "./chart/use-forced-colors";
export {
  createFormatters,
  ChartLocaleProvider,
  useChartFormatters,
} from "./chart/format-locale";
export type {
  ChartFormatters,
  ChartFormatOptions,
  ChartLocaleProviderProps,
} from "./chart/format-locale";
export { ChartPatternDefs, patternFill } from "./chart/patterns";
export type { ChartPatternDefsProps, PatternKind } from "./chart/patterns";
export { FacetGrid } from "./chart/facet-grid";
export type { FacetGridProps, Facet } from "./chart/facet-grid";
export { lttb } from "./chart/decimate";
export type { XYPoint } from "./chart/decimate";
export { Brush, orderRange } from "./chart/brush";
export type { BrushProps } from "./chart/brush";
export { useControlledSelection } from "./chart/interaction";
export type {
  DatumEvent,
  DatumClickHandler,
  DatumHoverHandler,
  SelectionChangeHandler,
  InteractionProps,
} from "./chart/interaction";
export { nearestIndexByX } from "./chart/nearest-x";
export type { InvertibleScale } from "./chart/nearest-x";

// Statistical helpers (regression, control limits, KDE, five-number summary).
export * as stats from "./stats";

// Composed dashboard recipes.
export * from "./recipes";
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
export { DivergingStackedBar } from "./components/diverging-stacked-bar";
export type { DivergingStackedBarProps } from "./components/diverging-stacked-bar";
export { PopulationPyramid } from "./components/population-pyramid";
export type { PopulationPyramidProps } from "./components/population-pyramid";
export { MarimekkoChart } from "./components/marimekko-chart";
export type { MarimekkoChartProps } from "./components/marimekko-chart";
export { BeeswarmPlot } from "./components/beeswarm-plot";
export type { BeeswarmPlotProps } from "./components/beeswarm-plot";
export { CumulativeCurve } from "./components/cumulative-curve";
export type { CumulativeCurveProps } from "./components/cumulative-curve";
export { ConnectedScatterplot } from "./components/connected-scatterplot";
export type { ConnectedScatterplotProps } from "./components/connected-scatterplot";
export { SunburstChart } from "./components/sunburst-chart";
export type { SunburstChartProps } from "./components/sunburst-chart";
export { ViolinPlot } from "./components/violin-plot";
export type { ViolinPlotProps, SampleGroup } from "./components/violin-plot";
export { CandlestickChart } from "./components/candlestick-chart";
export type {
  CandlestickChartProps,
  OhlcBar,
} from "./components/candlestick-chart";
export { GanttChart } from "./components/gantt-chart";
export type { GanttChartProps, TimelineEvent } from "./components/gantt-chart";
export { ChordDiagram } from "./components/chord-diagram";
export type { ChordDiagramProps, FlowMatrix } from "./components/chord-diagram";
export { TileGridMap } from "./components/tile-grid-map";
export type { TileGridMapProps, RegionTile } from "./components/tile-grid-map";
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
