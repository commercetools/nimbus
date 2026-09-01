/* -------------------------------------------------------------------------- */
/* Mock data — Marketing & channels.                                          */
/* Northwind Supply Co.'s acquisition funnel, channel mix, and campaign ROI,  */
/* trailing 12 months. Deterministic: hardcoded arrays + seeded RNG only.     */
/* -------------------------------------------------------------------------- */

import type {
  SeriesPoint,
  FunnelStage,
  FlowGraph,
  StackRow,
  BubblePoint,
  CalendarDatum,
} from "@commercetools/nimbus-viz";
import { seededRandom } from "./format";

/* -------------------------------------------------------------------------- */
/* Headline KPIs + trailing 12-month sparkline series.                        */
/* Spend and attributed revenue reconcile with the per-channel breakdown      */
/* below; ROAS = revenue / spend ≈ 4.2×; CAC trends down as spend scales.     */
/* -------------------------------------------------------------------------- */

/** Monthly marketing spend (USD) — sums to $328k. */
const SPEND_MONTHLY = [
  22_000, 23_500, 24_000, 25_000, 26_500, 27_000, 28_000, 27_500, 29_000,
  30_500, 33_000, 32_000,
];
/** Monthly attributed revenue (USD) — sums to ~$1.379M. */
const REVENUE_MONTHLY = [
  83_600, 91_650, 96_000, 97_500, 108_650, 113_400, 120_400, 112_750, 124_700,
  134_200, 148_500, 147_200,
];
/** Monthly blended ROAS (revenue ÷ spend), climbing through the year. */
const ROAS_MONTHLY = [
  3.8, 3.9, 4.0, 3.9, 4.1, 4.2, 4.3, 4.1, 4.3, 4.4, 4.5, 4.6,
];
/** Monthly blended customer-acquisition cost (USD), falling as we scale. */
const CAC_MONTHLY = [
  46.5, 45.8, 45.0, 44.6, 43.9, 43.2, 42.8, 43.0, 42.4, 41.9, 41.2, 40.8,
];

const spark = (values: number[]): SeriesPoint[] =>
  values.map((y, x) => ({ x, y }));

export const KPIS = {
  spend: {
    value: 328_000,
    previous: 296_000,
    spark: spark(SPEND_MONTHLY),
  },
  roas: {
    value: 4.2,
    previous: 3.8,
    spark: spark(ROAS_MONTHLY),
  },
  cac: {
    value: 41.85,
    previous: 46.2,
    spark: spark(CAC_MONTHLY),
  },
  attributedRevenue: {
    value: 1_378_550,
    previous: 1_124_000,
    spark: spark(REVENUE_MONTHLY),
  },
};

/* -------------------------------------------------------------------------- */
/* Conversion funnel — site sessions down to purchases. Kept to a readable     */
/* dynamic range so every stage bar stays legible; Purchase reconciles with    */
/* the attributed-revenue KPI (≈12.2k orders × ~$113 AOV ≈ $1.38M).            */
/* -------------------------------------------------------------------------- */

export const MEDIA_FUNNEL: FunnelStage[] = [
  { stage: "Sessions", value: 486_000 },
  { stage: "Product views", value: 214_000 },
  { stage: "Add to cart", value: 84_600 },
  { stage: "Checkout", value: 31_200 },
  { stage: "Purchase", value: 12_240 },
];

/* -------------------------------------------------------------------------- */
/* Traffic flow (Sankey) — sources → landing pages → purchase or bounce.      */
/* `links` reference `nodes` by numeric index. Inflow/outflow per mid-node    */
/* is balanced so the ribbons read cleanly.                                   */
/* -------------------------------------------------------------------------- */

export const TRAFFIC_FLOW: FlowGraph = {
  nodes: [
    { name: "Paid search" }, //  0  sources
    { name: "Social" }, //       1
    { name: "Email" }, //        2
    { name: "Organic" }, //      3
    { name: "Referral" }, //     4
    { name: "Landing pages" }, //5  mid
    { name: "Product" }, //      6
    { name: "Home" }, //         7
    { name: "Purchase" }, //     8  outcomes
    { name: "Bounce" }, //       9
  ],
  links: [
    // sources → mid
    { source: 0, target: 5, value: 3_200 },
    { source: 0, target: 6, value: 1_400 },
    { source: 1, target: 5, value: 2_100 },
    { source: 1, target: 7, value: 900 },
    { source: 2, target: 6, value: 1_800 },
    { source: 3, target: 7, value: 2_600 },
    { source: 3, target: 6, value: 1_500 },
    { source: 4, target: 5, value: 800 },
    // mid → outcomes
    { source: 5, target: 8, value: 1_500 },
    { source: 5, target: 9, value: 4_600 },
    { source: 6, target: 8, value: 1_900 },
    { source: 6, target: 9, value: 2_800 },
    { source: 7, target: 8, value: 600 },
    { source: 7, target: 9, value: 2_900 },
  ],
};

