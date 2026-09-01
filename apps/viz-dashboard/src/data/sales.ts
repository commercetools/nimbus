/* -------------------------------------------------------------------------- */
/* Mock data — Sales & revenue.                                                */
/* Where revenue comes from and how it's moving for Northwind Supply Co.,      */
/* a mid-size outdoor DTC store, over the trailing 12 months.                  */
/* All numbers are hand-authored so the page renders identically every reload. */
/* -------------------------------------------------------------------------- */

import type {
  Series,
  SeriesPoint,
  CategoryDatum,
  WaterfallStep,
} from "@commercetools/nimbus-viz";
import { trailingMonths } from "./format";

const MONTHS = trailingMonths(12);

const sum = (values: number[]): number => values.reduce((a, b) => a + b, 0);

/** Map a 12-value monthly series to sparkline points. */
const spark = (values: number[]): SeriesPoint[] =>
  values.map((y, x) => ({ x, y }));

/* -------------------------------------------------------------------------- */
/* Monthly revenue by sales channel (USD) — trailing 12 months, upward trend. */
/* Online store leads; the four sum to gross revenue each month.              */
/* -------------------------------------------------------------------------- */

const ONLINE_STORE = [
  62_000, 65_000, 68_000, 66_000, 74_000, 79_000, 83_000, 78_000, 88_000,
  96_000, 108_000, 118_000,
];
const MARKETPLACE = [
  31_000, 33_000, 35_000, 34_000, 38_000, 41_000, 43_000, 40_000, 45_000,
  49_000, 54_000, 58_000,
];
const RETAIL = [
  18_000, 19_000, 20_000, 19_500, 22_000, 23_000, 24_000, 23_000, 26_000,
  28_000, 31_000, 34_000,
];
const WHOLESALE = [
  7_000, 7_500, 8_000, 7_800, 8_500, 9_000, 9_500, 9_200, 10_500, 11_000,
  12_500, 14_000,
];

export const REVENUE_BY_CHANNEL: Series[] = [
  {
    id: "online-store",
    label: "Online store",
    data: MONTHS.map((x, i) => ({ x, y: ONLINE_STORE[i] })),
  },
  {
    id: "marketplace",
    label: "Marketplace",
    data: MONTHS.map((x, i) => ({ x, y: MARKETPLACE[i] })),
  },
  {
    id: "retail",
    label: "Retail",
    data: MONTHS.map((x, i) => ({ x, y: RETAIL[i] })),
  },
  {
    id: "wholesale",
    label: "Wholesale",
    data: MONTHS.map((x, i) => ({ x, y: WHOLESALE[i] })),
  },
];

/** Gross revenue each month = the four channels summed. */
const GROSS_MONTHLY = MONTHS.map(
  (_, i) => ONLINE_STORE[i] + MARKETPLACE[i] + RETAIL[i] + WHOLESALE[i]
);
/** Net revenue ≈ 87% of gross after refunds + discounts. */
const NET_MONTHLY = GROSS_MONTHLY.map((v) => Math.round(v * 0.87));

/* -------------------------------------------------------------------------- */
/* Month-over-month revenue change — a waterfall of the last six months.      */
/* Each step is the signed delta vs. the prior month; the run ends on an       */
/* absolute "Net change" total (sum of the deltas).                            */
/* -------------------------------------------------------------------------- */

const MOM_DELTAS: { label: string; value: number }[] = [
  { label: "Jul", value: 7_500 },
  { label: "Aug", value: -9_300 },
  { label: "Sep", value: 19_300 },
  { label: "Oct", value: 14_500 },
  { label: "Nov", value: 21_500 },
  { label: "Dec", value: 18_500 },
];

/** Net revenue swing across the half (used for the takeaway insight). */
export const MOM_NET_CHANGE = sum(MOM_DELTAS.map((d) => d.value)); // +72,000

export const MOM_REVENUE_CHANGE: WaterfallStep[] = [
  ...MOM_DELTAS,
  { label: "Net change", value: MOM_NET_CHANGE, isTotal: true },
];

/* -------------------------------------------------------------------------- */
/* Revenue by US state — ranked (the horizontal BarChart sorts descending).    */
/* -------------------------------------------------------------------------- */

export const REVENUE_BY_REGION: CategoryDatum[] = [
  { category: "California", value: 428_000 },
  { category: "Texas", value: 312_000 },
  { category: "New York", value: 286_000 },
  { category: "Florida", value: 241_000 },
  { category: "Illinois", value: 168_000 },
  { category: "Washington", value: 132_000 },
  { category: "Georgia", value: 121_000 },
  { category: "Massachusetts", value: 114_000 },
  { category: "Colorado", value: 98_000 },
  { category: "Arizona", value: 88_000 },
];

/* -------------------------------------------------------------------------- */
/* Top products by revenue — the eight best-selling SKUs (USD).               */
/* -------------------------------------------------------------------------- */

export const TOP_PRODUCTS: CategoryDatum[] = [
  { category: "Trail Pack", value: 184_000 },
  { category: "Merino Layer", value: 152_000 },
  { category: "Down Jacket", value: 141_000 },
  { category: "Rain Shell", value: 118_000 },
  { category: "Water Bottle", value: 96_000 },
  { category: "Hiking Boots", value: 88_000 },
  { category: "2P Tent", value: 74_000 },
  { category: "Trek Poles", value: 61_000 },
];

/* -------------------------------------------------------------------------- */
/* Headline KPIs + trailing sparkline series.                                 */
/* Refund rate falls (an improvement); everything else climbs.                */
/* -------------------------------------------------------------------------- */

const REFUND_RATE_MONTHLY = [
  0.038, 0.037, 0.036, 0.037, 0.035, 0.034, 0.033, 0.034, 0.032, 0.031, 0.03,
  0.029,
];
const UNITS_MONTHLY = [
  3_050, 3_180, 3_320, 3_240, 3_620, 3_840, 4_010, 3_780, 4_180, 4_460, 4_820,
  5_140,
];

export const KPIS = {
  grossRevenue: {
    value: sum(GROSS_MONTHLY), // 1,888,000
    previous: 1_612_000,
    spark: spark(GROSS_MONTHLY),
  },
  netRevenue: {
    value: sum(NET_MONTHLY), // ≈ 1,642,000
    previous: 1_402_000,
    spark: spark(NET_MONTHLY),
  },
  refundRate: {
    value: 0.031,
    previous: 0.037,
    spark: spark(REFUND_RATE_MONTHLY),
  },
  unitsSold: {
    value: sum(UNITS_MONTHLY), // 46,640
    previous: 40_180,
    spark: spark(UNITS_MONTHLY),
  },
};
