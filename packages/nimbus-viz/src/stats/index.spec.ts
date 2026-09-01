import { describe, it, expect } from "vitest";
import {
  controlLimits,
  fiveNumberSummary,
  gaussianKde,
  histogramBins,
  linearRegression,
  regressionBand,
  silvermanBandwidth,
} from "./index";

describe("linearRegression", () => {
  it("recovers an exact line y = 2x + 1", () => {
    const fit = linearRegression([
      { x: 0, y: 1 },
      { x: 1, y: 3 },
      { x: 2, y: 5 },
    ]);
    expect(fit.slope).toBeCloseTo(2, 10);
    expect(fit.intercept).toBeCloseTo(1, 10);
  });

  it("is degenerate-safe for 0/1 points", () => {
    expect(linearRegression([])).toEqual({ slope: 0, intercept: 0 });
    expect(linearRegression([{ x: 5, y: 9 }])).toEqual({
      slope: 0,
      intercept: 9,
    });
  });
});

describe("regressionBand", () => {
  it("centers on the OLS fit and flares away from x̄", () => {
    // y = 2x + 1 with symmetric noise so the fit is ~exact but SE > 0
    const pts = [
      { x: 0, y: 1.2 },
      { x: 1, y: 2.8 },
      { x: 2, y: 5.2 },
      { x: 3, y: 6.8 },
      { x: 4, y: 9.2 },
      { x: 5, y: 10.8 },
    ];
    const band = regressionBand(pts, { confidence: 0.95, resolution: 21 });
    expect(band.length).toBe(21);
    // band midline equals the fit
    const fit = linearRegression(pts);
    for (const p of band) {
      expect(p.y).toBeCloseTo(fit.slope * p.x + fit.intercept, 10);
      expect(p.low).toBeLessThan(p.y);
      expect(p.high).toBeGreaterThan(p.y);
    }
    // narrowest at the mean x, wider at the extremes
    const mid = band[Math.floor(band.length / 2)];
    const midWidth = mid.high - mid.low;
    const endWidth = band[0].high - band[0].low;
    expect(endWidth).toBeGreaterThan(midWidth);
  });

  it("needs n ≥ 3 and non-degenerate x", () => {
    expect(
      regressionBand([
        { x: 1, y: 1 },
        { x: 2, y: 2 },
      ])
    ).toEqual([]);
    expect(
      regressionBand([
        { x: 3, y: 1 },
        { x: 3, y: 2 },
        { x: 3, y: 3 },
      ])
    ).toEqual([]);
  });
});

describe("controlLimits", () => {
  it("centers on the mean and is symmetric", () => {
    const { center, upper, lower } = controlLimits([2, 4, 4, 4, 5, 5, 7, 9]);
    expect(center).toBeCloseTo(5, 10);
    expect(upper - center).toBeCloseTo(center - lower, 10);
    expect(upper).toBeGreaterThan(center);
  });

  it("collapses to the center when there is no variation", () => {
    expect(controlLimits([10, 10, 10])).toEqual({
      center: 10,
      upper: 10,
      lower: 10,
    });
  });

  it("movingRange gives a different (drift-robust) estimate", () => {
    const sd = controlLimits([1, 2, 3, 4, 5, 6], { method: "sd" });
    const mr = controlLimits([1, 2, 3, 4, 5, 6], { method: "movingRange" });
    expect(mr.center).toBeCloseTo(sd.center, 10);
    expect(mr.upper).not.toBeCloseTo(sd.upper, 5);
  });
});

describe("fiveNumberSummary", () => {
  it("orders the quartiles and flags Tukey outliers", () => {
    const s = fiveNumberSummary([1, 2, 3, 4, 5, 6, 7, 8, 9, 100]);
    expect(s.q1).toBeLessThan(s.median);
    expect(s.median).toBeLessThan(s.q3);
    expect(s.outliers).toContain(100);
    // 100 is an outlier, so the upper whisker stops at the largest inlier.
    expect(s.max).toBe(9);
  });
});

describe("gaussianKde", () => {
  it("integrates to ~1 over a domain that covers the mass", () => {
    const samples = [-1, 0, 1];
    const res = 200;
    const kde = gaussianKde(samples, [-5, 5], res);
    const step = 10 / (res - 1);
    const integral = kde.reduce((acc, p) => acc + p.density * step, 0);
    expect(integral).toBeCloseTo(1, 1); // within 0.05
  });

  it("returns empty for no samples", () => {
    expect(gaussianKde([], [0, 1])).toEqual([]);
  });
});

describe("silvermanBandwidth / histogramBins", () => {
  it("bandwidth is positive", () => {
    expect(silvermanBandwidth([1, 2, 3, 4, 5])).toBeGreaterThan(0);
  });

  it("bins partition all the values", () => {
    const values = Array.from({ length: 100 }, (_, i) => i);
    const bins = histogramBins(values, 10);
    const total = bins.reduce((acc, b) => acc + b.length, 0);
    expect(total).toBe(100);
  });
});
