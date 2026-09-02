import { describe, it, expect } from "vitest";
import { lttb } from "./decimate";

const series = Array.from({ length: 1000 }, (_, i) => ({
  x: i,
  y: Math.sin(i / 20) * 100 + (i % 7),
}));

describe("lttb", () => {
  it("returns a copy unchanged when at or under threshold", () => {
    const small = series.slice(0, 10);
    expect(lttb(small, 50)).toEqual(small);
    expect(lttb(small, 50)).not.toBe(small); // copy
  });

  it("downsamples to exactly `threshold` points", () => {
    expect(lttb(series, 100)).toHaveLength(100);
    expect(lttb(series, 250)).toHaveLength(250);
  });

  it("preserves the first and last points", () => {
    const out = lttb(series, 100);
    expect(out[0]).toEqual(series[0]);
    expect(out[out.length - 1]).toEqual(series[series.length - 1]);
  });

  it("keeps x ascending (a true subset of the sorted input)", () => {
    const out = lttb(series, 120);
    for (let i = 1; i < out.length; i++) {
      expect(out[i].x).toBeGreaterThan(out[i - 1].x);
    }
  });
});
