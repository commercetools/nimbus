import type {
  BenchmarkPoint,
  BoxPlotGroupStats,
  BubblePoint,
  BulletDatum,
  CalendarDatum,
  CategoryDatum,
  ConfidenceBandPoint,
  DumbbellRow,
  FlowGraph,
  FunnelStage,
  HeatRow,
  ParallelDimension,
  ParallelRow,
  RadarSeries,
  ResolveRequest,
  RfmCell,
  ScatterPoint,
  Series,
  SeriesPoint,
  SlopeRow,
  StackRow,
  TreemapNode,
  WaterfallStep,
} from "../src";

const months = Array.from({ length: 12 }, (_, m) => new Date(2026, m, 1));

export const revenueSeries: Series[] = [
  {
    id: "rev",
    label: "Revenue",
    data: months.map((x, i) => ({
      x,
      y: 120 + i * 12 + Math.round(24 * Math.sin(i)),
    })),
  },
];

export const multiSeries: Series[] = [
  {
    id: "rev",
    label: "Revenue",
    data: months.map((x, i) => ({
      x,
      y: 320 + i * 18 + Math.round(30 * Math.sin(i / 1.5)),
    })),
  },
  {
    id: "cost",
    label: "Cost",
    data: months.map((x, i) => ({
      x,
      y: 180 + i * 8 + Math.round(15 * Math.cos(i / 1.7)),
    })),
  },
  {
    id: "profit",
    label: "Profit",
    // A deliberate gap to exercise `defined`.
    data: months.map((x, i) => ({
      x,
      y: i === 5 ? null : 140 + i * 10 + Math.round(20 * Math.sin(i / 2)),
    })),
  },
];

export const channels: CategoryDatum[] = [
  { category: "Web", value: 4200 },
  { category: "Mobile", value: 3100 },
  { category: "Marketplace", value: 1800 },
  { category: "POS", value: 1200 },
  { category: "Partner", value: 640 },
];

export const composition: StackRow[] = [
  {
    category: "Q1",
    segments: [
      { key: "New", value: 120 },
      { key: "Returning", value: 200 },
      { key: "Wholesale", value: 80 },
    ],
  },
  {
    category: "Q2",
    segments: [
      { key: "New", value: 150 },
      { key: "Returning", value: 220 },
      { key: "Wholesale", value: 90 },
    ],
  },
  {
    category: "Q3",
    segments: [
      { key: "New", value: 170 },
      { key: "Returning", value: 260 },
      { key: "Wholesale", value: 110 },
    ],
  },
  {
    category: "Q4",
    segments: [
      { key: "New", value: 210 },
      { key: "Returning", value: 300 },
      { key: "Wholesale", value: 140 },
    ],
  },
];

export const scatter: ScatterPoint[] = [
  ...Array.from({ length: 14 }, (_, i) => ({
    x: 20 + i * 4 + Math.round(8 * Math.sin(i)),
    y: 60 + i * 3 + Math.round(15 * Math.cos(i)),
    group: "EU",
    label: `EU store ${i + 1}`,
  })),
  ...Array.from({ length: 14 }, (_, i) => ({
    x: 30 + i * 5 + Math.round(6 * Math.cos(i)),
    y: 40 + i * 4 + Math.round(12 * Math.sin(i)),
    group: "US",
    label: `US store ${i + 1}`,
  })),
];

// Ragged retention matrix — recent cohorts have fewer observed periods.
export const cohorts: HeatRow[] = [
  { label: "Jan", values: [100, 64, 48, 40, 35, 31] },
  { label: "Feb", values: [100, 61, 45, 38, 33] },
  { label: "Mar", values: [100, 66, 50, 42] },
  { label: "Apr", values: [100, 63, 47] },
  { label: "May", values: [100, 60] },
  { label: "Jun", values: [100] },
];

export const cohortPeriods = ["M0", "M1", "M2", "M3", "M4", "M5"];

export const funnel: FunnelStage[] = [
  { stage: "Visits", value: 12000 },
  { stage: "Product views", value: 8200 },
  { stage: "Add to cart", value: 3400 },
  { stage: "Checkout", value: 1800 },
  { stage: "Purchase", value: 1200 },
];

export const flow: FlowGraph = {
  nodes: [
    { name: "Search" },
    { name: "Direct" },
    { name: "Home" },
    { name: "Product" },
    { name: "Cart" },
    { name: "Checkout" },
    { name: "Purchase" },
    { name: "Abandoned" },
  ],
  links: [
    { source: 0, target: 2, value: 5200 },
    { source: 1, target: 2, value: 3000 },
    { source: 2, target: 3, value: 6800 },
    { source: 3, target: 4, value: 3400 },
    { source: 3, target: 7, value: 3400 },
    { source: 4, target: 5, value: 1800 },
    { source: 4, target: 7, value: 1600 },
    { source: 5, target: 6, value: 1200 },
    { source: 5, target: 7, value: 600 },
  ],
};

