/* -------------------------------------------------------------------------- */
/* Shared formatters + deterministic mock-data helpers.                       */
/*                                                                            */
/* Every page imports these so numbers read consistently across the console   */
/* and so the "random" data is stable between reloads (seeded RNG).           */
/* -------------------------------------------------------------------------- */

import {
  createFormatters,
  formatInteger,
  formatPercent,
  formatCompact,
} from "@commercetools/nimbus-viz";

/** Locale-aware number / currency / percent / compact formatters. */
export const fmt = createFormatters({ locale: "en-US", currency: "USD" });

/** Currency with cents — for per-unit figures (AOV, unit price). */
const usdCents = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Percent of a 0–1 ratio, two decimals — for conversion-style metrics. */
const percent2 = new Intl.NumberFormat("en-US", {
  style: "percent",
  minimumFractionDigits: 1,
  maximumFractionDigits: 2,
});

export const formatUsdCents = (n: number) => usdCents.format(n);
export const formatPercent2 = (n: number) => percent2.format(n);
export const formatDays = (n: number) => `${n.toFixed(1)}d`;

export { formatInteger, formatPercent, formatCompact };

/* -------------------------------------------------------------------------- */
/* Deterministic pseudo-random number generation (mulberry32).                */
/* Seed once per dataset so a page renders the same numbers every reload.     */
/* -------------------------------------------------------------------------- */

export function seededRandom(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A seeded generator that returns values on a gentle upward walk. */
export function trendWalk(
  seed: number,
  count: number,
  { start, drift, jitter }: { start: number; drift: number; jitter: number }
): number[] {
  const rand = seededRandom(seed);
  const out: number[] = [];
  let value = start;
  for (let i = 0; i < count; i++) {
    value = value * (1 + drift) + (rand() - 0.5) * jitter;
    out.push(Math.max(0, Math.round(value)));
  }
  return out;
}

/* -------------------------------------------------------------------------- */
/* Date helpers                                                               */
/* -------------------------------------------------------------------------- */

export const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/** First-of-month Dates for the trailing `count` months ending this month. */
export function trailingMonths(count: number, endYear = 2025): Date[] {
  const out: Date[] = [];
  for (let i = count - 1; i >= 0; i--) {
    out.push(new Date(endYear, 11 - i, 1));
  }
  return out;
}
