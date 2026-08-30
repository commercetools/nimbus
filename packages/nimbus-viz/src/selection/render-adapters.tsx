import type { ReactNode } from "react";
import { LineChart } from "../components/line-chart";
import { BarChart } from "../components/bar-chart";
import { DonutChart } from "../components/donut-chart";
import { StackedBarChart } from "../components/stacked-bar-chart";
import { GroupedBarChart } from "../components/grouped-bar-chart";
import { ScatterPlot } from "../components/scatter-plot";
import { Heatmap } from "../components/heatmap";
import { FunnelChart } from "../components/funnel-chart";
import { StackedAreaChart } from "../components/stacked-area-chart";
import { Streamgraph } from "../components/streamgraph";
import { BumpChart } from "../components/bump-chart";
import { Sparkline } from "../components/sparkline";
import { ControlChart } from "../components/control-chart";
import { ParetoChart } from "../components/pareto-chart";
import { SlopeChart } from "../components/slope-chart";
import type { SlopeRow } from "../components/slope-chart";
import { DumbbellChart } from "../components/dumbbell-chart";
import type { DumbbellRow } from "../components/dumbbell-chart";
import { BubbleChart } from "../components/bubble-chart";
import type { BubblePoint } from "../components/bubble-chart";
import { RadarChart } from "../components/radar-chart";
import type { RadarSeries } from "../components/radar-chart";
import { ParallelCoordinates } from "../components/parallel-coordinates";
import type {
  ParallelDimension,
  ParallelRow,
} from "../components/parallel-coordinates";
import { CalendarHeatmap } from "../components/calendar-heatmap";
import type { CalendarDatum } from "../components/calendar-heatmap";
import { RfmGrid } from "../components/rfm-grid";
import type { RfmCell } from "../components/rfm-grid";
import { Histogram } from "../components/histogram";
import { BoxPlot } from "../components/box-plot";
import type { BoxPlotGroupStats } from "../components/box-plot";
import { WaterfallChart } from "../components/waterfall-chart";
import type { WaterfallStep } from "../components/waterfall-chart";
import { BulletChart } from "../components/bullet-chart";
import type { BulletDatum } from "../components/bullet-chart";
import { SankeyDiagram } from "../components/sankey-diagram";
import { Treemap } from "../components/treemap";
import type { TreemapNode } from "../components/treemap";
import { Gauge } from "../components/gauge";
import { StatCard } from "../components/stat-card";
import { LollipopChart } from "../components/lollipop-chart";
import { RadialBarChart } from "../components/radial-bar-chart";
import { WaffleChart } from "../components/waffle-chart";
import { DivergingBarChart } from "../components/diverging-bar-chart";
import { DivergingStackedBar } from "../components/diverging-stacked-bar";
import { PopulationPyramid } from "../components/population-pyramid";
import { MarimekkoChart } from "../components/marimekko-chart";
import type { FlowGraph } from "../chart/types";
import { CohortTriangle } from "../components/cohort-triangle";
import type {
  CategoryDatum,
  FunnelStage,
  HeatRow,
  ScatterPoint,
  Series,
  StackRow,
} from "../chart/types";
import type { ChartSize, ResolveRequest } from "./types";

/**
 * Base render adapters — map a `request` (+ size, + optional overlay children)
 * onto a base chart's props. Shared by the registry's canonical entries and by
 * the preset factory (`presets.tsx`), which is why they live here rather than in
 * the registry: it keeps registry ↔ presets free of an import cycle.
 *
 * The concrete `DataKind` is guaranteed by the filter before an adapter runs, so
 * the `as` narrowings below are validated, not blind. `overlays` is threaded
 * only into the charts that publish the scale contract (line / vertical bar /
 * scatter); the others ignore it.
 */

/* -------------------------------------------------------------------------- */
/* Option readers (no `any`; `unknown` + narrowing)                           */
/* -------------------------------------------------------------------------- */

export function opts(request: ResolveRequest): Record<string, unknown> {
  return request.options ?? {};
}

