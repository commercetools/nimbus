import { describe, it, expect } from "vitest";
import { computeAriaBounds } from "./compute-aria-bounds";

describe("computeAriaBounds", () => {
  it("defaults missing minSize to 0 (full 0–100 range)", () => {
    expect(computeAriaBounds({}, {})).toEqual({ min: 0, max: 100 });
  });

  it("floors at each pane's minSize and complements the max", () => {
    expect(computeAriaBounds({ minSize: 10 }, { minSize: 20 })).toEqual({
      min: 10,
      max: 80,
    });
  });

  it("lets a collapsible pane reach its collapsedSize below minSize", () => {
    // prev collapses to 0 (below its 15% minSize) → min floors at 0, not 15.
    expect(
      computeAriaBounds(
        { minSize: 15, collapsible: true, collapsedSize: 0 },
        { minSize: 20 }
      )
    ).toEqual({ min: 0, max: 80 });
  });

  it("keeps minSize as the floor when collapsedSize is the larger value", () => {
    expect(
      computeAriaBounds(
        { minSize: 5, collapsible: true, collapsedSize: 12 },
        {}
      )
    ).toEqual({ min: 5, max: 100 });
  });

  it("makes the next pane's collapse floor widen the max bound", () => {
    expect(
      computeAriaBounds(
        { minSize: 10 },
        { minSize: 25, collapsible: true, collapsedSize: 0 }
      )
    ).toEqual({ min: 10, max: 100 });
  });

  it("preserves float precision (no rounding)", () => {
    expect(computeAriaBounds({ minSize: 12.5 }, { minSize: 7.25 })).toEqual({
      min: 12.5,
      max: 92.75,
    });
  });
});
