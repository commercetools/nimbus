import {
  renderBarHorizontal,
  renderBarVertical,
  renderDonut,
  renderFunnel,
  renderHeatmap,
  renderLine,
  renderScatter,
  renderStacked,
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
  ];

  const registry: ChartRegistry = new Map();
  for (const entry of [...canonical, ...presetEntries()]) {
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
