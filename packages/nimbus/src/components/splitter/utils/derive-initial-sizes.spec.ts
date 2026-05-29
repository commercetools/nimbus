import { describe, it, expect } from "vitest";
import { deriveInitialSizes } from "./derive-initial-sizes";

describe("deriveInitialSizes", () => {
  it("returns an empty record when there are not exactly two panes", () => {
    expect(deriveInitialSizes([], undefined)).toEqual({});
    expect(deriveInitialSizes(["a"], { a: 100 })).toEqual({});
  });

  it("uses explicit defaultSizes when both ids are present", () => {
    const result = deriveInitialSizes(["a", "b"], { a: 30, b: 70 });
    expect(result).toEqual({ a: 30, b: 70 });
  });

  it("normalizes defaultSizes drift back to exactly 100", () => {
    const result = deriveInitialSizes(["a", "b"], { a: 30, b: 71 });
    expect(result.a + result.b).toBeCloseTo(100, 10);
    expect(result.a).toBeCloseTo((30 / 101) * 100, 10);
  });

  it("normalizes arbitrary sums (no tolerance gate) to 100", () => {
    // Sum 80 normalizes proportionally rather than falling back to 50/50.
    const result = deriveInitialSizes(["a", "b"], { a: 30, b: 50 });
    expect(result.a).toBeCloseTo(37.5, 10);
    expect(result.b).toBeCloseTo(62.5, 10);
  });

  it("preserves float precision when already summing to 100", () => {
    const result = deriveInitialSizes(["a", "b"], { a: 31.25, b: 68.75 });
    expect(result).toEqual({ a: 31.25, b: 68.75 });
  });

  it("falls back to an equal split when defaultSizes is missing an id", () => {
    expect(deriveInitialSizes(["a", "b"], { a: 30 })).toEqual({ a: 50, b: 50 });
  });

  it("falls back to an equal split when no defaultSizes is provided", () => {
    expect(deriveInitialSizes(["a", "b"], undefined)).toEqual({
      a: 50,
      b: 50,
    });
  });
});
