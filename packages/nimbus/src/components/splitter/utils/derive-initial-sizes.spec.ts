import { describe, it, expect } from "vitest";
import { deriveInitialSizes } from "./derive-initial-sizes";

describe("deriveInitialSizes", () => {
  it("returns an empty record when there are no panes", () => {
    expect(deriveInitialSizes([], undefined, undefined)).toEqual({});
  });

  it("uses explicit defaultSizes when both ids are present", () => {
    const result = deriveInitialSizes(["a", "b"], { a: 30, b: 70 }, undefined);
    expect(result).toEqual({ a: 30, b: 70 });
  });

  it("normalizes defaultSizes drift back to exactly 100", () => {
    const result = deriveInitialSizes(["a", "b"], { a: 30, b: 71 }, undefined);
    expect(result.a + result.b).toBeCloseTo(100, 10);
    expect(result.a).toBeCloseTo((30 / 101) * 100, 10);
  });

  it("ignores defaultSizes when an id is missing and falls back", () => {
    const result = deriveInitialSizes(
      ["a", "b"],
      { a: 30 },
      { a: { defaultSize: 25 }, b: { defaultSize: 75 } }
    );
    expect(result).toEqual({ a: 25, b: 75 });
  });

  it("ignores defaultSizes when drift exceeds the 5-point threshold", () => {
    // Sum 80 is >5 away from 100 → not treated as valid, falls through to 50/50.
    const result = deriveInitialSizes(["a", "b"], { a: 30, b: 50 }, undefined);
    expect(result).toEqual({ a: 50, b: 50 });
  });

  it("derives from per-pane defaultSize, normalized to 100", () => {
    const result = deriveInitialSizes(["a", "b"], undefined, {
      a: { defaultSize: 1 },
      b: { defaultSize: 3 },
    });
    expect(result).toEqual({ a: 25, b: 75 });
  });

  it("falls back to an equal split when no defaults are provided", () => {
    expect(deriveInitialSizes(["a", "b"], undefined, undefined)).toEqual({
      a: 50,
      b: 50,
    });
  });

  it("falls back to an equal split when only one pane has a defaultSize", () => {
    const result = deriveInitialSizes(["a", "b"], undefined, {
      a: { defaultSize: 40 },
    });
    expect(result).toEqual({ a: 50, b: 50 });
  });
});
