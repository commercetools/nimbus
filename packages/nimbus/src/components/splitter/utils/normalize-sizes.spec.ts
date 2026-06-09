import { describe, it, expect } from "vitest";
import { normalizeSizes } from "./normalize-sizes";

describe("normalizeSizes", () => {
  it("returns null when there are not exactly two pane ids", () => {
    expect(normalizeSizes({ a: 50 }, ["a"])).toBeNull();
    expect(normalizeSizes({ a: 33, b: 33, c: 34 }, ["a", "b", "c"])).toBeNull();
  });

  it("passes through a record that already sums to 100", () => {
    expect(normalizeSizes({ nav: 25, main: 75 }, ["nav", "main"])).toEqual({
      nav: 25,
      main: 75,
    });
  });

  it("normalizes an arbitrary ratio to sum 100", () => {
    expect(normalizeSizes({ nav: 1, main: 3 }, ["nav", "main"])).toEqual({
      nav: 25,
      main: 75,
    });
  });

  it("preserves float precision (no rounding)", () => {
    expect(normalizeSizes({ a: 31.25, b: 68.75 }, ["a", "b"])).toEqual({
      a: 31.25,
      b: 68.75,
    });
  });

  it("returns null when an id is missing or non-finite", () => {
    expect(normalizeSizes({ a: 25 }, ["a", "b"])).toBeNull();
    expect(normalizeSizes({ a: 25, b: NaN }, ["a", "b"])).toBeNull();
    expect(normalizeSizes(undefined, ["a", "b"])).toBeNull();
  });

  it("returns null when the sum is not positive", () => {
    expect(normalizeSizes({ a: 0, b: 0 }, ["a", "b"])).toBeNull();
  });
});
