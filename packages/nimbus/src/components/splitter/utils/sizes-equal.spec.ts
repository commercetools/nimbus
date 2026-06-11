import { describe, it, expect } from "vitest";
import { sizeEqual } from "./sizes-equal";

describe("sizeEqual", () => {
  it("treats equal numbers as equal", () => {
    expect(sizeEqual(30, 30)).toBe(true);
  });

  it("treats values within epsilon as equal (float drift)", () => {
    expect(sizeEqual(30, 30 + 1e-9)).toBe(true);
  });

  it("treats a meaningful difference as not equal", () => {
    expect(sizeEqual(30, 31)).toBe(false);
  });

  it("returns false when one side is nullish", () => {
    expect(sizeEqual(null, 50)).toBe(false);
    expect(sizeEqual(50, undefined)).toBe(false);
  });

  it("treats two nullish values as equal only by identity", () => {
    expect(sizeEqual(undefined, undefined)).toBe(true);
    expect(sizeEqual(null, undefined)).toBe(false);
  });
});
