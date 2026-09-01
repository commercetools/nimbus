import {
  renderBarHorizontal,
  renderBarVertical,
  renderBeeswarm,
  renderBoxPlot,
  renderBullet,
  renderCandlestick,
  renderChord,
  renderConnectedScatter,
  renderCumulativeCurve,
  renderDivergingBar,
  renderDivergingStacked,
  renderDonut,
  renderFunnel,
  renderGantt,
  renderGauge,
  renderGrouped,
  renderHeatmap,
  renderHistogram,
  renderLine,
  renderLollipop,
  renderMarimekko,
  renderPopulationPyramid,
  renderRadialBar,
  renderSankey,
  renderScatter,
  renderStacked,
  renderStatCard,
  renderSunburst,
  renderTreemap,
  renderViolin,
  renderWaffle,
  renderWaterfall,
} from "./render-adapters";
import { presetEntries } from "./presets";
import type {
  ChartRegistry,
  ChartRegistryEntry,
  ChartSelectionMetadata,
} from "./types";

/**
 * The chart registry: `name → { metadata, dataKinds, render, canonical }`.
 *
 * Two roles live here (docs/09 batch 6):
 *  - **Canonical** entries (below) are the "which chart for this bare intent +
 *    shape?" answers — the only entries `resolve()` ranks. Roughly one per
 *    intent × concrete-kind region.
 *  - **Presets** (from `presets.tsx`, appended) are persona-specific named
 *    configurations (base + overlays + defaults) addressed by name via
 *    `resolveByName`. They grow the agent-selectable catalog toward ~100
 *    without flooding the bare-intent resolver.
 *
 * BarChart is still registered twice canonically — vertical `bar-chart`
 * (COMPARE) and horizontal `ranked-bar-chart` (RANK) — the original proof that
 * a preset is "base component + default props + metadata", now generalized by
 * the declarative catalog.
 */

/* -------------------------------------------------------------------------- */
/* Canonical selection metadata                                               */
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
  configLabel: "LineChart",
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
  configLabel: "BarChart (vertical)",
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
  configLabel: "BarChart (ranked)",
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
  configLabel: "StackedBarChart",
};

const groupedMeta: ChartSelectionMetadata = {
  name: "grouped-bar-chart",
  baseComponent: "GroupedBarChart",
  intents: [
    { intent: "COMPARE", primacy: "primary" },
    { intent: "COMP-TIME", primacy: "secondary" },
  ],
  acceptedShapes: ["categorical"],
  constraints: { maxCategories: 12 },
  // Side-by-side bars all sit on a common baseline — aligned length, so it
  // beats the stacked bar's floating segments for cross-series comparison.
  perceptualRank: 0.85,
  questionString: "How do these series compare within each category?",
  bundleWeight: 10,
  configLabel: "GroupedBarChart",
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
  configLabel: "DonutChart",
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
  configLabel: "ScatterPlot",
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
  configLabel: "Heatmap",
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
  configLabel: "FunnelChart",
};

const histogramMeta: ChartSelectionMetadata = {
  name: "histogram",
  baseComponent: "Histogram",
  intents: [{ intent: "DIST", primacy: "primary" }],
  acceptedShapes: ["distribution"],
  constraints: {},
  // Length on a common baseline, one anonymous sample set.
  perceptualRank: 0.6,
  questionString: "How is this distributed?",
  bundleWeight: 6,
  configLabel: "Histogram",
};

const boxPlotMeta: ChartSelectionMetadata = {
  name: "box-plot",
  baseComponent: "BoxPlot",
  intents: [
    { intent: "DIST", primacy: "primary" },
    { intent: "COMPARE", primacy: "secondary" },
  ],
  acceptedShapes: ["distribution"],
  constraints: { maxCategories: 20 },
  perceptualRank: 0.5,
  questionString: "How do these distributions compare?",
  bundleWeight: 7,
  configLabel: "BoxPlot",
};

