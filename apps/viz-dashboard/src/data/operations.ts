/* -------------------------------------------------------------------------- */
/* Mock data — Operations & fulfillment.                                       */
/* Northwind Supply Co.'s back office: throughput, delivery SLAs, and returns. */
/* Everything is deterministic (hardcoded or seeded RNG) — never Math.random.  */
/* -------------------------------------------------------------------------- */

import type {
  Series,
  SeriesPoint,
  CategoryDatum,
  TimelineEvent,
} from "@commercetools/nimbus-viz";
import { seededRandom } from "./format";

/* -------------------------------------------------------------------------- */
/* Headline KPIs + trailing 12-point sparklines.                              */
/* Values are period aggregates; sparks carry the monthly trend shape.        */
/* -------------------------------------------------------------------------- */

const spark = (values: number[]): SeriesPoint[] =>
  values.map((y, x) => ({ x, y }));

/** Orders shipped per month (trailing 12) — volume climbs with demand. */
const SHIPPED_MONTHLY = [
  1_120, 1_190, 1_300, 1_250, 1_460, 1_580, 1_660, 1_520, 1_720, 1_880, 2_190,
  2_570,
];
/** On-time delivery rate per month — drifting up toward the SLA. */
const ON_TIME_MONTHLY = [
  0.918, 0.924, 0.921, 0.929, 0.933, 0.927, 0.938, 0.941, 0.936, 0.944, 0.939,
  0.942,
];
/** Average processing time in days — trending down (getting faster). */
const PROCESSING_MONTHLY = [
  2.4, 2.3, 2.35, 2.2, 2.1, 2.15, 2.0, 1.95, 2.0, 1.9, 1.85, 1.8,
];
/** Return rate per month — easing down as sizing guidance improves. */
const RETURN_MONTHLY = [
  0.081, 0.079, 0.083, 0.078, 0.076, 0.077, 0.073, 0.071, 0.072, 0.07, 0.069,
  0.068,
];

export const KPIS = {
  shipped: {
    value: 18_940, // trailing-12-month total
    previous: 16_720,
    spark: spark(SHIPPED_MONTHLY),
  },
  onTime: {
    value: 0.942,
    previous: 0.928,
    spark: spark(ON_TIME_MONTHLY),
  },
  processing: {
    value: 1.8,
    previous: 2.1,
    spark: spark(PROCESSING_MONTHLY),
  },
  returns: {
    value: 0.068,
    previous: 0.074,
    spark: spark(RETURN_MONTHLY),
  },
};

/* -------------------------------------------------------------------------- */
/* Fulfillment pipeline — a timeline/Gantt of 8 recent orders.                */
/* One bar per order; its category is the stage the order has reached, which  */
/* colors the bar. Starts stagger across a few December days.                  */
/* -------------------------------------------------------------------------- */

/** Pipeline stages in flow order — used as the color domain for the Gantt. */
export const FULFILLMENT_STAGES = [
  "Picking",
  "Packing",
  "In transit",
  "Delivered",
] as const;

export const FULFILLMENT_TIMELINE: TimelineEvent[] = [
  {
    label: "Order #1042",
    start: new Date(2025, 11, 1, 8),
    end: new Date(2025, 11, 3, 14),
    category: "Delivered",
  },
  {
    label: "Order #1043",
    start: new Date(2025, 11, 1, 11),
    end: new Date(2025, 11, 3, 17),
    category: "Delivered",
  },
  {
    label: "Order #1044",
    start: new Date(2025, 11, 2, 9),
    end: new Date(2025, 11, 4, 12),
    category: "Delivered",
  },
  {
    label: "Order #1045",
    start: new Date(2025, 11, 2, 15),
    end: new Date(2025, 11, 5, 10),
    category: "In transit",
  },
  {
    label: "Order #1046",
    start: new Date(2025, 11, 3, 8),
    end: new Date(2025, 11, 5, 16),
    category: "In transit",
  },
  {
    label: "Order #1047",
    start: new Date(2025, 11, 3, 13),
    end: new Date(2025, 11, 4, 18),
    category: "Packing",
  },
  {
    label: "Order #1048",
    start: new Date(2025, 11, 4, 10),
    end: new Date(2025, 11, 4, 20),
    category: "Packing",
  },
  {
    label: "Order #1049",
    start: new Date(2025, 11, 4, 14),
    end: new Date(2025, 11, 4, 19),
    category: "Picking",
  },
];

/* -------------------------------------------------------------------------- */
/* On-time delivery SLA (percent) — for the gauge. Target 95%.                 */
/* -------------------------------------------------------------------------- */

export const ON_TIME_SLA = 94;

/* -------------------------------------------------------------------------- */
/* Processing-time control chart — daily hours over ~30 days.                 */
/* Seeded around a ~10h mean, with two deliberate out-of-control spikes.      */
/* Center line and control limits are left to the chart's defaults.           */
/* -------------------------------------------------------------------------- */

export const PROCESSING_CONTROL: Series[] = (() => {
  const rand = seededRandom(42);
  const start = new Date(2025, 10, 1); // Nov 1, 2025
  // Two anomalies (a warehouse system outage, then a carrier backlog).
  const spikes: Record<number, number> = { 11: 20.4, 22: 19.6 };
  const data: SeriesPoint[] = [];
  for (let i = 0; i < 30; i++) {
    const x = new Date(start);
    x.setDate(start.getDate() + i);
    const base = 10 + (rand() - 0.5) * 3; // ~8.5–11.5h
    const y = spikes[i] ?? Math.round(base * 10) / 10;
    data.push({ x, y });
  }
  return [{ id: "proc", label: "Processing hours", data }];
})();

/* -------------------------------------------------------------------------- */
/* Return reasons — ranked descending for a Pareto (the "vital few").         */
/* -------------------------------------------------------------------------- */

export const RETURN_REASONS: CategoryDatum[] = [
  { category: "Wrong size", value: 412 },
  { category: "Changed mind", value: 268 },
  { category: "Damaged", value: 154 },
  { category: "Not as described", value: 96 },
  { category: "Late", value: 61 },
  { category: "Other", value: 43 },
];

/* -------------------------------------------------------------------------- */
/* Throughput by fulfillment center — units shipped (radial bars).            */
/* -------------------------------------------------------------------------- */

export const THROUGHPUT_BY_CENTER: CategoryDatum[] = [
  { category: "Newark", value: 6_420 },
  { category: "Atlanta", value: 5_180 },
  { category: "Dallas", value: 4_760 },
  { category: "Reno", value: 3_940 },
  { category: "Kent", value: 2_610 },
];
