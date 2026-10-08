import { describe, it, expect } from "vitest";
import { getThresholdPalette } from "./get-threshold-palette";

const thresholds = [
  { from: 95, colorPalette: "critical" as const },
  { from: 80, colorPalette: "warning" as const },
];

describe("getThresholdPalette", () => {
  it("returns the fallback below all thresholds", () => {
    expect(getThresholdPalette(50, thresholds, "primary")).toBe("primary");
  });

  it("applies a threshold from its value on (inclusive)", () => {
    expect(getThresholdPalette(80, thresholds, "primary")).toBe("warning");
    expect(getThresholdPalette(94.9, thresholds, "primary")).toBe("warning");
  });

  it("uses the highest threshold the value reaches, in any array order", () => {
    expect(getThresholdPalette(95, thresholds, "primary")).toBe("critical");
    expect(getThresholdPalette(100, [...thresholds].reverse(), "primary")).toBe(
      "critical"
    );
  });

  it("returns the fallback without thresholds", () => {
    expect(getThresholdPalette(99, undefined, "positive")).toBe("positive");
    expect(getThresholdPalette(99, [], "positive")).toBe("positive");
  });
});
