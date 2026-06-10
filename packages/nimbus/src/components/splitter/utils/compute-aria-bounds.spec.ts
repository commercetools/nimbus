import { describe, it, expect } from "vitest";
import { computeAriaBounds } from "./compute-aria-bounds";
import type { ResolvedAsideConfig } from "../splitter.types";

const cfg = (over: Partial<ResolvedAsideConfig> = {}): ResolvedAsideConfig => ({
  minSize: 0,
  maxSize: 100,
  collapsible: false,
  collapsedSize: 0,
  ...over,
});

describe("computeAriaBounds", () => {
  it("defaults to the full 0–100 range when the aside leads", () => {
    expect(computeAriaBounds(cfg(), true)).toEqual({ min: 0, max: 100 });
  });

  it("maps the aside's [minSize, maxSize] window when the aside leads", () => {
    expect(computeAriaBounds(cfg({ minSize: 10, maxSize: 80 }), true)).toEqual({
      min: 10,
      max: 80,
    });
  });

  it("complements the window when the main pane leads (aside trailing)", () => {
    // aside ∈ [10, 80] → leading main ∈ [20, 90].
    expect(computeAriaBounds(cfg({ minSize: 10, maxSize: 80 }), false)).toEqual(
      {
        min: 20,
        max: 90,
      }
    );
  });

  it("lets a collapsible aside reach its collapsedSize below minSize", () => {
    expect(
      computeAriaBounds(
        cfg({ minSize: 15, maxSize: 100, collapsible: true, collapsedSize: 0 }),
        true
      )
    ).toEqual({ min: 0, max: 100 });
  });

  it("keeps minSize as the floor when collapsedSize is the larger value", () => {
    expect(
      computeAriaBounds(
        cfg({ minSize: 5, collapsible: true, collapsedSize: 12 }),
        true
      )
    ).toEqual({ min: 5, max: 100 });
  });

  it("preserves float precision (no rounding)", () => {
    expect(
      computeAriaBounds(cfg({ minSize: 12.5, maxSize: 92.75 }), true)
    ).toEqual({ min: 12.5, max: 92.75 });
  });
});