const waterfallMeta: ChartSelectionMetadata = {
  name: "waterfall-chart",
  baseComponent: "WaterfallChart",
  intents: [
    { intent: "DELTA", primacy: "primary" },
    { intent: "PART-WHOLE", primacy: "secondary" },
  ],
  acceptedShapes: ["part-to-whole"],
  constraints: {},
  perceptualRank: 0.65,
  questionString: "What drives the change from start to end?",
  bundleWeight: 7,
  configLabel: "WaterfallChart",
};

const bulletMeta: ChartSelectionMetadata = {
  name: "bullet-chart",
  baseComponent: "BulletChart",
  intents: [
    { intent: "TARGET", primacy: "primary" },
    { intent: "RANGE", primacy: "secondary" },
  ],
  acceptedShapes: ["value-vs-target"],
  constraints: { maxCategories: 12 },
  perceptualRank: 0.62,
  questionString: "Is each measure hitting its target?",
  bundleWeight: 5,
  configLabel: "BulletChart",
};

const sankeyMeta: ChartSelectionMetadata = {
  name: "sankey-diagram",
  baseComponent: "SankeyDiagram",
  intents: [{ intent: "FLOW", primacy: "primary" }],
  acceptedShapes: ["flows-net"],
  constraints: {},
  perceptualRank: 0.5,
  questionString: "How does volume flow between stages?",
  bundleWeight: 12,
  configLabel: "SankeyDiagram",
};

const treemapMeta: ChartSelectionMetadata = {
  name: "treemap",
  baseComponent: "Treemap",
  intents: [{ intent: "PART-WHOLE", primacy: "primary" }],
  acceptedShapes: ["part-to-whole"],
  constraints: {},
  perceptualRank: 0.45,
  questionString: "How does the whole break down across a hierarchy?",
  bundleWeight: 8,
  configLabel: "Treemap",
};

const gaugeMeta: ChartSelectionMetadata = {
  name: "gauge",
  baseComponent: "Gauge",
  intents: [
    { intent: "TARGET", primacy: "primary" },
    { intent: "VALUE", primacy: "secondary" },
  ],
  acceptedShapes: ["value-vs-target", "single-value"],
  constraints: {},
  perceptualRank: 0.4,
  questionString: "How close is this to its target?",
  bundleWeight: 4,
  configLabel: "Gauge",
};

const statCardMeta: ChartSelectionMetadata = {
  name: "stat-card",
  baseComponent: "StatCard",
  intents: [{ intent: "VALUE", primacy: "primary" }],
  acceptedShapes: ["single-value"],
  constraints: {},
  // A single number read directly — the highest-fidelity readout there is.
  perceptualRank: 1,
  questionString: "What is the headline number right now?",
  bundleWeight: 2,
  configLabel: "StatCard",
};

/* -------------------------------------------------------------------------- */
/* Visual-vocabulary additions (FT chart-doctor families)                     */
/* -------------------------------------------------------------------------- */

const divergingBarMeta: ChartSelectionMetadata = {
  name: "diverging-bar-chart",
  baseComponent: "DivergingBarChart",
  intents: [
    { intent: "DELTA", primacy: "primary" },
    { intent: "COMPARE", primacy: "secondary" },
  ],
  acceptedShapes: ["categorical"],
  constraints: { maxCategories: 25 },
  // Signed length on a shared zero baseline — a clean deviation read.
  perceptualRank: 0.88,
  questionString: "How does each category deviate (+/−) from the baseline?",
  bundleWeight: 8,
  configLabel: "DivergingBarChart",
};

const lollipopMeta: ChartSelectionMetadata = {
  name: "lollipop-chart",
  baseComponent: "LollipopChart",
  intents: [
    { intent: "RANK", primacy: "primary" },
    { intent: "COMPARE", primacy: "secondary" },
  ],
  acceptedShapes: ["ranking", "categorical"],
  constraints: { maxCategories: 30 },
  // Position of the dot on a common baseline — as accurate as the bar, less ink.
  perceptualRank: 0.9,
  questionString: "Where does each item rank?",
  bundleWeight: 6,
  configLabel: "LollipopChart",
};

