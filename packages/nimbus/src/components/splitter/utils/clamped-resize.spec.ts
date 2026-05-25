import { describe, it, expect } from "vitest";
import { clampedResize } from "./clamped-resize";

describe("clampedResize", () => {
  it("applies Δ to prev (grow) and next (shrink) when within bounds", () => {
    const result = clampedResize({
      sizes: { a: 30, b: 70 },
      handlePanes: { prev: "a", next: "b" },
      delta: 10,
      paneConfigs: { a: {}, b: {} },
    });
    expect(result).toEqual({ a: 40, b: 60 });
  });

  it("clamps Δ at neighbour minSize (no cascade)", () => {
    const result = clampedResize({
      sizes: { a: 30, b: 70 },
      handlePanes: { prev: "a", next: "b" },
      delta: 65, // would try to set b to 5
      paneConfigs: { a: { minSize: 10 }, b: { minSize: 10 } },
    });
    expect(result).toEqual({ a: 90, b: 10 });
  });

  it("clamps Δ at prev maxSize", () => {
    const result = clampedResize({
      sizes: { a: 60, b: 40 },
      handlePanes: { prev: "a", next: "b" },
      delta: 20,
      paneConfigs: { a: { maxSize: 70 }, b: {} },
    });
    expect(result).toEqual({ a: 70, b: 30 });
  });

  it("supports negative Δ (shrink prev, grow next)", () => {
    const result = clampedResize({
      sizes: { a: 50, b: 50 },
      handlePanes: { prev: "a", next: "b" },
      delta: -20,
      paneConfigs: { a: {}, b: {} },
    });
    expect(result).toEqual({ a: 30, b: 70 });
  });

  it("clamps negative Δ at prev minSize", () => {
    const result = clampedResize({
      sizes: { a: 30, b: 70 },
      handlePanes: { prev: "a", next: "b" },
      delta: -40,
      paneConfigs: { a: { minSize: 10 }, b: {} },
    });
    expect(result).toEqual({ a: 10, b: 90 });
  });

  it("preserves the sum of the two sizes", () => {
    const result = clampedResize({
      sizes: { a: 30, b: 70 },
      handlePanes: { prev: "a", next: "b" },
      delta: 123.456,
      paneConfigs: { a: { minSize: 5 }, b: { minSize: 5 } },
    });
    expect(result.a + result.b).toBeCloseTo(100, 10);
  });

  describe("commit-collapse path", () => {
    it("snaps the shrinking pane to collapsedSize when collapsible", () => {
      const result = clampedResize({
        sizes: { a: 30, b: 70 },
        handlePanes: { prev: "a", next: "b" },
        delta: -25, // would push a below minSize 10
        paneConfigs: {
          a: { minSize: 10, collapsible: true, collapsedSize: 0 },
          b: {},
        },
        options: { commitCollapse: true },
      });
      expect(result.a).toBe(0);
      expect(result.b).toBe(100);
    });

    it("does not snap when commitCollapse is false (regular drag)", () => {
      const result = clampedResize({
        sizes: { a: 30, b: 70 },
        handlePanes: { prev: "a", next: "b" },
        delta: -25,
        paneConfigs: {
          a: { minSize: 10, collapsible: true, collapsedSize: 0 },
          b: {},
        },
      });
      expect(result.a).toBe(10);
      expect(result.b).toBe(90);
    });

    it("does not snap when pane is not collapsible", () => {
      const result = clampedResize({
        sizes: { a: 30, b: 70 },
        handlePanes: { prev: "a", next: "b" },
        delta: -50,
        paneConfigs: { a: { minSize: 10 }, b: {} },
        options: { commitCollapse: true },
      });
      // Stops at minSize since pane is not collapsible.
      expect(result.a).toBe(10);
      expect(result.b).toBe(90);
    });

    it("snaps the next pane on positive Δ", () => {
      const result = clampedResize({
        sizes: { a: 30, b: 70 },
        handlePanes: { prev: "a", next: "b" },
        delta: 65, // would push b below minSize 10
        paneConfigs: {
          a: {},
          b: { minSize: 10, collapsible: true, collapsedSize: 0 },
        },
        options: { commitCollapse: true },
      });
      expect(result.b).toBe(0);
      expect(result.a).toBe(100);
    });
  });
});
