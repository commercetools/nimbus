import { describe, it, expect } from "vitest";
import { bin, deviation, extent, mean } from "d3-array";
import {
  controlLimits,
  fiveNumberSummary,
  gaussianKde,
  histogramBins,
  linearRegression,
  regressionBand,
  silvermanBandwidth,
  zForConfidence,
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

describe("zForConfidence", () => {
  it("maps the three common confidence levels to their z-approximation", () => {
    expect(zForConfidence(0.9)).toBeCloseTo(1.645, 10);
    expect(zForConfidence(0.95)).toBeCloseTo(1.96, 10);
    expect(zForConfidence(0.99)).toBeCloseTo(2.576, 10);
  });

  it("defaults to 0.95 and rounds up to the next known level", () => {
    expect(zForConfidence()).toBeCloseTo(1.96, 10);
    expect(zForConfidence(0.97)).toBeCloseTo(1.96, 10); // between .95 and .99
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

  // B-dedup: control-chart.tsx's own `center`/`ucl`/`lcl` props used to be
  // resolved with a formula hand-rolled in the component. Frozen here as
  // `oldControlChartLimits`, independent of the component (which now calls
  // `controlLimits` directly), so a future edit to either side is caught by
  // this test rather than silently drifting again.
  function oldControlChartLimits(
    values: number[],
    center?: number,
    ucl?: number,
    lcl?: number
  ) {
    const centerLine = center ?? mean(values) ?? 0;
    const sd = deviation(values) ?? 0;
    return {
      centerLine,
      upper: ucl ?? centerLine + 3 * sd,
      lower: lcl ?? centerLine - 3 * sd,
    };
  }
  const values = [10, 12, 9, 11, 13, 8, 14, 10, 12, 11];

  it("matches control-chart's old inline formula with no overrides", () => {
    const golden = oldControlChartLimits(values);
    const got = controlLimits(values);
    expect(got.center).toBeCloseTo(golden.centerLine, 10);
    expect(got.upper).toBeCloseTo(golden.upper, 10);
    expect(got.lower).toBeCloseTo(golden.lower, 10);
  });

  it("matches control-chart's old inline formula with a caller-supplied center only", () => {
    const golden = oldControlChartLimits(values, 11);
    const got = controlLimits(values, { center: 11 });
    expect(got.center).toBe(11);
    expect(got.upper).toBeCloseTo(golden.upper, 10);
    expect(got.lower).toBeCloseTo(golden.lower, 10);
  });

  it("matches control-chart's old inline formula with every override supplied", () => {
    const golden = oldControlChartLimits(values, 11, 20, 5);
    const got = controlLimits(values, { center: 11, upper: 20, lower: 5 });
    expect(got).toEqual({
      center: golden.centerLine,
      upper: golden.upper,
      lower: golden.lower,
    });
    expect(got).toEqual({ center: 11, upper: 20, lower: 5 });
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
    const bins = histogramBins(values, { thresholds: 10 });
    const total = bins.reduce((acc, b) => acc + b.length, 0);
    expect(total).toBe(100);
  });

  // B-dedup: histogram.tsx's inline call was `bin().domain(extent(values)).
  // thresholds(t)(values)` — passing an explicit domain, which suppresses
  // d3-array's own nice()-ing of the edges. `histogramBins` omitted `.domain()`
  // entirely, so its edges landed somewhere else. Golden-value proof that the
  // new `domain` option closes that gap exactly, plus the divergence itself
  // so a future edit can't silently drop the option again.
  it("with an explicit domain, matches d3-array's bin() called the same way histogram.tsx did", () => {
    const values = [1, 2, 2, 3, 5, 8, 13, 21, 34, 55, 89, 100];
    const domain = extent(values) as [number, number];
    const golden = bin<number, number>().domain(domain).thresholds(10)(values);
    const got = histogramBins(values, { thresholds: 10, domain });
    expect(got.map((b) => [b.x0, b.x1, b.length])).toEqual(
      golden.map((b) => [b.x0, b.x1, b.length])
    );
  });

  it("omitting the domain lets d3 nice() the edges -- a different result than the exact-domain call above", () => {
    const values = [1, 2, 2, 3, 5, 8, 13, 21, 34, 55, 89, 100];
    const domain = extent(values) as [number, number];
    const withDomain = histogramBins(values, { thresholds: 10, domain });
    const withoutDomain = histogramBins(values, { thresholds: 10 });
    expect(withoutDomain[0].x0).not.toBe(withDomain[0].x0);
  });

  // B-dedup: violin-plot.tsx's inline `density()` fell back to
  // `(hi - lo) / 12` for a degenerate (zero-spread) sample, not the module's
  // flat `1`. `silvermanBandwidth`'s `domain` option reproduces that exactly.
  it("falls back to the flat 1 with no domain (the pre-alignment default)", () => {
    expect(silvermanBandwidth([7, 7, 7])).toBe(1);
    expect(silvermanBandwidth([7])).toBe(1);
  });

  it("falls back to domain-span/12 for a degenerate sample when a domain is supplied, matching violin-plot's old inline fallback", () => {
    expect(silvermanBandwidth([7, 7, 7], { domain: [0, 24] })).toBeCloseTo(
      2,
      10
    ); // (24 - 0) / 12
    expect(silvermanBandwidth([7], { domain: [10, 22] })).toBeCloseTo(1, 10); // (22 - 10) / 12
  });

  it("ignores the domain fallback once the sample has real spread", () => {
    const samples = [1, 2, 3, 4, 5];
    const withDomain = silvermanBandwidth(samples, { domain: [0, 1000] });
    const withoutDomain = silvermanBandwidth(samples);
    expect(withDomain).toBeCloseTo(withoutDomain, 10);
    expect(withDomain).toBeGreaterThan(0);
  });

  // gaussianKde's own default bandwidth now threads its `domain` argument
  // into `silvermanBandwidth`, so a degenerate sample's peak density scales
  // with the axis it's drawn against instead of a hardcoded fallback --
  // golden-checked via the KDE peak formula (density at x = the repeated
  // sample value is exactly `1 / (h · √2π)`), solving back for h.
  it("threads its domain into the default bandwidth for degenerate samples", () => {
    const samples = [5, 5, 5];
    const narrow = gaussianKde(samples, [4, 6], 3); // span 2  -> h = 2/12
    const wide = gaussianKde(samples, [-10, 20], 3); // span 30 -> h = 30/12
    expect(narrow[1].x).toBe(5);
    expect(wide[1].x).toBe(5);
    const hNarrow = 1 / (narrow[1].density * Math.sqrt(2 * Math.PI));
    const hWide = 1 / (wide[1].density * Math.sqrt(2 * Math.PI));
    expect(hNarrow).toBeCloseTo(2 / 12, 10);
    expect(hWide).toBeCloseTo(30 / 12, 10);
  });
});
