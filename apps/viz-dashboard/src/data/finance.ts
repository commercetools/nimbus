/* -------------------------------------------------------------------------- */
/* Mock data — Finance.                                                        */
/* Northwind Supply Co., trailing 12 months. P&L, margin, cashflow, budget.   */
/* Every figure is deterministic (hardcoded, or seeded via trendWalk).        */
/* -------------------------------------------------------------------------- */

import type {
  WaterfallStep,
  CategoryDatum,
  Series,
  SeriesPoint,
  BulletDatum,
} from "@commercetools/nimbus-viz";
import { trailingMonths, trendWalk } from "./format";

const MONTHS = trailingMonths(12);

/* -------------------------------------------------------------------------- */
/* P&L bridge — revenue down to net profit.                                    */
/* Signed steps net to the closing "Net profit" total:                         */
/*   1,384,000 − 720,000 − 72,000 − 84,000 − 282,000 − 76,000 = 150,000        */
/* Gross profit = 1,384,000 − 720,000 = 664,000  →  margin 47.98% (~0.48).     */
/* -------------------------------------------------------------------------- */

export const PL_BRIDGE: WaterfallStep[] = [
  { label: "Revenue", value: 1_384_000, isTotal: true },
  { label: "COGS", value: -720_000 },
  { label: "Fulfillment", value: -72_000 },
  { label: "Marketing", value: -84_000 },
  { label: "Opex", value: -282_000 },
  { label: "Tax", value: -76_000 },
  { label: "Net profit", value: 150_000, isTotal: true },
];

/* -------------------------------------------------------------------------- */
/* Margin vs. target by category — signed percentage-point deviation.          */
/* Positive = margin above plan; negative = below plan.                        */
/* -------------------------------------------------------------------------- */

export const MARGIN_VS_TARGET: CategoryDatum[] = [
  { category: "Beauty", value: 4.6 },
  { category: "Apparel", value: 3.2 },
  { category: "Home", value: 1.9 },
  { category: "Footwear", value: 1.4 },
  { category: "Wholesale", value: -1.7 },
  { category: "Accessories", value: -2.1 },
  { category: "Electronics", value: -3.4 },
];

/* -------------------------------------------------------------------------- */
/* Cashflow composition — 4 inflow streams across the trailing 12 months.      */
/* Seeded upward walks; every value is positive (trendWalk clamps at 0).       */
/* -------------------------------------------------------------------------- */

const toSeries = (id: string, label: string, values: number[]): Series => ({
  id,
  label,
  data: MONTHS.map((x, i) => ({ x, y: values[i] })),
});

export const CASHFLOW_SERIES: Series[] = [
  toSeries(
    "product-sales",
    "Product sales",
    trendWalk(11, 12, { start: 62_000, drift: 0.03, jitter: 9_000 })
  ),
  toSeries(
    "subscriptions",
    "Subscriptions",
    trendWalk(21, 12, { start: 18_000, drift: 0.05, jitter: 3_000 })
  ),
  toSeries(
    "services",
    "Services",
    trendWalk(31, 12, { start: 12_000, drift: 0.02, jitter: 2_500 })
  ),
  toSeries(
    "other",
    "Other",
    trendWalk(41, 12, { start: 6_000, drift: 0.01, jitter: 1_500 })
  ),
];

export const CASHFLOW_DOMAIN = CASHFLOW_SERIES.map((s) => s.id);

/* -------------------------------------------------------------------------- */
/* Budget vs. actual (spend) by department — measure = actual, target = budget.*/
/* ranges: under-budget / on-budget / over-budget qualitative bands.           */
/* -------------------------------------------------------------------------- */

export const BUDGET_VS_ACTUAL: BulletDatum[] = [
  {
    label: "Engineering",
    measure: 172_000,
    target: 180_000,
    ranges: [162_000, 180_000, 198_000],
  },
  {
    label: "Marketing",
    measure: 131_000,
    target: 120_000,
    ranges: [108_000, 120_000, 132_000],
  },
  {
    label: "Operations",
    measure: 92_000,
    target: 96_000,
    ranges: [86_000, 96_000, 106_000],
  },
  {
    label: "Sales",
    measure: 88_000,
    target: 84_000,
    ranges: [76_000, 84_000, 92_000],
  },
  {
    label: "Support",
    measure: 57_000,
    target: 60_000,
    ranges: [54_000, 60_000, 66_000],
  },
];

/* -------------------------------------------------------------------------- */
/* Where opex goes — operating-expense breakdown.                              */
/* Sums to 438,000, the "Operating expenses" KPI value.                        */
/* -------------------------------------------------------------------------- */

export const OPEX_BREAKDOWN: CategoryDatum[] = [
  { category: "Salaries", value: 168_000 },
  { category: "Marketing", value: 84_000 },
  { category: "Logistics", value: 72_000 },
  { category: "Software", value: 48_000 },
  { category: "Rent", value: 42_000 },
  { category: "Other", value: 24_000 },
];

export const OPEX_DOMAIN = OPEX_BREAKDOWN.map((d) => d.category);

/* -------------------------------------------------------------------------- */
/* Headline KPIs + trailing 12-point sparklines.                              */
/* Sparks are monthly trends consistent with the value/previous deltas.       */
/* -------------------------------------------------------------------------- */

const spark = (values: number[]): SeriesPoint[] =>
  values.map((y, x) => ({ x, y }));

/** Monthly gross margin, ramping from ~46% to the closing 47.98%. */
const GROSS_MARGIN_MONTHLY = [
  0.459, 0.461, 0.463, 0.466, 0.468, 0.47, 0.472, 0.474, 0.476, 0.477, 0.479,
  0.4798,
];
/** Monthly net profit, climbing through the year. */
const NET_PROFIT_MONTHLY = [
  7_800, 8_600, 9_200, 10_100, 10_800, 11_400, 12_200, 12_900, 13_600, 14_300,
  15_100, 16_000,
];
/** Monthly operating expenses, drifting up with headcount + spend. */
const OPEX_MONTHLY = [
  31_000, 32_000, 33_500, 34_000, 35_500, 36_000, 37_000, 37_500, 38_500,
  39_000, 40_000, 41_000,
];
/** Month-end cash balance. */
const CASH_MONTHLY = [
  468_000, 472_000, 479_000, 485_000, 483_000, 490_000, 496_000, 501_000,
  498_000, 505_000, 509_000, 512_000,
];

export const KPIS = {
  grossMargin: {
    value: 0.4798,
    previous: 0.4612,
    spark: spark(GROSS_MARGIN_MONTHLY),
  },
  netProfit: {
    value: 150_000,
    previous: 118_000,
    spark: spark(NET_PROFIT_MONTHLY),
  },
  opex: {
    value: 438_000,
    previous: 402_000,
    spark: spark(OPEX_MONTHLY),
  },
  cash: {
    value: 512_000,
    previous: 468_000,
    spark: spark(CASH_MONTHLY),
  },
};