export const arr: WaterfallStep[] = [
  { label: "Starting ARR", value: 420000, isTotal: true },
  { label: "New business", value: 86000 },
  { label: "Expansion", value: 34000 },
  { label: "Contraction", value: -12000 },
  { label: "Churn", value: -41000 },
  { label: "Ending ARR", value: 487000, isTotal: true },
];

export const bullets: BulletDatum[] = [
  { label: "Revenue", measure: 82, target: 90, ranges: [50, 75, 100] },
  { label: "NPS", measure: 46, target: 40, ranges: [20, 40, 60] },
  { label: "Churn (inv.)", measure: 63, target: 70, ranges: [30, 55, 80] },
];

export const orderValues: number[] = [
  12, 15, 18, 19, 21, 22, 22, 23, 25, 26, 27, 28, 29, 29, 30, 31, 32, 33, 34,
  35, 35, 36, 37, 38, 39, 40, 41, 42, 44, 46, 48, 50, 53, 57, 62, 68, 75, 84,
  95, 110,
];

export const latencyByRegion: BoxPlotGroupStats[] = [
  {
    label: "US-East",
    min: 42,
    firstQuartile: 61,
    median: 78,
    thirdQuartile: 96,
    max: 140,
    outliers: [188, 205],
  },
  {
    label: "EU-West",
    min: 55,
    firstQuartile: 70,
    median: 88,
    thirdQuartile: 110,
    max: 160,
    outliers: [220],
  },
  {
    label: "AP-South",
    min: 60,
    firstQuartile: 85,
    median: 104,
    thirdQuartile: 132,
    max: 190,
  },
];

export const revenueTree: TreemapNode = {
  name: "Revenue",
  children: [
    {
      name: "Direct",
      children: [
        { name: "Web", value: 420 },
        { name: "App", value: 210 },
      ],
    },
    {
      name: "Marketplace",
      children: [
        { name: "Amazon", value: 180 },
        { name: "eBay", value: 60 },
      ],
    },
    { name: "Wholesale", value: 130 },
  ],
};

// Selection-engine demo requests (agent asks intent + data → resolver picks).
export const compareRequest: ResolveRequest = {
  intent: "COMPARE",
  data: channels,
};
export const geoRequest: ResolveRequest = { intent: "GEO", data: channels };

// ── Overlay (Layer 2) demo data, derived from the single-series revenue line ──
const revPts = revenueSeries[0].data;

/** A "plan" comparison line laid under the actuals (BenchmarkSeries). */
export const plan: BenchmarkPoint[] = revPts.map((p) => ({
  x: p.x,
  y: (p.y ?? 0) * 0.88,
}));

/** A ±10% forecast envelope hugging the actuals (ConfidenceBand). */
export const revenueForecast: ConfidenceBandPoint[] = revPts.map((p) => ({
  x: p.x,
  low: (p.y ?? 0) * 0.9,
  high: (p.y ?? 0) * 1.1,
}));

// ── Batch-7 specialized-chart datasets ──────────────────────────────────────

/** Traffic by acquisition channel over time — for stacked area & streamgraph. */
export const channelTraffic: Series[] = [
  {
    id: "organic",
    label: "Organic",
    data: months.map((x, i) => ({
      x,
      y: 320 + i * 26 + Math.round(40 * Math.sin(i)),
    })),
  },
  {
    id: "paid",
    label: "Paid",
    data: months.map((x, i) => ({
      x,
      y: 180 + i * 18 + Math.round(30 * Math.cos(i / 1.4)),
    })),
  },
  {
    id: "referral",
    label: "Referral",
    data: months.map((x, i) => ({
      x,
      y: i === 4 ? null : 90 + i * 12 + Math.round(20 * Math.sin(i / 2)),
    })),
  },
];

export const slopeData: SlopeRow[] = [
  { id: "us", label: "United States", left: 4200, right: 5100 },
  { id: "de", label: "Germany", left: 3100, right: 2600 },
  { id: "jp", label: "Japan", left: 2800, right: 2800 },
  { id: "uk", label: "United Kingdom", left: 1900, right: 2400 },
];

export const dumbbellData: DumbbellRow[] = [
  { category: "Onboarding", start: 42, end: 68 },
  { category: "Checkout", start: 55, end: 51 },
  { category: "Search", start: 30, end: 47 },
  { category: "Support", start: 61, end: 73 },
];

/** Rank-over-time regions — index-aligned series for the bump chart. */
export const bumpSeries: Series[] = [
  {
    id: "north",
    label: "North",
    data: months
      .slice(0, 6)
      .map((x, i) => ({ x, y: 120 + i * 14 + Math.round(30 * Math.sin(i)) })),
  },
  {
    id: "south",
    label: "South",
    data: months
      .slice(0, 6)
      .map((x, i) => ({ x, y: 100 + i * 20 + Math.round(24 * Math.cos(i)) })),
  },
  {
    id: "east",
    label: "East",
    data: months
      .slice(0, 6)
      .map((x, i) => ({
        x,
        y: 140 + i * 10 + Math.round(28 * Math.sin(i / 1.6)),
      })),
  },
  {
    id: "west",
    label: "West",
    data: months
      .slice(0, 6)
      .map((x, i) => ({
        x,
        y: 110 + i * 16 + Math.round(20 * Math.cos(i / 1.3)),
      })),
  },
];

