import { describe, it, expect } from "vitest";
import { normalizeSize } from "./normalize-sizes";

describe("normalizeSize", () => {
  it("passes through a value already in range", () => {
    expect(normalizeSize(25)).toBe(25);
  });

  it("preserves float precision (no rounding)", () => {
    expect(normalizeSize(31.25)).toBe(31.25);
  });

  it("clamps a value above 100", () => {
    expect(normalizeSize(150)).toBe(100);
  });

  it("clamps a value below 0", () => {
    expect(normalizeSize(-10)).toBe(0);
  });

  it("returns null for non-finite or missing input", () => {
    expect(normalizeSize(NaN)).toBeNull();
    expect(normalizeSize(undefined)).toBeNull();
    expect(normalizeSize(null)).toBeNull();
  });
});
