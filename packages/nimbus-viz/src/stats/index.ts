import { bin, deviation, max, mean, min, quantile } from "d3-array";

/**
 * Shared statistical helpers. Charts and overlays that draw a computed quantity
 * (a trend line, a control limit, a KDE, a box) should derive it here rather
 * than hand-rolling the math or forcing callers to precompute it. Consolidates
 * the OLS in `overlays/trend-line`, the 3σ in `control-chart`, the d3 binning in
 * `histogram`, and the Gaussian KDE in `violin-plot`, and adds the previously
 * missing five-number summary so `box-plot` can accept raw samples.
 */

export interface Point {
  x: number;
  y: number;
}

export interface LinearFit {
  slope: number;
  intercept: number;
}

/** Ordinary-least-squares fit `y = slope·x + intercept` in data space. */
export function linearRegression(points: readonly Point[]): LinearFit {
  const n = points.length;
  if (n === 0) return { slope: 0, intercept: 0 };
  if (n === 1) return { slope: 0, intercept: points[0].y };
  let sx = 0;
  let sy = 0;
  let sxy = 0;
  let sxx = 0;
  for (const p of points) {
    sx += p.x;
    sy += p.y;
    sxy += p.x * p.y;
    sxx += p.x * p.x;
  }
  const denom = n * sxx - sx * sx;
  if (denom === 0) return { slope: 0, intercept: sy / n }; // vertical / degenerate
  const slope = (n * sxy - sx * sy) / denom;
  const intercept = (sy - slope * sx) / n;
  return { slope, intercept };
}

export interface RegressionBandPoint {
  x: number;
  /** Fitted mean response ŷ = slope·x + intercept. */
  y: number;
  low: number;
  high: number;
}

/**
 * OLS fit plus a pointwise confidence band for the mean response, sampled
 * uniformly across the x-extent. The half-width at x is
 * `mult · SE · √(1/n + (x−x̄)²/Sxx)`, where SE is the residual standard error
 * (√(SSE/(n−2))) — the textbook confidence interval for the regression line,
 * which correctly flares away from x̄. `confidence` selects the multiplier via a
 * z-approximation (0.90→1.645, 0.95→1.96, 0.99→2.576); adequate for a visual
 * band and exact as n grows. Needs n ≥ 3 and non-degenerate x; returns [] else.
 */
export function regressionBand(
  points: readonly Point[],
  opts: { confidence?: number; resolution?: number } = {}
): RegressionBandPoint[] {
  const n = points.length;
  if (n < 3) return [];
  const { confidence = 0.95, resolution = 32 } = opts;
  const { slope, intercept } = linearRegression(points);
  const xbar = points.reduce((s, p) => s + p.x, 0) / n;
  let sxx = 0;
  let sse = 0;
  let xMin = Infinity;
  let xMax = -Infinity;
  for (const p of points) {
    sxx += (p.x - xbar) * (p.x - xbar);
    const resid = p.y - (slope * p.x + intercept);
    sse += resid * resid;
    if (p.x < xMin) xMin = p.x;
    if (p.x > xMax) xMax = p.x;
  }
  if (sxx === 0) return []; // vertical / single-x — no band
  const se = Math.sqrt(sse / (n - 2));
  const mult = confidence >= 0.99 ? 2.576 : confidence >= 0.95 ? 1.96 : 1.645;
  const step = (xMax - xMin) / Math.max(1, resolution - 1);
  const out: RegressionBandPoint[] = [];
  for (let i = 0; i < resolution; i++) {
    const x = xMin + i * step;
    const y = slope * x + intercept;
    const half = mult * se * Math.sqrt(1 / n + ((x - xbar) * (x - xbar)) / sxx);
    out.push({ x, y, low: y - half, high: y + half });
  }
  return out;
}

export type ControlLimitMethod = "sd" | "movingRange";

export interface ControlLimits {
  center: number;
  upper: number;
  lower: number;
}