export const bubblePoints: BubblePoint[] = [
  { x: 12, y: 34, size: 1200, group: "Enterprise", label: "Acme" },
  { x: 45, y: 60, size: 640, group: "Enterprise", label: "Globex" },
  { x: 30, y: 22, size: 300, group: "SMB", label: "Initech" },
  { x: 70, y: 80, size: 980, group: "SMB", label: "Umbrella" },
  { x: 55, y: 48, size: 150, group: "Startup", label: "Hooli" },
  { x: 82, y: 40, size: 520, group: "Startup", label: "Pied Piper" },
];

export const sparkData: SeriesPoint[] = [
  { x: 0, y: 8 },
  { x: 1, y: 12 },
  { x: 2, y: 9 },
  { x: 3, y: 15 },
  { x: 4, y: 14 },
  { x: 5, y: 20 },
  { x: 6, y: 17 },
  { x: 7, y: 24 },
];

export const radarAxes = ["Speed", "Power", "Range", "Agility", "Comfort"];
export const radarData: RadarSeries[] = [
  { id: "model-a", label: "Model A", values: [80, 65, 40, 70, 55] },
  { id: "model-b", label: "Model B", values: [55, 80, 70, 45, 90] },
];

export const parallelDimensions: ParallelDimension[] = [
  { key: "price", label: "Price" },
  { key: "mpg", label: "MPG" },
  { key: "hp", label: "Horsepower" },
  { key: "weight", label: "Weight" },
];
export const parallelRows: ParallelRow[] = [
  {
    id: "car-1",
    group: "Sedan",
    values: { price: 32000, mpg: 34, hp: 180, weight: 3200 },
  },
  {
    id: "car-2",
    group: "SUV",
    values: { price: 45000, mpg: 26, hp: 250, weight: 4200 },
  },
  {
    id: "car-3",
    group: "Sedan",
    values: { price: 28000, mpg: 38, hp: 150, weight: 3000 },
  },
  {
    id: "car-4",
    group: "SUV",
    values: { price: 52000, mpg: 22, hp: 300, weight: 4600 },
  },
];

export const calendarData: CalendarDatum[] = [
  { date: "2026-01-05", value: 3 },
  { date: "2026-01-06", value: 8 },
  { date: "2026-01-07", value: 1 },
  { date: "2026-01-09", value: 12 },
  { date: "2026-01-12", value: 5 },
  { date: "2026-01-15", value: 20 },
  { date: "2026-01-16", value: 7 },
  { date: "2026-01-20", value: 14 },
  { date: "2026-01-23", value: 2 },
  { date: "2026-02-02", value: 18 },
  { date: "2026-02-05", value: 9 },
  { date: new Date("2026-02-11"), value: 25 },
  { date: "2026-02-13", value: 6 },
  { date: "2026-02-19", value: 11 },
];

export const rfmData: RfmCell[] = [
  { recency: 1, frequency: 1, count: 120, value: 4200 },
  { recency: 1, frequency: 2, count: 85 },
  { recency: 2, frequency: 1, count: 240, value: 9800 },
  { recency: 2, frequency: 2, count: 160, value: 15200 },
  { recency: 2, frequency: 3, count: 60 },
  { recency: 3, frequency: 2, count: 310, value: 28000 },
  { recency: 3, frequency: 3, count: 190, value: 41000 },
  { recency: 3, frequency: 4, count: 45, value: 22000 },
  { recency: 4, frequency: 3, count: 95 },
  { recency: 4, frequency: 4, count: 130, value: 76000 },
  { recency: 4, frequency: 5, count: 30, value: 51000 },
  { recency: 5, frequency: 4, count: 70, value: 88000 },
  { recency: 5, frequency: 5, count: 210, value: 154000 },
];

/** SPC process with two deliberate out-of-control points (limits set explicitly). */
export const controlSeries: Series[] = [
  {
    id: "fill-weight",
    label: "Fill weight (g)",
    data: [250, 248, 252, 249, 263, 251, 247, 250, 236, 253, 249, 251].map(
      (y, i) => ({ x: new Date(2026, 0, i + 1), y })
    ),
  },
];

export const paretoData: CategoryDatum[] = [
  { category: "Scratches", value: 420 },
  { category: "Misalign", value: 310 },
  { category: "Cracks", value: 180 },
  { category: "Dents", value: 95 },
  { category: "Discolor", value: 60 },
  { category: "Other", value: 35 },
];
