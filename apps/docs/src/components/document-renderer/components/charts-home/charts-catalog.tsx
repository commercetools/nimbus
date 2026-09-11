import type { ReactNode } from "react";
import {
  BarChart,
  BeeswarmPlot,
  BoxPlot,
  BubbleChart,
  BulletChart,
  BumpChart,
  CalendarHeatmap,
  CandlestickChart,
  ChordDiagram,
  CohortTriangle,
  ConnectedScatterplot,
  ControlChart,
  CumulativeCurve,
  DataTable,
  DivergingBarChart,
  DivergingStackedBar,
  DonutChart,
  DumbbellChart,
  FunnelChart,
  GanttChart,
  Gauge,
  GroupedBarChart,
  Heatmap,
  Histogram,
  LineChart,
  LollipopChart,
  MarimekkoChart,
  ParallelCoordinates,
  ParetoChart,
  PopulationPyramid,
  RadarChart,
  RadialBarChart,
  RfmGrid,
  SankeyDiagram,
  ScatterPlot,
  SlopeChart,
  Sparkline,
  StackedAreaChart,
  StackedBarChart,
  StatCard,
  Streamgraph,
  SunburstChart,
  Treemap,
  ViolinPlot,
  WaffleChart,
  WaterfallChart,
} from "@commercetools/nimbus-viz";

/**
 * The chart catalog powers both the Charts landing gallery (`<ChartsHomePage />`)
 * and the per-page context block (`<ChartMeta />`). It is the single place that
 * knows, for each chart, which purpose ("intent") it serves, the question a
 * consumer would be asking when they reach for it, extra search keywords, and a
 * small live thumbnail. Everything else (title, description, route) is read from
 * the doc route manifest and joined on `exportName`, so this file never
 * duplicates routing or copy that already lives in each chart's `.mdx`.
 *
 * Purposes mirror the Financial Times "Visual Vocabulary" families the library
 * was built against — the same grouping the per-chart docs are ordered by.
 */

/** A navigable purpose ("intent") — one row in the gallery's filter + one section. */
export interface ChartPurpose {
  key: string;
  label: string;
  /** The question this family of charts answers, shown under the section title. */
  question: string;
  /** A `@commercetools/nimbus-icons` export name (falls back gracefully). */
  icon: string;
}

/** Dimensions a thumbnail is asked to render into. Self-sizing charts ignore them. */
export interface ThumbDims {
  width: number;
  height: number;
}

/** One chart in the catalog. */
export interface ChartCatalogEntry {
  /** Matches the `exportName` frontmatter of the chart's doc page. */
  exportName: string;
  /** Which {@link ChartPurpose} this chart belongs to. */
  purpose: string;
  /** The consumer question this specific chart answers. */
  question: string;
  /** Extra fuzzy-search terms beyond the title/description. */
  keywords: string[];
  /** Thumbnail render height in px (also the reserved placeholder height). */
  height: number;
  /** True for charts that size themselves (no `ResponsiveContainer`). */
  selfSizing: boolean;
  /** Renders the live preview. */
  Thumb: (dims: ThumbDims) => ReactNode;
}

/* -------------------------------------------------------------------------- */
/* Purposes (ordered — drives the filter row and the browse sections)          */
/* -------------------------------------------------------------------------- */

export const PURPOSES: ChartPurpose[] = [
  {
    key: "trend",
    label: "Trend over time",
    question: "How is a metric changing over time?",
    icon: "ShowChart",
  },
  {
    key: "magnitude",
    label: "Magnitude",
    question: "How do categories compare in size?",
    icon: "BarChart",
  },
  {
    key: "part-to-whole",
    label: "Part-to-whole",
    question: "What makes up the whole?",
    icon: "PieChart",
  },
  {
    key: "deviation",
    label: "Deviation",
    question: "How far do values sit above or below a baseline?",
    icon: "SwapVert",
  },
  {
    key: "compare",
    label: "Compare & delta",
    question: "How did values change between two points?",
    icon: "CompareArrows",
  },
  {
    key: "rank",
    label: "Rank",
    question: "How does the ordering shift?",
    icon: "Leaderboard",
  },
  {
    key: "relationship",
    label: "Relationship",
    question: "How do two or more variables relate?",
    icon: "BubbleChart",
  },
  {
    key: "distribution",
    label: "Distribution",
    question: "How are values spread out?",
    icon: "Insights",
  },
  {
    key: "matrix",
    label: "Matrix & retention",
    question: "How does a value vary across a grid?",
    icon: "GridView",
  },
  {
    key: "flow",
    label: "Flow",
    question: "How does volume move between stages?",
    icon: "AccountTree",
  },
  {
    key: "timeline",
    label: "Timeline",
    question: "When do events happen, and for how long?",
    icon: "Timeline",
  },
  {
    key: "single-value",
    label: "Single value",
    question: "What's the headline number right now?",
    icon: "Numbers",
  },
  {
    key: "tabular",
    label: "Tabular",
    question: "The accessible table fallback for any data.",
    icon: "TableChart",
  },
];

