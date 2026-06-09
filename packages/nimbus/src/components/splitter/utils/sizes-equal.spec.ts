import { describe, it, expect } from "vitest";
import { sizesEqual } from "./sizes-equal";

describe("sizesEqual", () => {
  it("treats the same reference as equal", () => {
    const r = { a: 30, b: 70 };
    expect(sizesEqual(r, r)).toBe(true);
  });

  it("is order-independent on keys", () => {
    expect(sizesEqual({ a: 30, b: 70 }, { b: 70, a: 30 })).toBe(true);
  });

  it("treats values within epsilon as equal (float drift)", () => {
    expect(sizesEqual({ a: 30, b: 70 }, { a: 30 + 1e-9, b: 70 - 1e-9 })).toBe(
      true
    );
  });

  it("treats a meaningful difference as not equal", () => {
    expect(sizesEqual({ a: 30, b: 70 }, { a: 31, b: 69 })).toBe(false);
  });

  it("returns false when one side is nullish", () => {
    expect(sizesEqual(null, { a: 50, b: 50 })).toBe(false);
    expect(sizesEqual({ a: 50, b: 50 }, undefined)).toBe(false);
  });

  it("returns false when key sets differ", () => {
    expect(sizesEqual({ a: 50, b: 50 }, { a: 50, c: 50 })).toBe(false);
    expect(sizesEqual({ a: 100 }, { a: 50, b: 50 })).toBe(false);
  });
});