export function optString(
  request: ResolveRequest,
  key: string
): string | undefined {
  const v = opts(request)[key];
  return typeof v === "string" ? v : undefined;
}

export function optNumber(
  request: ResolveRequest,
  key: string
): number | undefined {
  const v = opts(request)[key];
  return typeof v === "number" && Number.isFinite(v) ? v : undefined;
}

export function optStringArray(
  request: ResolveRequest,
  key: string
): string[] | undefined {
  const v = opts(request)[key];
  if (!Array.isArray(v)) return undefined;
  return v.filter((item): item is string => typeof item === "string");
}

/* -------------------------------------------------------------------------- */
/* Base adapters                                                              */
/* -------------------------------------------------------------------------- */

export function renderLine(
  request: ResolveRequest,
  size: ChartSize,
  overlays?: ReactNode
) {
  const variant = optString(request, "variant") === "area" ? "area" : "line";
  return (
    <LineChart
      width={size.width}
      height={size.height}
      series={request.data as Series[]}
      variant={variant}
      ariaLabel={optString(request, "ariaLabel")}
    >
      {overlays}
    </LineChart>
  );
}

export function renderBarVertical(
  request: ResolveRequest,
  size: ChartSize,
  overlays?: ReactNode
) {
  return (
    <BarChart
      width={size.width}
      height={size.height}
      data={request.data as CategoryDatum[]}
      orientation="vertical"
      ariaLabel={optString(request, "ariaLabel")}
    >
      {overlays}
    </BarChart>
  );
}

export function renderBarHorizontal(request: ResolveRequest, size: ChartSize) {
  return (
    <BarChart
      width={size.width}
      height={size.height}
      data={request.data as CategoryDatum[]}
      orientation="horizontal"
      ariaLabel={optString(request, "ariaLabel")}
    />
  );
}

export function renderDonut(request: ResolveRequest, size: ChartSize) {
  return (
    <DonutChart
      width={size.width}
      height={size.height}
      data={request.data as CategoryDatum[]}
      ariaLabel={optString(request, "ariaLabel")}
    />
  );
}

export function renderStacked(request: ResolveRequest, size: ChartSize) {
  return (
    <StackedBarChart
      width={size.width}
      height={size.height}
      data={request.data as StackRow[]}
      ariaLabel={optString(request, "ariaLabel")}
    />
  );
}

export function renderGrouped(request: ResolveRequest, size: ChartSize) {
  return (
    <GroupedBarChart
      width={size.width}
      height={size.height}
      data={request.data as StackRow[]}
      ariaLabel={optString(request, "ariaLabel")}
    />
  );
}

export function renderScatter(
  request: ResolveRequest,
  size: ChartSize,
  overlays?: ReactNode
) {
  return (
    <ScatterPlot
      width={size.width}
      height={size.height}
      points={request.data as ScatterPoint[]}
      ariaLabel={optString(request, "ariaLabel")}
    >
      {overlays}
    </ScatterPlot>
  );
}

export function renderHeatmap(request: ResolveRequest, size: ChartSize) {
  return (
    <Heatmap
      width={size.width}
      height={size.height}
      rows={request.data as HeatRow[]}
      hue={optString(request, "hue")}
      columnLabels={optStringArray(request, "columnLabels")}
      ariaLabel={optString(request, "ariaLabel")}
    />
  );
}

export function renderFunnel(request: ResolveRequest, size: ChartSize) {
  return (
    <FunnelChart
      width={size.width}
      height={size.height}
      data={request.data as FunnelStage[]}
      ariaLabel={optString(request, "ariaLabel")}
    />
  );
}

export function renderStackedArea(request: ResolveRequest, size: ChartSize) {
  return (
    <StackedAreaChart
      width={size.width}
      height={size.height}
      series={request.data as Series[]}
      ariaLabel={optString(request, "ariaLabel")}
    />
  );
}

export function renderStreamgraph(request: ResolveRequest, size: ChartSize) {
  return (
    <Streamgraph
      width={size.width}
      height={size.height}
      series={request.data as Series[]}
      ariaLabel={optString(request, "ariaLabel")}
    />
  );
}

