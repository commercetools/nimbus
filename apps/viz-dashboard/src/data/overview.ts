/* -------------------------------------------------------------------------- */
/* Mock data — Store overview.                                                 */
/* A fictional storefront (Northwind Supply Co.), trailing 12 months.         */
/* -------------------------------------------------------------------------- */

import type {
  Series,
  SeriesPoint,
  CategoryDatum,
  CalendarDatum,
} from "@commercetools/nimbus-viz";
import { trailingMonths, seededRandom } from "./format";

const MONTHS = trailingMonths(12);

/** Monthly revenue (USD): this year vs. last year. */
const REVENUE_THIS_YEAR = [
  82_000, 88_000, 95_000, 91_000, 104_000, 112_000, 118_000, 109_000, 121_000,
  133_000, 158_000, 173_000,
];
const REVENUE_LAST_YEAR = [
  71_000, 74_000, 80_000, 78_000, 86_000, 92_000, 97_000, 90_000, 99_000,
  110_000, 128_000, 141_000,
];

export const REVENUE_SERIES: Series[] = [
  {
    id: "this-year",
    label: "This year",
    data: MONTHS.map((x, i) => ({ x, y: REVENUE_THIS_YEAR[i] })),
  },
  {
    id: "last-year",
    label: "Last year",
    data: MONTHS.map((x, i) => ({ x, y: REVENUE_LAST_YEAR[i] })),
  },
];

/** Orders placed per product category over the window. */
export const ORDERS_BY_CATEGORY: CategoryDatum[] = [
  { category: "Apparel", value: 6_120 },
  { category: "Footwear", value: 4_980 },
  { category: "Accessories", value: 3_110 },
  { category: "Home", value: 2_540 },
  { category: "Beauty", value: 1_460 },
  { category: "Electronics", value: 1_030 },
];

/** Revenue split across sales channels. */
export const REVENUE_BY_CHANNEL: CategoryDatum[] = [
  { category: "Online store", value: 742_000 },
  { category: "Marketplace", value: 358_000 },
  { category: "Retail", value: 214_000 },
  { category: "Wholesale", value: 70_000 },
];

/* -------------------------------------------------------------------------- */
/* Headline KPIs + trailing sparkline series.                                 */
/* -------------------------------------------------------------------------- */

const ORDERS_MONTHLY = [
  1_180, 1_240, 1_360, 1_300, 1_520, 1_640, 1_720, 1_580, 1_790, 1_960, 2_280,
  2_670,
];
const AOV_MONTHLY = [
  69.5, 70.1, 68.9, 70.8, 71.2, 70.6, 71.9, 72.4, 71.8, 72.9, 73.6, 74.2,
];
const CONVERSION_MONTHLY = [
  0.0291, 0.0298, 0.0305, 0.0301, 0.0312, 0.0318, 0.0321, 0.0309, 0.0324,
  0.0331, 0.034, 0.0352,
];

const spark = (values: number[]): SeriesPoint[] =>
  values.map((y, x) => ({ x, y }));

export const KPIS = {
  revenue: {
    value: 1_384_000,
    previous: 1_146_000,
    spark: spark(REVENUE_THIS_YEAR),
  },
  orders: {
    value: 19_240,
    previous: 16_980,
    spark: spark(ORDERS_MONTHLY),
  },
  conversion: {
    value: 0.0352,
    previous: 0.0301,
    spark: spark(CONVERSION_MONTHLY),
  },
  aov: {
    value: 74.2,
    previous: 67.49,
    spark: spark(AOV_MONTHLY),
  },
};

/* -------------------------------------------------------------------------- */
/* Daily orders — a full year for the calendar heatmap.                       */
/* Weekly seasonality (weekend dip) + gentle upward trend + noise.            */
/* -------------------------------------------------------------------------- */

export const DAILY_ORDERS: CalendarDatum[] = (() => {
  const rand = seededRandom(7);
  const out: CalendarDatum[] = [];
  const start = new Date(2025, 0, 1);
  for (let i = 0; i < 365; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    const dow = date.getDay();
    const weekendDip = dow === 0 || dow === 6 ? 0.72 : 1;
    const trend = 1 + i / 365; // ~2x by year end
    const base = 42 * trend * weekendDip;
    const noise = (rand() - 0.4) * 22;
    out.push({ date, value: Math.max(0, Math.round(base + noise)) });
  }
  return out;
})();