const radialBarMeta: ChartSelectionMetadata = {
  name: "radial-bar-chart",
  baseComponent: "RadialBarChart",
  intents: [
    { intent: "COMPARE", primacy: "primary" },
    { intent: "RANK", primacy: "secondary" },
  ],
  acceptedShapes: ["categorical"],
  constraints: { maxCategories: 16 },
  // Angular position + radial length — a compact form, less accurate than a bar.
  perceptualRank: 0.6,
  questionString: "How do these categories compare, compactly?",
  bundleWeight: 7,
  configLabel: "RadialBarChart",
};

const waffleMeta: ChartSelectionMetadata = {
  name: "waffle-chart",
  baseComponent: "WaffleChart",
  intents: [{ intent: "PART-WHOLE", primacy: "primary" }],
  acceptedShapes: ["part-to-whole", "categorical"],
  constraints: { maxCategories: 8 },
  // Counting cells reads share more accurately than a pie's angles.
  perceptualRank: 0.55,
  questionString: "What share is each part of the whole?",
  bundleWeight: 5,
  configLabel: "WaffleChart",
};

const divergingStackedMeta: ChartSelectionMetadata = {
  name: "diverging-stacked-bar",
  baseComponent: "DivergingStackedBar",
  intents: [
    { intent: "PART-WHOLE", primacy: "primary" },
    { intent: "DELTA", primacy: "secondary" },
    { intent: "COMPARE", primacy: "secondary" },
  ],
  acceptedShapes: ["part-to-whole", "categorical"],
  constraints: { maxCategories: 12 },
  perceptualRank: 0.6,
  questionString: "How does sentiment diverge across an ordered scale?",
  bundleWeight: 9,
  configLabel: "DivergingStackedBar",
};

const populationPyramidMeta: ChartSelectionMetadata = {
  name: "population-pyramid",
  baseComponent: "PopulationPyramid",
  intents: [
    { intent: "COMPARE", primacy: "primary" },
    { intent: "DIST", primacy: "secondary" },
  ],
  acceptedShapes: ["distribution", "categorical"],
  constraints: { maxCategories: 20 },
  perceptualRank: 0.7,
  questionString: "How do two populations compare across bands?",
  bundleWeight: 7,
  configLabel: "PopulationPyramid",
};

const marimekkoMeta: ChartSelectionMetadata = {
  name: "marimekko-chart",
  baseComponent: "MarimekkoChart",
  intents: [
    { intent: "PART-WHOLE", primacy: "primary" },
    { intent: "COMPARE", primacy: "secondary" },
  ],
  acceptedShapes: ["part-to-whole", "categorical"],
  constraints: { maxCategories: 12 },
  perceptualRank: 0.6,
  questionString: "How do composition and size vary across categories?",
  bundleWeight: 9,
  configLabel: "MarimekkoChart",
};

const beeswarmMeta: ChartSelectionMetadata = {
  name: "beeswarm-plot",
  baseComponent: "BeeswarmPlot",
  intents: [{ intent: "DIST", primacy: "primary" }],
  acceptedShapes: ["distribution"],
  constraints: {},
  perceptualRank: 0.55,
  questionString: "How are the individual samples distributed?",
  bundleWeight: 6,
  configLabel: "BeeswarmPlot",
};

const cumulativeCurveMeta: ChartSelectionMetadata = {
  name: "cumulative-curve",
  baseComponent: "CumulativeCurve",
  intents: [{ intent: "DIST", primacy: "primary" }],
  acceptedShapes: ["distribution"],
  constraints: {},
  perceptualRank: 0.6,
  questionString: "What share of the data falls below each value?",
  bundleWeight: 7,
  configLabel: "CumulativeCurve",
};

const connectedScatterMeta: ChartSelectionMetadata = {
  name: "connected-scatterplot",
  baseComponent: "ConnectedScatterplot",
  intents: [
    { intent: "REL", primacy: "primary" },
    { intent: "TREND", primacy: "secondary" },
  ],
  acceptedShapes: ["two-variable"],
  constraints: { minSampleSize: 3 },
  perceptualRank: 0.7,
  questionString: "How do two variables move together over the sequence?",
  bundleWeight: 8,
  configLabel: "ConnectedScatterplot",
};

