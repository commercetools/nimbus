import { describe, it, expect } from "vitest";
import { clampedResize } from "./clamped-resize";

describe("clampedResize", () => {
  it("applies Δ to prev (grow) and next (shrink) when within bounds", () => {
    const result = clampedResize({
      sizes: { a: 30, b: 70 },
      handlePanes: { prev: "a", next: "b" },
      delta: 10,
      paneConfigs: { a: {}, b: {} },
    });
    expect(result).toEqual({ a: 40, b: 60 });
  });

  it("clamps Δ at neighbour minSize (no cascade)", () => {
    const result = clampedResize({
      sizes: { a: 30, b: 70 },
      handlePanes: { prev: "a", next: "b" },
      delta: 65, // would try to set b to 5
      paneConfigs: { a: { minSize: 10 }, b: { minSize: 10 } },
    });
    expect(result).toEqual({ a: 90, b: 10 });
  });

  it("clamps Δ at prev upper bound derived from next minSize", () => {
    // prev has no maxSize knob; its upper bound is 100 − next.minSize = 70.
    const result = clampedResize({
      sizes: { a: 60, b: 40 },
      handlePanes: { prev: "a", next: "b" },
      delta: 20,
      paneConfigs: { a: {}, b: { minSize: 30 } },
    });
    expect(result).toEqual({ a: 70, b: 30 });
  });

  it("supports negative Δ (shrink prev, grow next)", () => {
    const result = clampedResize({
      sizes: { a: 50, b: 50 },
      handlePanes: { prev: "a", next: "b" },
      delta: -20,
      paneConfigs: { a: {}, b: {} },
    });
    expect(result).toEqual({ a: 30, b: 70 });
  });

  it("clamps negative Δ at prev minSize", () => {
    const result = clampedResize({
      sizes: { a: 30, b: 70 },
      handlePanes: { prev: "a", next: "b" },
      delta: -40,
      paneConfigs: { a: { minSize: 10 }, b: {} },
    });
    expect(result).toEqual({ a: 10, b: 90 });
  });

  it("preserves the sum of the two sizes", () => {
    const result = clampedResize({
      sizes: { a: 30, b: 70 },
      handlePanes: { prev: "a", next: "b" },
      delta: 123.456,
      paneConfigs: { a: { minSize: 5 }, b: { minSize: 5 } },
    });
    expect(result.a + result.b).toBeCloseTo(100, 10);
  });

  it("preserves full float precision (no rounding)", () => {
    const result = clampedResize({
      sizes: { a: 31.25, b: 68.75 },
      handlePanes: { prev: "a", next: "b" },
      delta: 1.125,
      paneConfigs: { a: {}, b: {} },
    });
    expect(result.a).toBe(32.375);
    expect(result.b).toBe(67.625);
  });
});
