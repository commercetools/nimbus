import { describe, it, expect } from "vitest";
import { getMeterSegments } from "./get-meter-segments";

const widths = (result: ReturnType<typeof getMeterSegments>) =>
  result.items.map((item) => item.widthPercent);

describe("getMeterSegments", () => {
  it("returns widths proportional to the range", () => {
    const result = getMeterSegments([{ value: 30 }, { value: 20 }], 0, 100);
    expect(widths(result)).toEqual([30, 20]);
    expect(result.total).toBe(50);
  });

  it("respects a custom range", () => {
    const result = getMeterSegments([{ value: 25 }], 10, 60);
    expect(widths(result)).toEqual([50]);
    expect(result.total).toBe(25);
  });

  it("keeps the original segment fields", () => {
    const result = getMeterSegments([{ id: "a", value: 10 }], 0, 100);
    expect(result.items[0]).toMatchObject({ id: "a", value: 10 });
  });

  it("treats negative values as 0 and reports them", () => {
    const result = getMeterSegments([{ value: -10 }, { value: 20 }], 0, 100);
    expect(widths(result)).toEqual([0, 20]);
    expect(result.items[0].clampedValue).toBe(0);
    expect(result.total).toBe(20);
    expect(result.hasNegative).toBe(true);
  });

  it("treats non-finite values as 0", () => {
    const result = getMeterSegments([{ value: NaN }, { value: 10 }], 0, 100);
    expect(widths(result)).toEqual([0, 10]);
    expect(result.total).toBe(10);
  });

  it("cuts segments at the maximum and reports overflow", () => {
    const result = getMeterSegments(
      [{ value: 60 }, { value: 60 }, { value: 10 }],
      0,
      100
    );
    expect(widths(result)).toEqual([60, 40, 0]);
    expect(result.items.map((i) => i.clampedValue)).toEqual([60, 40, 0]);
    expect(result.total).toBe(100);
    expect(result.hasOverflow).toBe(true);
  });

  it("does not report overflow when the total equals the maximum", () => {
    const result = getMeterSegments([{ value: 50 }, { value: 50 }], 0, 100);
    expect(result.hasOverflow).toBe(false);
    expect(result.hasNegative).toBe(false);
  });

  it("returns 0% without dividing by zero when minValue equals maxValue", () => {
    const result = getMeterSegments([{ value: 10 }], 50, 50);
    expect(widths(result)).toEqual([0]);
    expect(result.total).toBe(0);
  });

  it("returns 0% when maxValue is below minValue", () => {
    const result = getMeterSegments([{ value: 10 }], 100, 0);
    expect(widths(result)).toEqual([0]);
    expect(result.total).toBe(0);
  });

  it("handles an empty array", () => {
    const result = getMeterSegments([], 0, 100);
    expect(result.items).toEqual([]);
    expect(result.total).toBe(0);
    expect(result.hasOverflow).toBe(false);
  });
});
