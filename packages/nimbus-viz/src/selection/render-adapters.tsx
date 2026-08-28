import type { ReactNode } from "react";
import { LineChart } from "../components/line-chart";
import { BarChart } from "../components/bar-chart";
import { DonutChart } from "../components/donut-chart";
import { StackedBarChart } from "../components/stacked-bar-chart";
import { ScatterPlot } from "../components/scatter-plot";
import { Heatmap } from "../components/heatmap";
import { FunnelChart } from "../components/funnel-chart";
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
  | "funnel";

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
  }
}