const sunburstMeta: ChartSelectionMetadata = {
  name: "sunburst-chart",
  baseComponent: "SunburstChart",
  intents: [{ intent: "PART-WHOLE", primacy: "primary" }],
  acceptedShapes: ["part-to-whole"],
  constraints: {},
  perceptualRank: 0.45,
  questionString: "How does the whole break down across a hierarchy (radial)?",
  bundleWeight: 9,
  configLabel: "SunburstChart",
};

// New concrete data kinds — each is the sole canonical answer for its region.

const violinMeta: ChartSelectionMetadata = {
  name: "violin-plot",
  baseComponent: "ViolinPlot",
  intents: [
    { intent: "DIST", primacy: "primary" },
    { intent: "COMPARE", primacy: "secondary" },
  ],
  acceptedShapes: ["distribution"],
  constraints: { maxCategories: 20 },
  perceptualRank: 0.55,
  questionString: "How do these full distributions compare?",
  bundleWeight: 8,
  configLabel: "ViolinPlot",
};

const candlestickMeta: ChartSelectionMetadata = {
  name: "candlestick-chart",
  baseComponent: "CandlestickChart",
  intents: [
    { intent: "TREND", primacy: "primary" },
    { intent: "RANGE", primacy: "secondary" },
  ],
  acceptedShapes: ["time-series"],
  constraints: { requiresTimeAxis: true },
  perceptualRank: 0.7,
  questionString: "How did the price move each period (OHLC)?",
  bundleWeight: 9,
  configLabel: "CandlestickChart",
};

const ganttMeta: ChartSelectionMetadata = {
  name: "gantt-chart",
  baseComponent: "GanttChart",
  intents: [
    { intent: "TREND", primacy: "primary" },
    { intent: "COMP-TIME", primacy: "secondary" },
  ],
  acceptedShapes: ["event-timeline"],
  constraints: {},
  perceptualRank: 0.7,
  questionString: "When does each event happen and how long does it last?",
  bundleWeight: 8,
  configLabel: "GanttChart",
};

const chordMeta: ChartSelectionMetadata = {
  name: "chord-diagram",
  baseComponent: "ChordDiagram",
  intents: [
    { intent: "FLOW", primacy: "primary" },
    { intent: "REL", primacy: "secondary" },
  ],
  acceptedShapes: ["flows-net"],
  constraints: {},
  perceptualRank: 0.45,
  questionString: "How much flows between each pair of entities?",
  bundleWeight: 10,
  configLabel: "ChordDiagram",
};

/**
 * Build the default registry. Insertion order is the stable tie-break's
 * registration order (docs/06 §3): canonical entries first (so they win a
 * genuine tie among themselves), then the presets. Duplicate names are a
 * programming error — warned, last-wins.
 */
