/* -------------------------------------------------------------------------- */
/* Mock data — Customers & retention.                                          */
/* Northwind Supply Co.'s customer base: who comes back, who's worth the most, */
/* and who's slipping. Trailing 12 months, all figures deterministic.          */
/* -------------------------------------------------------------------------- */

import type {
  HeatRow,
  RfmCell,
  FunnelStage,
  StackRow,
  SeriesPoint,
} from "@commercetools/nimbus-viz";
import { seededRandom, MONTH_LABELS } from "./format";

const spark = (values: number[]): SeriesPoint[] =>
  values.map((y, x) => ({ x, y }));

/* -------------------------------------------------------------------------- */
/* Headline KPIs + trailing sparkline series.                                 */
/* -------------------------------------------------------------------------- */

/** Active (purchasing) customers per month — a steadily growing base. */
const ACTIVE_MONTHLY = [
  21_600, 21_900, 22_100, 22_400, 22_800, 23_100, 23_400, 23_700, 24_000,
  24_300, 24_550, 24_800,
];
/** Repeat-purchase rate (0–1) — improving as retention programs land. */
const REPEAT_MONTHLY = [
  0.362, 0.368, 0.371, 0.376, 0.381, 0.388, 0.392, 0.398, 0.401, 0.405, 0.408,
  0.41,
];
/** Average customer lifetime value (USD) — trending up with repeat rate. */
const LTV_MONTHLY = [
  258.4, 261.1, 262.4, 265.9, 269.3, 272.6, 275.1, 277.8, 279.9, 281.7, 283.2,
  284.6,
];
/** Monthly churn rate (0–1) — trending DOWN, which is the good direction. */
const CHURN_MONTHLY = [
  0.068, 0.066, 0.064, 0.063, 0.061, 0.059, 0.058, 0.056, 0.055, 0.053, 0.051,
  0.05,
];

export const KPIS = {
  activeCustomers: {
    value: 24_800,
    previous: 23_100,
    spark: spark(ACTIVE_MONTHLY),
  },
  repeatRate: {
    value: 0.41,
    previous: 0.381,
    spark: spark(REPEAT_MONTHLY),
  },
  ltv: {
    value: 284.6,
    previous: 262.4,
    spark: spark(LTV_MONTHLY),
  },
  churnRate: {
    // Previous is HIGHER than value — churn falling is the win here.
    value: 0.05,
    previous: 0.062,
    spark: spark(CHURN_MONTHLY),
  },
};

/* -------------------------------------------------------------------------- */
/* Retention by monthly acquisition cohort — the cohort triangle.             */
/* One row per cohort (Jan…Oct '25); `values` are indexed by AGE (period-0 =   */
/* 100%). Older cohorts have lived longer, so they carry MORE columns —        */
/* newer cohorts carry fewer, giving the characteristic triangle.             */
/* -------------------------------------------------------------------------- */

const COHORT_COUNT = 10;
/** Baseline retention curve (%) by age; per-cohort jitter added on top. */
const RETENTION_BASE = [100, 56, 45, 39, 35, 32, 30, 28, 26, 24];
const cohortRand = seededRandom(21);

export const RETENTION_COHORTS: HeatRow[] = Array.from(
  { length: COHORT_COUNT },
  (_, i) => {
    // Cohort i acquired in month i; it has aged (COHORT_COUNT - i) periods.
    const length = COHORT_COUNT - i;
    const values = Array.from({ length }, (_, age) => {
      if (age === 0) return 100;
      const jitter = (cohortRand() - 0.5) * 6;
      return Math.round(RETENTION_BASE[age] + jitter);
    });
    return { label: `${MONTH_LABELS[i]} '25`, values };
  }
);

/** Calendar-month labels for the triangle's columns (col 0 = Jan). */
export const RETENTION_PERIOD_LABELS = MONTH_LABELS.slice(0, COHORT_COUNT);

/* -------------------------------------------------------------------------- */
/* RFM segmentation — all 25 recency × frequency cells.                        */
/* Counts skew toward the mid/high segments (the healthy core of the base);    */
/* per-customer value climbs with frequency.                                   */
/* -------------------------------------------------------------------------- */

const rfmRand = seededRandom(33);

export const RFM_SEGMENTS: RfmCell[] = (() => {
  const cells: RfmCell[] = [];
  for (let recency = 1; recency <= 5; recency++) {
    for (let frequency = 1; frequency <= 5; frequency++) {
      const weight = recency + frequency; // 2..10, peaks at champions
      const count = Math.round(40 + weight * weight * 3 + rfmRand() * 60);
      const value = count * (80 + frequency * 55); // heavier buyers worth more
      cells.push({ recency, frequency, count, value });
    }
  }
  return cells;
})();

/* -------------------------------------------------------------------------- */
/* Acquisition funnel — visitors down to loyal customers (descending).        */
/* -------------------------------------------------------------------------- */

export const ACQUISITION_FUNNEL: FunnelStage[] = [
  { stage: "Visitors", value: 128_400 },
  { stage: "Signups", value: 42_600 },
  { stage: "First order", value: 18_900 },
  { stage: "Repeat", value: 7_750 },
  { stage: "Loyal", value: 3_120 },
];

/* -------------------------------------------------------------------------- */
/* New vs. returning revenue by month — a composition-over-time stack.         */
/* Returning revenue overtakes new mid-year as the base compounds.            */
/* -------------------------------------------------------------------------- */

const NEW_REVENUE = [
  38_000, 40_000, 41_000, 39_000, 43_000, 45_000, 44_000, 42_000, 46_000,
  48_000, 52_000, 55_000,
];
const RETURNING_REVENUE = [
  22_000, 25_000, 28_000, 30_000, 34_000, 37_000, 41_000, 44_000, 49_000,
  55_000, 63_000, 72_000,
];

export const REVENUE_BY_TYPE: StackRow[] = MONTH_LABELS.map((month, i) => ({
  category: month,
  segments: [
    { key: "New", value: NEW_REVENUE[i] },
    { key: "Returning", value: RETURNING_REVENUE[i] },
  ],
}));

/** Color order for the New/Returning stack. */
export const REVENUE_TYPE_DOMAIN = ["New", "Returning"];

/* -------------------------------------------------------------------------- */
/* Customer LTV distribution — ~150 seeded, right-skewed samples ($20–$900).   */
/* Most customers cluster low; a long tail of high-value customers stretches   */
/* right. Feeds the histogram.                                                 */
/* -------------------------------------------------------------------------- */

const ltvRand = seededRandom(51);

export const LTV_SAMPLES: number[] = Array.from({ length: 150 }, () => {
  // Squaring the [0,1) draw pushes mass toward the low end (right skew).
  const r = ltvRand();
  return Math.round(20 + Math.pow(r, 2.4) * 880);
});
