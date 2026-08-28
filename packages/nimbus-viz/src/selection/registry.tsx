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
import type {
  ChartRegistry,
  ChartRegistryEntry,
  ChartSelectionMetadata,
  ChartSize,
  ResolveRequest,
} from "./types";

/**
 * The chart registry: `name → { metadata, dataKinds, render }`.
 *
 * Each entry carries real docs/06 selection metadata AND a render adapter that
 * maps `request.data` / `request.options` onto the chart's props. `dataKinds`
 * is the concrete render guard (see `DataKind` in types.ts): the filter uses it
 * so a chart never receives a structure its adapter can't draw.
 *
 * Note on presets: BarChart is registered twice — once as the vertical
 * `bar-chart` (COMPARE) and once as the horizontal `ranked-bar-chart` (RANK).
 * That mirrors docs/04's split of VerticalBarChart vs. HorizontalBarChart and
 * demonstrates the docs/05 "preset = base component + default props + metadata"
 * model: two catalog entries, one React component.
 */

/* -------------------------------------------------------------------------- */
/* Option readers (no `any`; `unknown` + narrowing)                           */
/* -------------------------------------------------------------------------- */

function opts(request: ResolveRequest): Record<string, unknown> {
  return request.options ?? {};
}

function optString(request: ResolveRequest, key: string): string | undefined {
  const v = opts(request)[key];
  return typeof v === "string" ? v : undefined;
}

function optStringArray(
  request: ResolveRequest,
  key: string
): string[] | undefined {
  const v = opts(request)[key];
  if (!Array.isArray(v)) return undefined;
  return v.filter((item): item is string => typeof item === "string");
}

/* -------------------------------------------------------------------------- */
/* Render adapters                                                            */
/* The filter guarantees the concrete `DataKind` before an adapter runs, so    */
/* the `as` casts below are validated narrowings, not blind assertions.        */
/* -------------------------------------------------------------------------- */

function renderLine(request: ResolveRequest, size: ChartSize) {
  const variant = optString(request, "variant") === "area" ? "area" : "line";
  return (
    <LineChart
      width={size.width}
      height={size.height}
      series={request.data as Series[]}
      variant={variant}
      ariaLabel={optString(request, "ariaLabel")}
    />
  );
}

function renderBar(orientation: "vertical" | "horizontal") {
  return (request: ResolveRequest, size: ChartSize) => (
    <BarChart
      width={size.width}
      height={size.height}
      data={request.data as CategoryDatum[]}
      orientation={orientation}
      ariaLabel={optString(request, "ariaLabel")}
    />
  );
}

function renderDonut(request: ResolveRequest, size: ChartSize) {
  return (
    <DonutChart
      width={size.width}
      height={size.height}
      data={request.data as CategoryDatum[]}
      ariaLabel={optString(request, "ariaLabel")}
    />
  );
}

function renderStacked(request: ResolveRequest, size: ChartSize) {
  return (
    <StackedBarChart
      width={size.width}
      height={size.height}
      data={request.data as StackRow[]}
      ariaLabel={optString(request, "ariaLabel")}
    />
  );
}

function renderScatter(request: ResolveRequest, size: ChartSize) {
  return (
    <ScatterPlot
      width={size.width}
      height={size.height}
      points={request.data as ScatterPoint[]}
      ariaLabel={optString(request, "ariaLabel")}
    />
  );
}

