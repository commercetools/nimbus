import { describe, it, expect } from "vitest";
import { clampToRange } from "./clamp-to-range";

describe("clampToRange", () => {
  it("returns a value inside the range unchanged", () => {
    expect(clampToRange(40, 0, 100)).toBe(40);
    expect(clampToRange(35, 10, 60)).toBe(35);
  });

  it("does not add rounding errors to a value inside the range", () => {
    expect(clampToRange(0.1, 0, 1)).toBe(0.1);
    expect(clampToRange(0.3, 0.1, 0.7)).toBe(0.3);
  });

  it("limits a value above the maximum and below the minimum", () => {
    expect(clampToRange(150, 0, 100)).toBe(100);
    expect(clampToRange(-10, 0, 100)).toBe(0);
  });

  it("maps +Infinity to the maximum and -Infinity to the minimum", () => {
    expect(clampToRange(Infinity, 0, 100)).toBe(100);
    expect(clampToRange(-Infinity, 0, 100)).toBe(0);
  });

  it("maps NaN to the minimum", () => {
    expect(clampToRange(NaN, 10, 60)).toBe(10);
  });

  it("returns the minimum for an empty or inverted range", () => {
    expect(clampToRange(50, 50, 50)).toBe(50);
    expect(clampToRange(10, 100, 0)).toBe(100);
  });
});
