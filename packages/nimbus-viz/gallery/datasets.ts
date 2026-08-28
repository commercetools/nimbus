import type {
  BoxPlotGroupStats,
  BulletDatum,
  CategoryDatum,
  FlowGraph,
  FunnelStage,
  HeatRow,
  ResolveRequest,
  ScatterPoint,
  Series,
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