export function renderBump(request: ResolveRequest, size: ChartSize) {
  return (
    <BumpChart
      width={size.width}
      height={size.height}
      series={request.data as Series[]}
      ariaLabel={optString(request, "ariaLabel")}
    />
  );
}

export function renderSparkline(request: ResolveRequest, size: ChartSize) {
  const series = request.data as Series[];
  return (
    <Sparkline
      width={size.width}
      height={size.height}
      data={series[0]?.data ?? []}
      ariaLabel={optString(request, "ariaLabel")}
    />
  );
}

export function renderControl(request: ResolveRequest, size: ChartSize) {
  return (
    <ControlChart
      width={size.width}
      height={size.height}
      series={request.data as Series[]}
      center={optNumber(request, "center")}
      ucl={optNumber(request, "ucl")}
      lcl={optNumber(request, "lcl")}
      ariaLabel={optString(request, "ariaLabel")}
    />
  );
}

export function renderPareto(request: ResolveRequest, size: ChartSize) {
  return (
    <ParetoChart
      width={size.width}
      height={size.height}
      data={request.data as CategoryDatum[]}
      ariaLabel={optString(request, "ariaLabel")}
    />
  );
}

export function renderSlope(request: ResolveRequest, size: ChartSize) {
  return (
    <SlopeChart
      width={size.width}
      height={size.height}
      data={request.data as SlopeRow[]}
      leftLabel={optString(request, "leftLabel")}
      rightLabel={optString(request, "rightLabel")}
      ariaLabel={optString(request, "ariaLabel")}
    />
  );
}

export function renderDumbbell(request: ResolveRequest, size: ChartSize) {
  return (
    <DumbbellChart
      width={size.width}
      height={size.height}
      data={request.data as DumbbellRow[]}
      startLabel={optString(request, "startLabel")}
      endLabel={optString(request, "endLabel")}
      ariaLabel={optString(request, "ariaLabel")}
    />
  );
}

export function renderBubble(request: ResolveRequest, size: ChartSize) {
  return (
    <BubbleChart
      width={size.width}
      height={size.height}
      points={request.data as BubblePoint[]}
      ariaLabel={optString(request, "ariaLabel")}
    />
  );
}

export function renderRadar(request: ResolveRequest, size: ChartSize) {
  const data = request.data as RadarSeries[];
  // Axis names come from options; fall back to positional labels so a bare
  // (intent, data) resolve still renders.
  const axes =
    optStringArray(request, "axes") ??
    (data[0]?.values ?? []).map((_, i) => `Axis ${i + 1}`);
  return (
    <RadarChart
      width={size.width}
      height={size.height}
      axes={axes}
      data={data}
      ariaLabel={optString(request, "ariaLabel")}
    />
  );
}

export function renderParallel(request: ResolveRequest, size: ChartSize) {
  const rows = request.data as ParallelRow[];
  const provided = opts(request).dimensions as ParallelDimension[] | undefined;
  // Derive the axes from the first row's value keys when none are supplied.
  const dimensions =
    provided ??
    Object.keys(rows[0]?.values ?? {}).map((key) => ({ key, label: key }));
  return (
    <ParallelCoordinates
      width={size.width}
      height={size.height}
      dimensions={dimensions}
      data={rows}
      ariaLabel={optString(request, "ariaLabel")}
    />
  );
}

export function renderCalendar(request: ResolveRequest, size: ChartSize) {
  return (
    <CalendarHeatmap
      width={size.width}
      height={size.height}
      data={request.data as CalendarDatum[]}
      hue={optString(request, "hue")}
      ariaLabel={optString(request, "ariaLabel")}
    />
  );
}

export function renderRfm(request: ResolveRequest, size: ChartSize) {
  return (
    <RfmGrid
      width={size.width}
      height={size.height}
      data={request.data as RfmCell[]}
      ariaLabel={optString(request, "ariaLabel")}
    />
  );
}

