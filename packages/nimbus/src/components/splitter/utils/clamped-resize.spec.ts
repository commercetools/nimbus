import { describe, it, expect } from "vitest";
import { clampedResize } from "./clamped-resize";

describe("clampedResize", () => {
  it("applies a positive Δ to the aside size when within bounds", () => {
    expect(
      clampedResize({ size: 30, delta: 10, minSize: 0, maxSize: 100 })
    ).toBe(40);
  });

  it("applies a negative Δ to the aside size when within bounds", () => {
    expect(
      clampedResize({ size: 50, delta: -20, minSize: 0, maxSize: 100 })
    ).toBe(30);
  });

  it("clamps at the aside minSize", () => {
    expect(
      clampedResize({ size: 30, delta: -40, minSize: 10, maxSize: 100 })
    ).toBe(10);
  });

  it("clamps at the aside maxSize (which bounds the main pane's floor)", () => {
    // maxSize 70 → main never below 30.
    expect(
      clampedResize({ size: 60, delta: 20, minSize: 0, maxSize: 70 })
    ).toBe(70);
  });

  it("preserves full float precision (no rounding)", () => {
    expect(
      clampedResize({ size: 31.25, delta: 1.125, minSize: 0, maxSize: 100 })
    ).toBe(32.375);
  });
});