/* -------------------------------------------------------------------------- */
/* Shared sample data (reused across charts that take the same shape)          */
/* -------------------------------------------------------------------------- */

const rand = (i: number) => {
  const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

/** Flat category magnitudes — bar/donut/lollipop/waffle/pareto/radial. */
const CAT = [
  { category: "Web", value: 4200 },
  { category: "Mobile", value: 3100 },
  { category: "Retail", value: 2400 },
  { category: "Partner", value: 1800 },
  { category: "Email", value: 1200 },
];

/** Multi-segment rows — stacked/grouped/marimekko. */
const STACK = [
  {
    category: "Q1",
    segments: [
      { key: "New", value: 120 },
      { key: "Returning", value: 80 },
      { key: "Wholesale", value: 40 },
    ],
  },
  {
    category: "Q2",
    segments: [
      { key: "New", value: 140 },
      { key: "Returning", value: 96 },
      { key: "Wholesale", value: 52 },
    ],
  },
  {
    category: "Q3",
    segments: [
      { key: "New", value: 118 },
      { key: "Returning", value: 110 },
      { key: "Wholesale", value: 61 },
    ],
  },
  {
    category: "Q4",
    segments: [
      { key: "New", value: 150 },
      { key: "Returning", value: 128 },
      { key: "Wholesale", value: 70 },
    ],
  },
];

/** Two labelled time series — line. */
const SERIES = [
  {
    id: "eu",
    label: "EU",
    data: [
      { x: new Date("2026-01-01"), y: 120 },
      { x: new Date("2026-02-01"), y: 148 },
      { x: new Date("2026-03-01"), y: 136 },
      { x: new Date("2026-04-01"), y: 172 },
      { x: new Date("2026-05-01"), y: 165 },
      { x: new Date("2026-06-01"), y: 194 },
    ],
  },
  {
    id: "us",
    label: "US",
    data: [
      { x: new Date("2026-01-01"), y: 90 },
      { x: new Date("2026-02-01"), y: 104 },
      { x: new Date("2026-03-01"), y: 128 },
      { x: new Date("2026-04-01"), y: 119 },
      { x: new Date("2026-05-01"), y: 142 },
      { x: new Date("2026-06-01"), y: 158 },
    ],
  },
];

/** Three stacked-composition series — area/stream. */
const AREA = [
  {
    id: "organic",
    label: "Organic",
    data: [
      { x: new Date("2026-01-01"), y: 120 },
      { x: new Date("2026-02-01"), y: 150 },
      { x: new Date("2026-03-01"), y: 170 },
      { x: new Date("2026-04-01"), y: 210 },
      { x: new Date("2026-05-01"), y: 240 },
      { x: new Date("2026-06-01"), y: 300 },
    ],
  },
  {
    id: "paid",
    label: "Paid",
    data: [
      { x: new Date("2026-01-01"), y: 80 },
      { x: new Date("2026-02-01"), y: 96 },
      { x: new Date("2026-03-01"), y: 110 },
      { x: new Date("2026-04-01"), y: 104 },
      { x: new Date("2026-05-01"), y: 130 },
      { x: new Date("2026-06-01"), y: 150 },
    ],
  },
  {
    id: "referral",
    label: "Referral",
    data: [
      { x: new Date("2026-01-01"), y: 40 },
      { x: new Date("2026-02-01"), y: 52 },
      { x: new Date("2026-03-01"), y: 60 },
      { x: new Date("2026-04-01"), y: 72 },
      { x: new Date("2026-05-01"), y: 66 },
      { x: new Date("2026-06-01"), y: 88 },
    ],
  },
];

/** 220 pseudo-random samples — histogram/beeswarm/cumulative. */
const VALUES = Array.from({ length: 220 }, (_, i) =>
  Math.round(50 + ((rand(i) + rand(i + 60) + rand(i + 130)) / 3 - 0.5) * 70)
);

/** Nested hierarchy — treemap/sunburst. */
const TREE = {
  name: "Revenue",
  children: [
    {
      name: "Web",
      children: [
        { name: "New", value: 260 },
        { name: "Returning", value: 180 },
      ],
    },
    {
      name: "Mobile",
      children: [
        { name: "iOS", value: 150 },
        { name: "Android", value: 120 },
      ],
    },
    {
      name: "Retail",
      children: [
        { name: "Flagship", value: 90 },
        { name: "Outlet", value: 60 },
      ],
    },
  ],
};

/** Default thumbnail height; a handful of charts override it. */
const H = 150;

/* -------------------------------------------------------------------------- */
/* Catalog (authored family-by-family — this order is the gallery's order)     */
/* -------------------------------------------------------------------------- */

export const CHART_CATALOG: ChartCatalogEntry[] = [
  // ---- Trend over time -----------------------------------------------------
  {
    exportName: "LineChart",
    purpose: "trend",
    question: "How is a metric trending over time?",
    keywords: ["line", "time series", "trend"],
    height: H,
    selfSizing: false,
    Thumb: ({ width, height }) => (
      <LineChart width={width} height={height} series={SERIES} />
    ),
  },
  {
    exportName: "StackedAreaChart",
    purpose: "trend",
    question: "How does composition shift over time?",
    keywords: ["area", "stacked", "composition"],
    height: H,
    selfSizing: false,
    Thumb: ({ width, height }) => (
      <StackedAreaChart width={width} height={height} series={AREA} />
    ),
  },
  {
    exportName: "Streamgraph",
    purpose: "trend",
    question: "How does the mix flow over time?",
    keywords: ["stream", "flowing", "composition"],
    height: H,
    selfSizing: false,
    Thumb: ({ width, height }) => (
      <Streamgraph width={width} height={height} series={AREA} />
    ),
  },
  {
    exportName: "Sparkline",
    purpose: "trend",
    question: "What's the at-a-glance trend for a KPI?",
    keywords: ["sparkline", "mini", "inline", "kpi"],
    height: 72,
    selfSizing: false,
    Thumb: ({ width, height }) => (
      <Sparkline
        width={width}
        height={height}
        data={[
          { x: new Date("2026-01-01"), y: 12 },
          { x: new Date("2026-02-01"), y: 18 },
          { x: new Date("2026-03-01"), y: 15 },
          { x: new Date("2026-04-01"), y: 22 },
          { x: new Date("2026-05-01"), y: 28 },
          { x: new Date("2026-06-01"), y: 25 },
          { x: new Date("2026-07-01"), y: 33 },
        ]}
        showEndDot
      />
    ),
  },
  {
    exportName: "ControlChart",
    purpose: "trend",
    question: "Is the process staying within control limits?",
    keywords: ["control", "spc", "limits", "quality"],
    height: H,
    selfSizing: false,
    Thumb: ({ width, height }) => (
      <ControlChart
        width={width}
        height={height}
        series={[
          {
            id: "p",
            label: "Fill weight",
            data: [
              { x: new Date("2026-01-01"), y: 249 },
              { x: new Date("2026-01-02"), y: 251 },
              { x: new Date("2026-01-03"), y: 250 },
              { x: new Date("2026-01-04"), y: 258 },
              { x: new Date("2026-01-05"), y: 247 },
              { x: new Date("2026-01-06"), y: 252 },
              { x: new Date("2026-01-07"), y: 240 },
              { x: new Date("2026-01-08"), y: 251 },
              { x: new Date("2026-01-09"), y: 253 },
              { x: new Date("2026-01-10"), y: 249 },
            ],
          },
        ]}
      />
    ),
  },
  {
    exportName: "CandlestickChart",
    purpose: "trend",
    question: "How did the price move each period?",
    keywords: ["candlestick", "ohlc", "finance", "price"],
    height: H,
    selfSizing: false,
    Thumb: ({ width, height }) => {
      let p = 100;
      const bars = Array.from({ length: 24 }, (_, i) => {
        const open = p;
        const close = Math.max(5, open + (rand(i) - 0.47) * 8);
        const high = Math.max(open, close) + rand(i + 20) * 4;
        const low = Math.min(open, close) - rand(i + 40) * 4;
        p = close;
        return {
          date: new Date(2026, 0, i + 1),
          open: +open.toFixed(2),
          high: +high.toFixed(2),
          low: +low.toFixed(2),
          close: +close.toFixed(2),
        };
      });
      return <CandlestickChart width={width} height={height} data={bars} />;
    },
  },

  // ---- Magnitude -----------------------------------------------------------
  {
    exportName: "BarChart",
    purpose: "magnitude",
    question: "How do categories compare?",
    keywords: ["bar", "column", "compare", "category"],
    height: H,
    selfSizing: false,
    Thumb: ({ width, height }) => (
      <BarChart width={width} height={height} data={CAT} />
    ),
  },
  {
    exportName: "GroupedBarChart",
    purpose: "magnitude",
    question: "How do series compare within each category?",
    keywords: ["grouped", "clustered", "series"],
    height: H,
    selfSizing: false,
    Thumb: ({ width, height }) => (
      <GroupedBarChart width={width} height={height} data={STACK} />
    ),
  },
  {
    exportName: "LollipopChart",
    purpose: "magnitude",
    question: "How do categories compare, with less ink?",
    keywords: ["lollipop", "dot", "ranking"],
    height: H,
    selfSizing: false,
    Thumb: ({ width, height }) => (
      <LollipopChart width={width} height={height} data={CAT} />
    ),
  },
  {
    exportName: "RadialBarChart",
    purpose: "magnitude",
    question: "How do categories compare, compactly?",
    keywords: ["radial", "circular", "bar"],
    height: H,
    selfSizing: false,
    Thumb: ({ width, height }) => (
      <RadialBarChart width={width} height={height} data={CAT} />
    ),
  },
  {
    exportName: "Histogram",
    purpose: "magnitude",
    question: "How is a single variable distributed?",
    keywords: ["histogram", "bins", "distribution", "frequency"],
    height: H,
    selfSizing: false,
    Thumb: ({ width, height }) => (
      <Histogram width={width} height={height} values={VALUES} />
    ),
  },
  {
    exportName: "ParetoChart",
    purpose: "magnitude",
    question: "Which few causes drive most of the total?",
    keywords: ["pareto", "80/20", "cumulative"],
    height: H,
    selfSizing: false,
    Thumb: ({ width, height }) => (
      <ParetoChart width={width} height={height} data={CAT} />
    ),
  },

  // ---- Part-to-whole -------------------------------------------------------
  {
    exportName: "StackedBarChart",
    purpose: "part-to-whole",
    question: "What is the composition within each category?",
    keywords: ["stacked", "composition", "segments"],
    height: H,
    selfSizing: false,
    Thumb: ({ width, height }) => (
      <StackedBarChart width={width} height={height} data={STACK} />
    ),
  },
  {
    exportName: "DonutChart",
    purpose: "part-to-whole",
    question: "What share is each part of the whole?",
    keywords: ["donut", "pie", "share", "proportion"],
    height: H,
    selfSizing: false,
    Thumb: ({ width, height }) => (
      <DonutChart width={width} height={height} data={CAT} />
    ),
  },
  {
    exportName: "Treemap",
    purpose: "part-to-whole",
    question: "How does the whole break down across a hierarchy?",
    keywords: ["treemap", "hierarchy", "nested"],
    height: H,
    selfSizing: false,
    Thumb: ({ width, height }) => (
      <Treemap width={width} height={height} data={TREE} />
    ),
  },
  {
    exportName: "SunburstChart",
    purpose: "part-to-whole",
    question: "How does a hierarchy break down, radially?",
    keywords: ["sunburst", "hierarchy", "radial"],
    height: H,
    selfSizing: false,
    Thumb: ({ width, height }) => (
      <SunburstChart width={width} height={height} data={TREE} />
    ),
  },
  {
    exportName: "WaffleChart",
    purpose: "part-to-whole",
    question: "What share is each part, counted in cells?",
    keywords: ["waffle", "share", "grid", "proportion"],
    height: H,
    selfSizing: false,
    Thumb: ({ width, height }) => (
      <WaffleChart width={width} height={height} data={CAT} />
    ),
  },
  {
    exportName: "MarimekkoChart",
    purpose: "part-to-whole",
    question: "How do composition and size vary together?",
    keywords: ["marimekko", "mekko", "mosaic"],
    height: H,
    selfSizing: false,
    Thumb: ({ width, height }) => (
      <MarimekkoChart width={width} height={height} data={STACK} />
    ),
  },
  {
    exportName: "FunnelChart",
    purpose: "part-to-whole",
    question: "How much drops off at each stage?",
    keywords: ["funnel", "conversion", "drop-off", "stages"],
    height: H,
    selfSizing: false,
    Thumb: ({ width, height }) => (
      <FunnelChart
        width={width}
        height={height}
        data={[
          { stage: "Visit", value: 1000 },
          { stage: "Product view", value: 640 },
          { stage: "Add to cart", value: 320 },
          { stage: "Checkout", value: 180 },
          { stage: "Purchase", value: 95 },
        ]}
      />
    ),
  },

  // ---- Deviation -----------------------------------------------------------
  {
    exportName: "DivergingBarChart",
    purpose: "deviation",
    question: "How does each category deviate above or below zero?",
    keywords: ["diverging", "deviation", "positive negative"],
    height: H,
    selfSizing: false,
    Thumb: ({ width, height }) => (
      <DivergingBarChart
        width={width}
        height={height}
        data={[
          { category: "Apparel", value: 32 },
          { category: "Home", value: 18 },
          { category: "Beauty", value: 6 },
          { category: "Toys", value: -9 },
          { category: "Grocery", value: -21 },
        ]}
      />
    ),
  },
  {
    exportName: "DivergingStackedBar",
    purpose: "deviation",
    question: "How does sentiment diverge across a scale?",
    keywords: ["likert", "sentiment", "survey", "diverging"],
    height: H,
    selfSizing: false,
    Thumb: ({ width, height }) => (
      <DivergingStackedBar
        width={width}
        height={height}
        data={[
          {
            category: "Checkout",
            segments: [
              { key: "Strongly disagree", value: 8 },
              { key: "Disagree", value: 14 },
              { key: "Neutral", value: 20 },
              { key: "Agree", value: 34 },
              { key: "Strongly agree", value: 24 },
            ],
          },
          {
            category: "Search",
            segments: [
              { key: "Strongly disagree", value: 16 },
              { key: "Disagree", value: 22 },
              { key: "Neutral", value: 18 },
              { key: "Agree", value: 28 },
              { key: "Strongly agree", value: 16 },
            ],
          },
          {
            category: "Support",
            segments: [
              { key: "Strongly disagree", value: 6 },
              { key: "Disagree", value: 10 },
              { key: "Neutral", value: 16 },
              { key: "Agree", value: 38 },
              { key: "Strongly agree", value: 30 },
            ],
          },
        ]}
      />
    ),
  },
  {
    exportName: "PopulationPyramid",
    purpose: "deviation",
    question: "How do two groups compare across bands?",
    keywords: ["pyramid", "population", "age", "demographics"],
    height: H,
    selfSizing: false,
    Thumb: ({ width, height }) => (
      <PopulationPyramid
        width={width}
        height={height}
        data={[
          {
            category: "0–17",
            segments: [
              { key: "Male", value: 62 },
              { key: "Female", value: 58 },
            ],
          },
          {
            category: "18–34",
            segments: [
              { key: "Male", value: 88 },
              { key: "Female", value: 92 },
            ],
          },
          {
            category: "35–54",
            segments: [
              { key: "Male", value: 74 },
              { key: "Female", value: 80 },
            ],
          },
          {
            category: "55+",
            segments: [
              { key: "Male", value: 46 },
              { key: "Female", value: 63 },
            ],
          },
        ]}
      />
    ),
  },

  // ---- Compare & delta -----------------------------------------------------
  {
    exportName: "DumbbellChart",
    purpose: "compare",
    question: "How far apart are two values per category?",
    keywords: ["dumbbell", "range", "before after", "gap"],
    height: H,
    selfSizing: false,
    Thumb: ({ width, height }) => (
      <DumbbellChart
        width={width}
        height={height}
        data={[
          { category: "Onboarding", start: 42, end: 61 },
          { category: "Checkout", start: 55, end: 72 },
          { category: "Search", start: 38, end: 49 },
          { category: "Support", start: 60, end: 58 },
        ]}
        startLabel="2024"
        endLabel="2025"
      />
    ),
  },
  {
    exportName: "SlopeChart",
    purpose: "compare",
    question: "How did each item change between two moments?",
    keywords: ["slope", "change", "before after"],
    height: H,
    selfSizing: false,
    Thumb: ({ width, height }) => (
      <SlopeChart
        width={width}
        height={height}
        data={[
          { id: "a", label: "Apparel", left: 3200, right: 4100 },
          { id: "b", label: "Home", left: 2800, right: 2500 },
          { id: "c", label: "Beauty", left: 1900, right: 2600 },
          { id: "d", label: "Toys", left: 2200, right: 2050 },
        ]}
        leftLabel="2024"
        rightLabel="2025"
      />
    ),
  },
  {
    exportName: "WaterfallChart",
    purpose: "compare",
    question: "What drives the change from start to end?",
    keywords: ["waterfall", "bridge", "contributions"],
    height: H,
    selfSizing: false,
    Thumb: ({ width, height }) => (
      <WaterfallChart
        width={width}
        height={height}
        data={[
          { label: "Start", value: 500, isTotal: true },
          { label: "New", value: 180 },
          { label: "Expansion", value: 90 },
          { label: "Churn", value: -70 },
          { label: "Contraction", value: -40 },
          { label: "End", value: 660, isTotal: true },
        ]}
      />
    ),
  },
  {
    exportName: "BulletChart",
    purpose: "compare",
    question: "Is each measure hitting its target?",
    keywords: ["bullet", "target", "kpi", "progress"],
    height: H,
    selfSizing: false,
    Thumb: ({ width, height }) => (
      <BulletChart
        width={width}
        height={height}
        data={[
          { label: "Revenue", measure: 82, target: 100 },
          { label: "New customers", measure: 68, target: 60 },
          { label: "NPS", measure: 44, target: 50 },
          { label: "Uptime", measure: 96, target: 99 },
        ]}
      />
    ),
  },

  // ---- Rank ----------------------------------------------------------------
  {
    exportName: "BumpChart",
    purpose: "rank",
    question: "How do rankings change over time?",
    keywords: ["bump", "ranking", "position", "over time"],
    height: H,
    selfSizing: false,
    Thumb: ({ width, height }) => (
      <BumpChart
        width={width}
        height={height}
        series={[
          {
            id: "a",
            label: "Running",
            data: [
              { x: new Date("2026-01-01"), y: 120 },
              { x: new Date("2026-02-01"), y: 160 },
              { x: new Date("2026-03-01"), y: 140 },
              { x: new Date("2026-04-01"), y: 190 },
              { x: new Date("2026-05-01"), y: 210 },
            ],
          },
          {
            id: "b",
            label: "Trail",
            data: [
              { x: new Date("2026-01-01"), y: 150 },
              { x: new Date("2026-02-01"), y: 140 },
              { x: new Date("2026-03-01"), y: 170 },
              { x: new Date("2026-04-01"), y: 160 },
              { x: new Date("2026-05-01"), y: 200 },
            ],
          },
          {
            id: "c",
            label: "Court",
            data: [
              { x: new Date("2026-01-01"), y: 100 },
              { x: new Date("2026-02-01"), y: 120 },
              { x: new Date("2026-03-01"), y: 130 },
              { x: new Date("2026-04-01"), y: 150 },
              { x: new Date("2026-05-01"), y: 145 },
            ],
          },
        ]}
      />
    ),
  },

  // ---- Relationship --------------------------------------------------------
  {
    exportName: "ScatterPlot",
    purpose: "relationship",
    question: "How do two variables relate?",
    keywords: ["scatter", "correlation", "xy"],
    height: H,
    selfSizing: false,
    Thumb: ({ width, height }) => (
      <ScatterPlot
        width={width}
        height={height}
        points={[
          { x: 12, y: 22 },
          { x: 20, y: 30 },
          { x: 26, y: 28 },
          { x: 34, y: 44 },
          { x: 41, y: 39 },
          { x: 48, y: 58 },
          { x: 55, y: 51 },
          { x: 63, y: 66 },
          { x: 72, y: 71 },
          { x: 80, y: 68 },
        ]}
      />
    ),
  },
  {
    exportName: "BubbleChart",
    purpose: "relationship",
    question: "How do two variables relate, weighted by a third?",
    keywords: ["bubble", "scatter", "size", "three variables"],
    height: H,
    selfSizing: false,
    Thumb: ({ width, height }) => (
      <BubbleChart
        width={width}
        height={height}
        points={[
          { x: 22, y: 38, size: 320, label: "Acme" },
          { x: 44, y: 52, size: 680, label: "Globex" },
          { x: 61, y: 30, size: 210, label: "Initech" },
          { x: 73, y: 66, size: 900, label: "Umbrella" },
          { x: 35, y: 74, size: 460, label: "Hooli" },
        ]}
      />
    ),
  },
  {
    exportName: "ConnectedScatterplot",
    purpose: "relationship",
    question: "How do two variables move together over a sequence?",
    keywords: ["connected scatter", "trajectory", "path"],
    height: H,
    selfSizing: false,
    Thumb: ({ width, height }) => (
      <ConnectedScatterplot
        width={width}
        height={height}
        points={[
          { x: 20, y: 24, label: "Jan" },
          { x: 26, y: 30 },
          { x: 24, y: 38 },
          { x: 33, y: 42 },
          { x: 41, y: 40 },
          { x: 47, y: 52 },
          { x: 58, y: 61, label: "Jun" },
        ]}
      />
    ),
  },
  {
    exportName: "RadarChart",
    purpose: "relationship",
    question: "How do profiles compare across many axes?",
    keywords: ["radar", "spider", "profile", "multivariate"],
    height: H,
    selfSizing: false,
    Thumb: ({ width, height }) => (
      <RadarChart
        width={width}
        height={height}
        axes={["Speed", "Power", "Range", "Agility", "Comfort"]}
        data={[
          { id: "a", label: "Model A", values: [80, 62, 74, 55, 90] },
          { id: "b", label: "Model B", values: [58, 88, 66, 82, 60] },
        ]}
      />
    ),
  },
  {
    exportName: "ParallelCoordinates",
    purpose: "relationship",
    question: "How do records compare across many dimensions?",
    keywords: ["parallel coordinates", "multivariate", "dimensions"],
    height: H,
    selfSizing: false,
    Thumb: ({ width, height }) => (
      <ParallelCoordinates
        width={width}
        height={height}
        dimensions={[
          { key: "price", label: "Price" },
          { key: "margin", label: "Margin" },
          { key: "volume", label: "Volume" },
          { key: "rating", label: "Rating" },
        ]}
        data={[
          {
            id: "r1",
            values: { price: 40, margin: 32, volume: 1200, rating: 4.2 },
          },
          {
            id: "r2",
            values: { price: 88, margin: 18, volume: 640, rating: 3.6 },
          },
          {
            id: "r3",
            values: { price: 62, margin: 44, volume: 2100, rating: 4.8 },
          },
          {
            id: "r4",
            values: { price: 30, margin: 26, volume: 900, rating: 4.0 },
          },
        ]}
      />
    ),
  },

  // ---- Distribution --------------------------------------------------------
  {
    exportName: "BoxPlot",
    purpose: "distribution",
    question: "How do these distributions compare?",
    keywords: ["box plot", "quartiles", "median", "spread"],
    height: H,
    selfSizing: false,
    Thumb: ({ width, height }) => (
      <BoxPlot
        width={width}
        height={height}
        groups={[
          {
            label: "Web",
            min: 12,
            firstQuartile: 28,
            median: 40,
            thirdQuartile: 55,
            max: 78,
          },
          {
            label: "Mobile",
            min: 8,
            firstQuartile: 22,
            median: 34,
            thirdQuartile: 48,
            max: 70,
          },
          {
            label: "Retail",
            min: 18,
            firstQuartile: 33,
            median: 46,
            thirdQuartile: 60,
            max: 88,
          },
        ]}
      />
    ),
  },
  {
    exportName: "ViolinPlot",
    purpose: "distribution",
    question: "How do the full distributions compare?",
    keywords: ["violin", "density", "distribution", "kde"],
    height: H,
    selfSizing: false,
    Thumb: ({ width, height }) => {
      const groups = ["Web", "Mobile", "Retail"].map((label, g) => ({
        label,
        samples: Array.from({ length: 60 }, (_, i) =>
          Math.round(
            42 +
              g * 8 +
              ((rand(i + g * 100) + rand(i + g * 100 + 40)) / 2 - 0.5) * 60
          )
        ),
      }));
      return <ViolinPlot width={width} height={height} groups={groups} />;
    },
  },
  {
    exportName: "BeeswarmPlot",
    purpose: "distribution",
    question: "How are the individual points distributed?",
    keywords: ["beeswarm", "jitter", "points", "distribution"],
    height: H,
    selfSizing: false,
    Thumb: ({ width, height }) => (
      <BeeswarmPlot width={width} height={height} values={VALUES} />
    ),
  },
  {
    exportName: "CumulativeCurve",
    purpose: "distribution",
    question: "What share of the data falls below each value?",
    keywords: ["cumulative", "cdf", "percentile", "ogive"],
    height: H,
    selfSizing: false,
    Thumb: ({ width, height }) => (
      <CumulativeCurve width={width} height={height} values={VALUES} />
    ),
  },

  // ---- Matrix & retention --------------------------------------------------
  {
    exportName: "Heatmap",
    purpose: "matrix",
    question: "How does a value vary across a matrix?",
    keywords: ["heatmap", "matrix", "grid", "intensity"],
    height: H,
    selfSizing: false,
    Thumb: ({ width, height }) => (
      <Heatmap
        width={width}
        height={height}
        rows={[
          { label: "Mon", values: [12, 24, 40, 62, 48, 20] },
          { label: "Tue", values: [8, 22, 44, 70, 52, 26] },
          { label: "Wed", values: [10, 26, 50, 66, 46, 22] },
          { label: "Thu", values: [14, 30, 48, 72, 58, 30] },
          { label: "Fri", values: [18, 34, 56, 80, 64, 38] },
        ]}
        columnLabels={["6a", "9a", "12p", "3p", "6p", "9p"]}
      />
    ),
  },
  {
    exportName: "CalendarHeatmap",
    purpose: "matrix",
    question: "How does a daily value vary across the calendar?",
    keywords: ["calendar", "heatmap", "daily", "github"],
    height: 130,
    selfSizing: false,
    Thumb: ({ width, height }) => {
      const days = Array.from({ length: 120 }, (_, i) => ({
        date: new Date(2026, 0, i + 1),
        value: Math.round(10 + 9 * Math.sin(i / 5) + (i % 7 === 0 ? 12 : 0)),
      }));
      return <CalendarHeatmap width={width} height={height} data={days} />;
    },
  },
  {
    exportName: "CohortTriangle",
    purpose: "matrix",
    question: "How does retention decay by cohort?",
    keywords: ["cohort", "retention", "triangle", "churn"],
    height: H,
    selfSizing: false,
    Thumb: ({ width, height }) => (
      <CohortTriangle
        width={width}
        height={height}
        rows={[
          { label: "Jan", values: [100, 68, 52, 44, 39] },
          { label: "Feb", values: [100, 72, 58, 47] },
          { label: "Mar", values: [100, 65, 50] },
          { label: "Apr", values: [100, 70] },
          { label: "May", values: [100] },
        ]}
        periodLabels={["M0", "M1", "M2", "M3", "M4"]}
      />
    ),
  },
  {
    exportName: "RfmGrid",
    purpose: "matrix",
    question: "How are customers spread across recency and frequency?",
    keywords: ["rfm", "recency frequency", "segmentation"],
    height: H,
    selfSizing: false,
    Thumb: ({ width, height }) => (
      <RfmGrid
        width={width}
        height={height}
        data={[
          { recency: 1, frequency: 1, count: 40, value: 8000 },
          { recency: 1, frequency: 3, count: 120, value: 52000 },
          { recency: 2, frequency: 4, count: 90, value: 61000 },
          { recency: 3, frequency: 2, count: 70, value: 22000 },
          { recency: 4, frequency: 5, count: 55, value: 98000 },
          { recency: 5, frequency: 1, count: 30, value: 5000 },
          { recency: 5, frequency: 5, count: 140, value: 210000 },
        ]}
      />
    ),
  },

  // ---- Flow ----------------------------------------------------------------
  {
    exportName: "SankeyDiagram",
    purpose: "flow",
    question: "How does volume flow between stages?",
    keywords: ["sankey", "flow", "alluvial", "nodes"],
    height: H,
    selfSizing: false,
    Thumb: ({ width, height }) => (
      <SankeyDiagram
        width={width}
        height={height}
        graph={{
          nodes: [
            { name: "Search" },
            { name: "Direct" },
            { name: "Home" },
            { name: "Product" },
            { name: "Cart" },
            { name: "Purchase" },
          ],
          links: [
            { source: 0, target: 2, value: 480 },
            { source: 1, target: 2, value: 220 },
            { source: 2, target: 3, value: 520 },
            { source: 3, target: 4, value: 300 },
            { source: 4, target: 5, value: 160 },
          ],
        }}
      />
    ),
  },
  {
    exportName: "ChordDiagram",
    purpose: "flow",
    question: "How much flows between each pair?",
    keywords: ["chord", "flow", "matrix", "relationships"],
    height: H,
    selfSizing: false,
    Thumb: ({ width, height }) => (
      <ChordDiagram
        width={width}
        height={height}
        data={{
          labels: ["Search", "Social", "Email", "Direct", "Referral"],
          matrix: [
            [0, 18, 9, 24, 6],
            [14, 0, 12, 8, 20],
            [7, 15, 0, 30, 5],
            [22, 10, 26, 0, 11],
            [9, 19, 4, 13, 0],
          ],
        }}
      />
    ),
  },

  // ---- Timeline ------------------------------------------------------------
  {
    exportName: "GanttChart",
    purpose: "timeline",
    question: "When does each task happen, and for how long?",
    keywords: ["gantt", "timeline", "schedule", "project"],
    height: H,
    selfSizing: false,
    Thumb: ({ width, height }) => (
      <GanttChart
        width={width}
        height={height}
        data={[
          {
            label: "Discovery",
            start: new Date(2026, 0, 1),
            end: new Date(2026, 1, 1),
            category: "Plan",
          },
          {
            label: "Design",
            start: new Date(2026, 1, 1),
            end: new Date(2026, 2, 15),
            category: "Plan",
          },
          {
            label: "Build",
            start: new Date(2026, 2, 1),
            end: new Date(2026, 5, 1),
            category: "Build",
          },
          {
            label: "Beta",
            start: new Date(2026, 5, 1),
            end: new Date(2026, 6, 15),
            category: "Build",
          },
          { label: "Launch", start: new Date(2026, 6, 15), category: "Launch" },
          {
            label: "Rollout",
            start: new Date(2026, 6, 15),
            end: new Date(2026, 9, 1),
            category: "Launch",
          },
        ]}
      />
    ),
  },

  // ---- Single value --------------------------------------------------------
  {
    exportName: "StatCard",
    purpose: "single-value",
    question: "What is the headline number right now?",
    keywords: ["stat", "kpi", "metric", "big number"],
    height: 120,
    selfSizing: true,
    Thumb: () => (
      <StatCard label="Monthly revenue" value={128400} previous={112900} />
    ),
  },
  {
    exportName: "Gauge",
    purpose: "single-value",
    question: "How close is a value to its target?",
    keywords: ["gauge", "dial", "target", "progress"],
    height: H,
    selfSizing: false,
    Thumb: ({ width, height }) => (
      <Gauge
        width={width}
        height={height}
        value={72}
        min={0}
        max={100}
        threshold={80}
        label="SLA attainment"
      />
    ),
  },

  // ---- Tabular -------------------------------------------------------------
  {
    exportName: "DataTable",
    purpose: "tabular",
    question: "The accessible table fallback for any data.",
    keywords: ["table", "data", "accessible", "fallback"],
    height: 160,
    selfSizing: true,
    Thumb: () => (
      <DataTable
        columns={["Region", "Orders", "Revenue"]}
        rows={[
          ["EU", 1240, "82k"],
          ["US", 980, "71k"],
          ["APAC", 640, "44k"],
        ]}
      />
    ),
  },
];

/* -------------------------------------------------------------------------- */
/* Lookups                                                                     */
/* -------------------------------------------------------------------------- */

export const PURPOSE_BY_KEY = new Map<string, ChartPurpose>(
  PURPOSES.map((p) => [p.key, p])
);

export const ENTRY_BY_EXPORT = new Map<string, ChartCatalogEntry>(
  CHART_CATALOG.map((e) => [e.exportName, e])
);