export function createDefaultRegistry(): ChartRegistry {
  const canonical: ChartRegistryEntry[] = [
    {
      metadata: lineMeta,
      dataKinds: ["series"],
      render: renderLine,
      canonical: true,
    },
    {
      metadata: barMeta,
      dataKinds: ["category"],
      render: renderBarVertical,
      canonical: true,
    },
    {
      metadata: rankedBarMeta,
      dataKinds: ["category"],
      render: renderBarHorizontal,
      canonical: true,
    },
    {
      metadata: stackedMeta,
      dataKinds: ["stack-row"],
      render: renderStacked,
      canonical: true,
    },
    {
      metadata: groupedMeta,
      dataKinds: ["stack-row"],
      render: renderGrouped,
      canonical: true,
    },
    {
      metadata: donutMeta,
      dataKinds: ["category"],
      render: renderDonut,
      canonical: true,
    },
    {
      metadata: scatterMeta,
      dataKinds: ["scatter"],
      render: renderScatter,
      canonical: true,
    },
    {
      metadata: heatmapMeta,
      dataKinds: ["heat-row"],
      render: renderHeatmap,
      canonical: true,
    },
    {
      metadata: funnelMeta,
      dataKinds: ["funnel"],
      render: renderFunnel,
      canonical: true,
    },
    {
      metadata: histogramMeta,
      dataKinds: ["samples"],
      render: renderHistogram,
      canonical: true,
    },
    {
      metadata: boxPlotMeta,
      dataKinds: ["box-group"],
      render: renderBoxPlot,
      canonical: true,
    },
    {
      metadata: waterfallMeta,
      dataKinds: ["delta-steps"],
      render: renderWaterfall,
      canonical: true,
    },
    {
      metadata: bulletMeta,
      dataKinds: ["bullet-row"],
      render: renderBullet,
      canonical: true,
    },
    {
      metadata: sankeyMeta,
      dataKinds: ["flow-graph"],
      render: renderSankey,
      canonical: true,
    },
    {
      metadata: treemapMeta,
      dataKinds: ["hierarchy"],
      render: renderTreemap,
      canonical: true,
    },
    {
      metadata: gaugeMeta,
      dataKinds: ["scalar"],
      render: renderGauge,
      canonical: true,
    },
    {
      metadata: statCardMeta,
      dataKinds: ["scalar"],
      render: renderStatCard,
      canonical: true,
    },
    // Deviation family (FT): the go-to for signed change across categories.
    {
      metadata: divergingBarMeta,
      dataKinds: ["category"],
      render: renderDivergingBar,
      canonical: true,
    },
    // New-kind canonicals — each is the sole answer for its (intent × kind).
    {
      metadata: violinMeta,
      dataKinds: ["sample-groups"],
      render: renderViolin,
      canonical: true,
    },
    {
      metadata: candlestickMeta,
      dataKinds: ["ohlc"],
      render: renderCandlestick,
      canonical: true,
    },
    {
      metadata: ganttMeta,
      dataKinds: ["timeline-events"],
      render: renderGantt,
      canonical: true,
    },
    {
      metadata: chordMeta,
      dataKinds: ["flow-matrix"],
      render: renderChord,
      canonical: true,
    },
  ];

  // Name-addressable alternates (canonical: false) — real components that share
  // a data kind with a canonical chart, so they enrich the catalog and the
  // gallery without crowding the bare-intent resolver.
  const extended: ChartRegistryEntry[] = [
    {
      metadata: lollipopMeta,
      dataKinds: ["category"],
      render: renderLollipop,
      canonical: false,
    },
    {
      metadata: radialBarMeta,
      dataKinds: ["category"],
      render: renderRadialBar,
      canonical: false,
    },
    {
      metadata: waffleMeta,
      dataKinds: ["category"],
      render: renderWaffle,
      canonical: false,
    },
    {
      metadata: divergingStackedMeta,
      dataKinds: ["stack-row"],
      render: renderDivergingStacked,
      canonical: false,
    },
    {
      metadata: populationPyramidMeta,
      dataKinds: ["stack-row"],
      render: renderPopulationPyramid,
      canonical: false,
    },
    {
      metadata: marimekkoMeta,
      dataKinds: ["stack-row"],
      render: renderMarimekko,
      canonical: false,
    },
    {
      metadata: beeswarmMeta,
      dataKinds: ["samples"],
      render: renderBeeswarm,
      canonical: false,
    },
    {
      metadata: cumulativeCurveMeta,
      dataKinds: ["samples"],
      render: renderCumulativeCurve,
      canonical: false,
    },
    {
      metadata: connectedScatterMeta,
      dataKinds: ["scatter"],
      render: renderConnectedScatter,
      canonical: false,
    },
    {
      metadata: sunburstMeta,
      dataKinds: ["hierarchy"],
      render: renderSunburst,
      canonical: false,
    },
  ];

  const registry: ChartRegistry = new Map();
  for (const entry of [...canonical, ...extended, ...presetEntries()]) {
    if (registry.has(entry.metadata.name)) {
      // eslint-disable-next-line no-console
      console.warn(
        `nimbus-viz: duplicate registry name "${entry.metadata.name}" — the later entry wins.`
      );
    }
    registry.set(entry.metadata.name, entry);
  }
  return registry;
}

/** The shared default registry the resolver uses unless one is passed in. */
export const chartRegistry: ChartRegistry = createDefaultRegistry();
