import { describe, it, expect } from "vitest";
import { deriveInitialSize } from "./derive-initial-sizes";

describe("deriveInitialSize", () => {
  it("uses an explicit defaultSize", () => {
    expect(deriveInitialSize(30)).toBe(30);
  });

  it("preserves float precision", () => {
    expect(deriveInitialSize(31.25)).toBe(31.25);
  });

  it("clamps an out-of-range defaultSize into 0–100", () => {
    expect(deriveInitialSize(150)).toBe(100);
    expect(deriveInitialSize(-10)).toBe(0);
  });

  it("falls back to 50 when defaultSize is omitted", () => {
    expect(deriveInitialSize(undefined)).toBe(50);
  });

  it("falls back to 50 when defaultSize is non-finite", () => {
    expect(deriveInitialSize(NaN)).toBe(50);
  });
});