/**
 * SPC control limits for an individuals chart. `"sd"` uses the sample standard
 * deviation; `"movingRange"` uses the average moving range / 1.128 (the d2
 * constant for n=2), which is the correct estimator when the process may drift
 * — the global SD over-widens the band in that case.
 */
export function controlLimits(
  values: readonly number[],
  opts: { sigma?: number; method?: ControlLimitMethod } = {}
): ControlLimits {
  const { sigma = 3, method = "sd" } = opts;
  const center = mean(values) ?? 0;
  let sd: number;
  if (method === "movingRange") {
    const mrs: number[] = [];
    for (let i = 1; i < values.length; i++) {
      mrs.push(Math.abs(values[i] - values[i - 1]));
    }
    sd = (mean(mrs) ?? 0) / 1.128;
  } else {
    sd = deviation(values) ?? 0;
  }
  return { center, upper: center + sigma * sd, lower: center - sigma * sd };
}

/** d3-array binning as a thin, named wrapper. `thresholds` is a bin count. */
export function histogramBins(values: readonly number[], thresholds?: number) {
  const b = bin<number, number>();
  if (thresholds != null) b.thresholds(thresholds);
  return b(values as number[]);
}

/** Silverman's rule-of-thumb KDE bandwidth. */
export function silvermanBandwidth(samples: readonly number[]): number {
  const n = samples.length;
  if (n < 2) return 1;
  const sd = deviation(samples) ?? 0;
  return 0.9 * (sd || 1) * Math.pow(n, -0.2);
}

export interface KdePoint {
  x: number;
  density: number;
}

/** Gaussian kernel density estimate sampled across `domain` at `resolution` points. */
export function gaussianKde(
  samples: readonly number[],
  domain: [number, number],
  resolution = 64,
  bandwidth?: number
): KdePoint[] {
  if (samples.length === 0) return [];
  const h = bandwidth ?? silvermanBandwidth(samples);
  const [lo, hi] = domain;
  const step = (hi - lo) / Math.max(1, resolution - 1);
  const norm = 1 / (samples.length * h * Math.sqrt(2 * Math.PI));
  const out: KdePoint[] = [];
  for (let i = 0; i < resolution; i++) {
    const x = lo + i * step;
    let sum = 0;
    for (const s of samples) {
      const u = (x - s) / h;
      sum += Math.exp(-0.5 * u * u);
    }
    out.push({ x, density: norm * sum });
  }
  return out;
}

export interface FiveNumberSummary {
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  /** Points beyond the Tukey 1.5·IQR fences. */
  outliers: number[];
}

/**
 * Tukey five-number summary with 1.5·IQR outlier fences. `min`/`max` are the
 * whisker ends (the most extreme non-outliers), so `box-plot` can accept raw
 * samples instead of forcing callers to precompute quartiles.
 */
export function fiveNumberSummary(
  samples: readonly number[]
): FiveNumberSummary {
  const sorted = [...samples].sort((a, b) => a - b);
  const q1 = quantile(sorted, 0.25) ?? 0;
  const med = quantile(sorted, 0.5) ?? 0;
  const q3 = quantile(sorted, 0.75) ?? 0;
  const iqr = q3 - q1;
  const loFence = q1 - 1.5 * iqr;
  const hiFence = q3 + 1.5 * iqr;
  const inliers = sorted.filter((v) => v >= loFence && v <= hiFence);
  const outliers = sorted.filter((v) => v < loFence || v > hiFence);
  return {
    min: inliers.length ? inliers[0] : (min(sorted) ?? 0),
    q1,
    median: med,
    q3,
    max: inliers.length ? inliers[inliers.length - 1] : (max(sorted) ?? 0),
    outliers,
  };
}

// Re-export the primitives charts kept re-deriving, canonicalized on d3-array.
export { mean, median, deviation as stddev } from "d3-array";
