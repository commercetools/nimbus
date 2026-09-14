import { describe, it, expect } from "vitest";
import { scaleLinear } from "@visx/scale";
import { bandByIndex, makeValueScale, valueDomain } from "./scales";

describe("makeValueScale", () => {
  it("linear maps the domain across the range proportionally", () => {
    const s = makeValueScale("linear", {
      domain: [0, 100],
      range: [0, 200],
      nice: false,
    });
    expect(s(0)).toBe(0);
    expect(s(50)).toBe(100);
    expect(s(100)).toBe(200);
  });

  it("log spaces decades evenly and clamps a non-positive lower bound", () => {
    // domain [0, 1000] → lower bound clamped to 1 → 3 decades over 300px.
    const s = makeValueScale("log", {
      domain: [0, 1000],
      range: [0, 300],
      nice: false,
    });
    const a = s(1);
    const b = s(10);
    const c = s(100);
    const d = s(1000);
    for (const v of [a, b, c, d]) expect(Number.isFinite(v)).toBe(true);
    expect(a).toBeLessThan(b);
    expect(b).toBeLessThan(c);
    expect(c).toBeLessThan(d);
    // Decades are evenly spaced on a log axis.
    expect(Math.abs(b - a - (c - b))).toBeLessThan(1);
  });

  it("symlog tolerates zero and negative values", () => {
    const s = makeValueScale("symlog", {
      domain: [-100, 100],
      range: [0, 200],
    });
    for (const v of [s(-100), s(0), s(100)])
      expect(Number.isFinite(v)).toBe(true);
    expect(s(-100)).toBeLessThan(s(0));
    expect(s(0)).toBeLessThan(s(100));
  });
});

describe("valueDomain", () => {
  it("anchors positive data at zero by default", () => {
    expect(valueDomain([12, 40, 25])).toEqual([0, 40]);
  });

  it("reaches down to a negative minimum instead of extrapolating (BC-2)", () => {
    // The [0, max] domain this replaces would have drawn -15 outside the plot.
    expect(valueDomain([12, -15, 25])).toEqual([-15, 25]);
  });

  it("anchors all-negative data at zero from above", () => {
    expect(valueDomain([-5, -20])).toEqual([-20, 0]);
  });

  it("widens an all-equal positive input to reach zero (BC-3)", () => {
    expect(valueDomain([7, 7, 7])).toEqual([0, 7]);
  });

  it("widens an all-zero input to [0, 1] rather than a degenerate [0, 0]", () => {
    const domain = valueDomain([0, 0, 0]);
    expect(domain).toEqual([0, 1]);
    // A degenerate domain maps every input to the range midpoint; this one
    // maps 0 to the baseline, which is the honest picture for "all zero".
    const s = scaleLinear<number>({ domain, range: [200, 0] });
    expect(s(0)).toBe(200);
  });

  it("returns [0, 1] for empty input and ignores non-finite entries", () => {
    expect(valueDomain([])).toEqual([0, 1]);
    expect(valueDomain([null, undefined, NaN, Infinity])).toEqual([0, 1]);
    expect(valueDomain([null, 3, NaN, 9])).toEqual([0, 9]);
  });

  it("without includeZero uses the data extent and pads a degenerate one", () => {
    expect(valueDomain([10, 30], { includeZero: false })).toEqual([10, 30]);
    expect(valueDomain([8, 8], { includeZero: false })).toEqual([4, 12]);
    expect(valueDomain([-8, -8], { includeZero: false })).toEqual([-12, -4]);
  });

  it("mirrors around zero when symmetric", () => {
    expect(valueDomain([-3, 10], { symmetric: true })).toEqual([-10, 10]);
    expect(valueDomain([0, 0], { symmetric: true })).toEqual([-1, 1]);
  });

  it("includes extra reference values", () => {
    expect(valueDomain([10, 20], { include: [35] })).toEqual([0, 35]);
    expect(valueDomain([10, 20], { include: [-5] })).toEqual([-5, 20]);
  });
});

describe("bandByIndex", () => {
  it("gives two rows with the same label two distinct bands (BC-1)", () => {
    // scaleBand keyed by label text would dedupe "Q1" and draw both rows in
    // one band; index keying keeps them apart.
    const band = bandByIndex(["Q1", "Q1", "Q2"], {
      range: [0, 300],
      padding: 0,
    });
    expect(band.count).toBe(3);
    expect(band.bandwidth).toBe(100);
    expect(band.pos(0)).toBe(0);
    expect(band.pos(1)).toBe(100);
    expect(band.pos(2)).toBe(200);
    expect(band.center(1)).toBe(150);
  });

  it("exposes an index-keyed scale whose ticks format back to labels", () => {
    const labels = ["North", "South", "East"];
    const band = bandByIndex(labels, { range: [0, 90], padding: 0 });
    expect(band.scale.domain()).toEqual(["0", "1", "2"]);
    expect(band.scale.domain().map(band.tickFormat)).toEqual(labels);
    expect(band.scale("1")).toBe(30);
    expect(band.scale.bandwidth()).toBe(band.bandwidth);
  });

  it("applies padding like scaleBand and reports the step", () => {
    const band = bandByIndex(["a", "b"], { range: [0, 100], padding: 0.5 });
    // d3: step = range / (n - paddingInner + 2 * paddingOuter)
    //          = 100 / (2 - 0.5 + 1) = 40; bandwidth = step * (1 - paddingInner) = 20
    expect(band.step).toBe(40);
    expect(band.bandwidth).toBe(20);
  });

  it("returns 0 for an out-of-range index instead of undefined", () => {
    const band = bandByIndex(["a"], { range: [0, 10] });
    expect(band.pos(5)).toBe(0);
  });

  it("handles an empty label list", () => {
    const band = bandByIndex([], { range: [0, 10] });
    expect(band.count).toBe(0);
    expect(Number.isFinite(band.bandwidth)).toBe(true);
  });
});