export function renderCohortTriangle(request: ResolveRequest, size: ChartSize) {
  return (
    <CohortTriangle
      width={size.width}
      height={size.height}
      rows={request.data as HeatRow[]}
      periodLabels={
        optStringArray(request, "periodLabels") ??
        optStringArray(request, "columnLabels")
      }
      hue={optString(request, "hue")}
      ariaLabel={optString(request, "ariaLabel")}
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Base dispatch (for the preset factory)                                     */
/* -------------------------------------------------------------------------- */

/** The registered base charts a preset can build on. */
export type BaseName =
  | "line"
  | "bar-vertical"
  | "bar-horizontal"
  | "donut"
  | "stacked"
  | "scatter"
  | "heatmap"
  | "funnel"
  | "stacked-area"
  | "streamgraph"
  | "bump"
  | "sparkline"
  | "control"
  | "pareto"
  | "slope"
  | "dumbbell"
  | "bubble"
  | "radar"
  | "parallel"
  | "calendar"
  | "rfm"
  | "cohort-triangle";

export function renderHistogram(request: ResolveRequest, size: ChartSize) {
  return (
    <Histogram
      width={size.width}
      height={size.height}
      values={request.data as number[]}
      thresholds={optNumber(request, "thresholds")}
      ariaLabel={optString(request, "ariaLabel")}
    />
  );
}

export function renderBoxPlot(request: ResolveRequest, size: ChartSize) {
  return (
    <BoxPlot
      width={size.width}
      height={size.height}
      groups={request.data as BoxPlotGroupStats[]}
      ariaLabel={optString(request, "ariaLabel")}
    />
  );
}

export function renderWaterfall(request: ResolveRequest, size: ChartSize) {
  return (
    <WaterfallChart
      width={size.width}
      height={size.height}
      data={request.data as WaterfallStep[]}
      ariaLabel={optString(request, "ariaLabel")}
    />
  );
}

export function renderBullet(request: ResolveRequest, size: ChartSize) {
  return (
    <BulletChart
      width={size.width}
      height={size.height}
      data={request.data as BulletDatum[]}
      ariaLabel={optString(request, "ariaLabel")}
    />
  );
}

export function renderSankey(request: ResolveRequest, size: ChartSize) {
  return (
    <SankeyDiagram
      width={size.width}
      height={size.height}
      graph={request.data as FlowGraph}
      ariaLabel={optString(request, "ariaLabel")}
    />
  );
}

export function renderTreemap(request: ResolveRequest, size: ChartSize) {
  return (
    <Treemap
      width={size.width}
      height={size.height}
      data={request.data as TreemapNode}
      ariaLabel={optString(request, "ariaLabel")}
    />
  );
}

export function renderGauge(request: ResolveRequest, size: ChartSize) {
  return (
    <Gauge
      width={size.width}
      height={size.height}
      value={request.data as number}
      min={optNumber(request, "min")}
      max={optNumber(request, "max")}
      threshold={optNumber(request, "threshold")}
      label={optString(request, "label")}
      ariaLabel={optString(request, "ariaLabel")}
    />
  );
}

export function renderStatCard(request: ResolveRequest, size: ChartSize) {
  // StatCard is intrinsically self-sizing; size is accepted for signature
  // parity with the other adapters.
  void size;
  return (
    <StatCard
      label={optString(request, "label") ?? "Value"}
      value={request.data as number}
      previous={optNumber(request, "previous")}
      ariaLabel={optString(request, "ariaLabel")}
    />
  );
}

export function renderLollipop(request: ResolveRequest, size: ChartSize) {
  return (
    <LollipopChart
      width={size.width}
      height={size.height}
      data={request.data as CategoryDatum[]}
      ariaLabel={optString(request, "ariaLabel")}
    />
  );
}

export function renderRadialBar(request: ResolveRequest, size: ChartSize) {
  return (
    <RadialBarChart
      width={size.width}
      height={size.height}
      data={request.data as CategoryDatum[]}
      ariaLabel={optString(request, "ariaLabel")}
    />
  );
}

export function renderWaffle(request: ResolveRequest, size: ChartSize) {
  return (
    <WaffleChart
      width={size.width}
      height={size.height}
      data={request.data as CategoryDatum[]}
      ariaLabel={optString(request, "ariaLabel")}
    />
  );
}

export function renderDivergingBar(request: ResolveRequest, size: ChartSize) {
  return (
    <DivergingBarChart
      width={size.width}
      height={size.height}
      data={request.data as CategoryDatum[]}
      ariaLabel={optString(request, "ariaLabel")}
    />
  );
}

export function renderDivergingStacked(
  request: ResolveRequest,
  size: ChartSize
) {
  return (
    <DivergingStackedBar
      width={size.width}
      height={size.height}
      data={request.data as StackRow[]}
      ariaLabel={optString(request, "ariaLabel")}
    />
  );
}

export function renderPopulationPyramid(
  request: ResolveRequest,
  size: ChartSize
) {
  return (
    <PopulationPyramid
      width={size.width}
      height={size.height}
      data={request.data as StackRow[]}
      ariaLabel={optString(request, "ariaLabel")}
    />
  );
}

export function renderMarimekko(request: ResolveRequest, size: ChartSize) {
  return (
    <MarimekkoChart
      width={size.width}
      height={size.height}
      data={request.data as StackRow[]}
      ariaLabel={optString(request, "ariaLabel")}
    />
  );
}

/** Which bases publish the scale contract and so can host overlay children. */
export const OVERLAY_HOSTS: ReadonlySet<BaseName> = new Set<BaseName>([
  "line",
  "bar-vertical",
  "scatter",
]);

/** The React component name each base renders (for selection metadata). */
export const BASE_COMPONENT: Record<BaseName, string> = {
  line: "LineChart",
  "bar-vertical": "BarChart",
  "bar-horizontal": "BarChart",
  donut: "DonutChart",
  stacked: "StackedBarChart",
  scatter: "ScatterPlot",
  heatmap: "Heatmap",
  funnel: "FunnelChart",
  "stacked-area": "StackedAreaChart",
  streamgraph: "Streamgraph",
  bump: "BumpChart",
  sparkline: "Sparkline",
  control: "ControlChart",
  pareto: "ParetoChart",
  slope: "SlopeChart",
  dumbbell: "DumbbellChart",
  bubble: "BubbleChart",
  radar: "RadarChart",
  parallel: "ParallelCoordinates",
  calendar: "CalendarHeatmap",
  rfm: "RfmGrid",
  "cohort-triangle": "CohortTriangle",
};

export function renderBase(
  base: BaseName,
  request: ResolveRequest,
  size: ChartSize,
  overlays?: ReactNode
): ReactNode {
  switch (base) {
    case "line":
      return renderLine(request, size, overlays);
    case "bar-vertical":
      return renderBarVertical(request, size, overlays);
    case "bar-horizontal":
      return renderBarHorizontal(request, size);
    case "donut":
      return renderDonut(request, size);
    case "stacked":
      return renderStacked(request, size);
    case "scatter":
      return renderScatter(request, size, overlays);
    case "heatmap":
      return renderHeatmap(request, size);
    case "funnel":
      return renderFunnel(request, size);
    case "stacked-area":
      return renderStackedArea(request, size);
    case "streamgraph":
      return renderStreamgraph(request, size);
    case "bump":
      return renderBump(request, size);
    case "sparkline":
      return renderSparkline(request, size);
    case "control":
      return renderControl(request, size);
    case "pareto":
      return renderPareto(request, size);
    case "slope":
      return renderSlope(request, size);
    case "dumbbell":
      return renderDumbbell(request, size);
    case "bubble":
      return renderBubble(request, size);
    case "radar":
      return renderRadar(request, size);
    case "parallel":
      return renderParallel(request, size);
    case "calendar":
      return renderCalendar(request, size);
    case "rfm":
      return renderRfm(request, size);
    case "cohort-triangle":
      return renderCohortTriangle(request, size);
  }
}
