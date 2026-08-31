import { describe, it, expect } from "vitest";
import { scaleLinear, scaleTime } from "@visx/scale";
import { nearestIndexByX } from "./nearest-x";

describe("nearestIndexByX", () => {
  it("returns -1 for empty data", () => {
    const s = scaleLinear({ domain: [0, 10], range: [0, 100] });
    expect(nearestIndexByX(50, s, [], (d: number) => d)).toBe(-1);
  });

  it("returns 0 for a single point", () => {
    const s = scaleLinear({ domain: [0, 10], range: [0, 100] });
    expect(nearestIndexByX(50, s, [5], (d: number) => d)).toBe(0);
  });

  it("finds the nearest index by value on a uniform scale", () => {
    const data = [0, 1, 2, 3, 4]; // x == value
    const s = scaleLinear({ domain: [0, 4], range: [0, 400] });
    expect(nearestIndexByX(0, s, data, (d) => d)).toBe(0);
    expect(nearestIndexByX(120, s, data, (d) => d)).toBe(1); // 1.2 → idx 1
    expect(nearestIndexByX(260, s, data, (d) => d)).toBe(3); // 2.6 → idx 3
    expect(nearestIndexByX(400, s, data, (d) => d)).toBe(4);
  });

  it("is correct for irregular spacing where proportional mapping fails", () => {
    // Values clustered then a big gap: [0, 1, 2, 100].
    const data = [0, 1, 2, 100];
    const s = scaleLinear({ domain: [0, 100], range: [0, 1000] });
    // px 30 → x=3 → nearest is x=2 (idx 2). The old proportional mapping,
    // round(30/1000 * 3), would give 0 — the wrong end of the data.
    expect(nearestIndexByX(30, s, data, (d) => d)).toBe(2);
    // px 900 → x=90 → nearest is x=100 (idx 3).
    expect(nearestIndexByX(900, s, data, (d) => d)).toBe(3);
  });

  it("works with Date x-values via a time scale", () => {
    const data = [
      new Date("2024-01-01"),
      new Date("2024-02-01"),
      new Date("2024-06-01"),
    ];
    const s = scaleTime({ domain: [data[0], data[2]], range: [0, 300] });
    // Jan 10 is closest to Jan 1 (idx 0); May 20 closest to Jun 1 (idx 2).
    expect(nearestIndexByX(s(new Date("2024-01-10")), s, data, (d) => d)).toBe(
      0
    );
    expect(nearestIndexByX(s(new Date("2024-05-20")), s, data, (d) => d)).toBe(
      2
    );
  });
});