function renderHeatmap(request: ResolveRequest, size: ChartSize) {
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

function renderFunnel(request: ResolveRequest, size: ChartSize) {
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
/* Metadata + entries                                                         */
/* -------------------------------------------------------------------------- */

const lineMeta: ChartSelectionMetadata = {
  name: "line-chart",
  baseComponent: "LineChart",
  intents: [
    { intent: "TREND", primacy: "primary" },
    { intent: "DELTA", primacy: "secondary" },
    { intent: "TARGET", primacy: "secondary" },
    { intent: "RANGE", primacy: "secondary" },
    { intent: "BENCH", primacy: "secondary" },
    { intent: "COMP-TIME", primacy: "secondary" },
  ],
  acceptedShapes: ["time-series", "multi-time-series"],
  constraints: { requiresTimeAxis: true, minSeries: 1 },
  // Position along a common (time) scale — top of Cleveland & McGill.
  perceptualRank: 0.95,
  questionString: "How is this trending over time?",
  bundleWeight: 12,
};

const barMeta: ChartSelectionMetadata = {
  name: "bar-chart",
  baseComponent: "BarChart",
  intents: [
    { intent: "COMPARE", primacy: "primary" },
    { intent: "RANK", primacy: "secondary" },
  ],
  acceptedShapes: ["categorical"],
  // Bars get unreadable past ~25 categories.
  constraints: { maxCategories: 25 },
  // Length on a common baseline.
  perceptualRank: 0.9,
  questionString: "How do these categories compare?",
  bundleWeight: 8,
};

const rankedBarMeta: ChartSelectionMetadata = {
  name: "ranked-bar-chart",
  baseComponent: "BarChart",
  intents: [
    { intent: "RANK", primacy: "primary" },
    { intent: "COMPARE", primacy: "secondary" },
  ],
  acceptedShapes: ["ranking", "categorical"],
  constraints: { maxCategories: 30 },
  // Sorted length on a common baseline — the easiest ranking read.
  perceptualRank: 0.92,
  questionString: "Where does each item rank?",
  bundleWeight: 8,
};

const stackedMeta: ChartSelectionMetadata = {
  name: "stacked-bar-chart",
  baseComponent: "StackedBarChart",
  intents: [
    { intent: "PART-WHOLE", primacy: "primary" },
    { intent: "COMP-TIME", primacy: "primary" },
    { intent: "COMPARE", primacy: "secondary" },
  ],
  acceptedShapes: ["part-to-whole", "categorical"],
  constraints: { maxCategories: 12 },
  // Only the first segment sits on a common baseline; the rest are floating
  // lengths — better than angle, worse than aligned bars.
  perceptualRank: 0.72,
  questionString: "What is the composition across categories?",
  bundleWeight: 10,
};

const donutMeta: ChartSelectionMetadata = {
  name: "donut-chart",
  baseComponent: "DonutChart",
  intents: [{ intent: "PART-WHOLE", primacy: "secondary" }],
  acceptedShapes: ["part-to-whole"],
  // Donut legibility falls off past ~6 slices (docs/06 worked example).
  constraints: { maxCategories: 6 },
  // Angle / area — low on Cleveland & McGill.
  perceptualRank: 0.45,
  questionString: "What share is each part of the whole?",
  bundleWeight: 9,
};

const scatterMeta: ChartSelectionMetadata = {
  name: "scatter-plot",
  baseComponent: "ScatterPlot",
  intents: [{ intent: "REL", primacy: "primary" }],
  acceptedShapes: ["two-variable"],
  // Too few points don't reveal a relationship.
  constraints: { minSampleSize: 4 },
  // Position in 2-D.
  perceptualRank: 0.8,
  questionString: "How do these two variables relate?",
  bundleWeight: 9,
};

const heatmapMeta: ChartSelectionMetadata = {
  name: "heatmap",
  baseComponent: "Heatmap",
  intents: [
    { intent: "RETAIN", primacy: "primary" },
    { intent: "DIST", primacy: "secondary" },
    { intent: "TREND", primacy: "secondary" },
  ],
  acceptedShapes: ["cohort-matrix"],
  constraints: {},
  // Color intensity — the least accurately decoded encoding.
  perceptualRank: 0.35,
  questionString: "How does behavior evolve across the cohort matrix?",
  bundleWeight: 11,
};

const funnelMeta: ChartSelectionMetadata = {
  name: "funnel-chart",
  baseComponent: "FunnelChart",
  intents: [{ intent: "FLOW", primacy: "primary" }],
  acceptedShapes: ["flows-net"],
  constraints: {},
  // Length per stage through one process.
  perceptualRank: 0.6,
  questionString: "How much drops off at each stage of the flow?",
  bundleWeight: 6,
};

/**
 * Build the default registry. Insertion order is the stable tie-break's
 * registration order (docs/06 §3), so it is fixed and documented here.
 */
export function createDefaultRegistry(): ChartRegistry {
  const entries: ChartRegistryEntry[] = [
    { metadata: lineMeta, dataKinds: ["series"], render: renderLine },
    {
      metadata: barMeta,
      dataKinds: ["category"],
      render: renderBar("vertical"),
    },
    {
      metadata: rankedBarMeta,
      dataKinds: ["category"],
      render: renderBar("horizontal"),
    },
    {
      metadata: stackedMeta,
      dataKinds: ["stack-row"],
      render: renderStacked,
    },
    { metadata: donutMeta, dataKinds: ["category"], render: renderDonut },
    { metadata: scatterMeta, dataKinds: ["scatter"], render: renderScatter },
    { metadata: heatmapMeta, dataKinds: ["heat-row"], render: renderHeatmap },
    { metadata: funnelMeta, dataKinds: ["funnel"], render: renderFunnel },
  ];

  const registry: ChartRegistry = new Map();
  for (const entry of entries) {
    registry.set(entry.metadata.name, entry);
  }
  return registry;
}

/** The shared default registry the resolver uses unless one is passed in. */
export const chartRegistry: ChartRegistry = createDefaultRegistry();