/* -------------------------------------------------------------------------- */
/* Spend vs. attributed revenue by channel. Segment keys are shared across    */
/* rows ("Spend", "Revenue") so the grouped bars pair up per channel.         */
/* Totals reconcile with the KPI figures above.                               */
/* -------------------------------------------------------------------------- */

export const CHANNEL_SPEND_REVENUE: StackRow[] = [
  {
    category: "Paid search",
    segments: [
      { key: "Spend", value: 112_000 },
      { key: "Revenue", value: 384_000 },
    ],
  },
  {
    category: "Social",
    segments: [
      { key: "Spend", value: 78_000 },
      { key: "Revenue", value: 249_000 },
    ],
  },
  {
    category: "Email",
    segments: [
      { key: "Spend", value: 34_000 },
      { key: "Revenue", value: 268_000 },
    ],
  },
  {
    category: "Organic",
    segments: [
      { key: "Spend", value: 62_000 },
      { key: "Revenue", value: 356_000 },
    ],
  },
  {
    category: "Referral",
    segments: [
      { key: "Spend", value: 42_000 },
      { key: "Revenue", value: 121_000 },
    ],
  },
];

export const CHANNEL_COLOR_DOMAIN = ["Spend", "Revenue"];

/* -------------------------------------------------------------------------- */
/* Campaigns — spend (x) vs. attributed revenue (y), bubble size = ROAS.      */
/* Grouped by channel. Email campaigns sit high-and-left (efficient); paid    */
/* social sits low-and-right (heavy spend, thinner returns).                  */
/* -------------------------------------------------------------------------- */

export const CAMPAIGNS: BubblePoint[] = [
  {
    label: "Spring Sale — Search",
    group: "Paid search",
    x: 28_000,
    y: 96_000,
    size: 3.4,
  },
  {
    label: "Brand Terms",
    group: "Paid search",
    x: 34_000,
    y: 142_000,
    size: 4.2,
  },
  {
    label: "Search Retargeting",
    group: "Paid search",
    x: 18_000,
    y: 88_000,
    size: 4.9,
  },
  {
    label: "Instagram Reels",
    group: "Social",
    x: 24_000,
    y: 71_000,
    size: 3.0,
  },
  { label: "TikTok Launch", group: "Social", x: 31_000, y: 79_000, size: 2.5 },
  {
    label: "Influencer Collab",
    group: "Social",
    x: 15_000,
    y: 62_000,
    size: 4.1,
  },
  { label: "Welcome Flow", group: "Email", x: 8_000, y: 74_000, size: 9.3 },
  { label: "Winback", group: "Email", x: 11_000, y: 61_000, size: 5.5 },
  {
    label: "Newsletter Promos",
    group: "Email",
    x: 9_000,
    y: 58_000,
    size: 6.4,
  },
  { label: "SEO Content", group: "Organic", x: 22_000, y: 138_000, size: 6.3 },
  {
    label: "Affiliate Network",
    group: "Referral",
    x: 26_000,
    y: 72_000,
    size: 2.8,
  },
  {
    label: "Partner Bundle",
    group: "Referral",
    x: 12_000,
    y: 44_000,
    size: 3.7,
  },
];

/* -------------------------------------------------------------------------- */
/* Daily conversions — a full year for the calendar heatmap.                  */
/* Weekend dip + gentle year wave + a strong Q4 holiday spike (Nov/Dec).      */
/* -------------------------------------------------------------------------- */

export const DAILY_CONVERSIONS: CalendarDatum[] = (() => {
  const rand = seededRandom(23);
  const out: CalendarDatum[] = [];
  const start = new Date(2025, 0, 1);
  for (let i = 0; i < 365; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    const dow = date.getDay();
    const month = date.getMonth();
    const weekendDip = dow === 0 || dow === 6 ? 0.7 : 1;
    // Subtle sinusoidal wave across the year (peaks mid-year).
    const seasonal = 1 + Math.sin((i / 365) * Math.PI * 2 - Math.PI / 2) * 0.12;
    // Black Friday / holiday lift in November and December.
    const holiday = month === 10 || month === 11 ? 1.5 : 1;
    const base = 30 * seasonal * holiday * weekendDip;
    const noise = (rand() - 0.4) * 14;
    out.push({ date, value: Math.max(0, Math.round(base + noise)) });
  }
  return out;
})();
