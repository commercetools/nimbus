// Layer-2 overlays — composable annotations that draw in a base chart's inner
// plot space via the shared scale contract (`ChartScaleProvider`). Rendered as
// children of a chart; non-interactive so they never steal hover from the
// marks. One overlay component serves every chart that publishes the contract.

export { ReferenceLine } from "./reference-line";
export type { ReferenceLineProps } from "./reference-line";
export { ThresholdBand } from "./threshold-band";
export type { ThresholdBandProps } from "./threshold-band";
export { TargetMarker } from "./target-marker";
export type { TargetMarkerProps } from "./target-marker";
export { TrendLine } from "./trend-line";
export type { TrendLineProps, TrendLinePoint } from "./trend-line";
export { ErrorBars } from "./error-bars";
export type { ErrorBarsProps, ErrorBarPoint } from "./error-bars";
export { ConfidenceBand } from "./confidence-band";
export type {
  ConfidenceBandProps,
  ConfidenceBandPoint,
} from "./confidence-band";
export { BenchmarkSeries } from "./benchmark-series";
export type { BenchmarkSeriesProps, BenchmarkPoint } from "./benchmark-series";

export type { OverlayVariant } from "./variant";
