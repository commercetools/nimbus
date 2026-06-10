import { describe, it, expect } from "vitest";
import {
  bandValueAt,
  clampPercent,
  isPercentValue,
  isThresholdMap,
  percentToPx,
  resolveDimension,
  selectBand,
  toBands,
  valueToPercent,
  type SizeBand,
} from "./responsive-size";

describe("isPercentValue", () => {
  it("recognizes percent strings", () => {
    expect(isPercentValue("30%")).toBe(true);
    expect(isPercentValue("12.5%")).toBe(true);
  });
  it("rejects non-percent values", () => {
    expect(isPercentValue(320)).toBe(false);
    expect(isPercentValue("md")).toBe(false);
    expect(isPercentValue("320px")).toBe(false);
  });
});

describe("valueToPercent", () => {
  it("treats a bare number as pixels", () => {
    expect(valueToPercent(320, 1000)).toBe(32);
    expect(valueToPercent(500, 1000)).toBe(50);
  });
  it("passes a percent string through without measurement", () => {
    expect(valueToPercent("30%", null)).toBe(30);
    expect(valueToPercent("12.5%", 1000)).toBe(12.5);
  });
  it("resolves a size token to pixels then to a percentage", () => {
    // md = 448px
    expect(valueToPercent("md", 896)).toBe(50);
    // breakpoint-sm = 480px
    expect(valueToPercent("breakpoint-sm", 480)).toBe(100);
  });
  it("returns null for pixels/tokens without a usable measurement", () => {
    expect(valueToPercent(320, null)).toBeNull();
    expect(valueToPercent(320, 0)).toBeNull();
    expect(valueToPercent("md", null)).toBeNull();
    expect(valueToPercent(320, -10)).toBeNull();
  });
});

describe("clampPercent", () => {
  it("clamps into [0,100] by default", () => {
    expect(clampPercent(150)).toBe(100);
    expect(clampPercent(-5)).toBe(0);
    expect(clampPercent(42)).toBe(42);
  });
  it("clamps into an explicit window", () => {
    expect(clampPercent(8, 15, 60)).toBe(15);
    expect(clampPercent(80, 15, 60)).toBe(60);
  });
});

describe("percentToPx", () => {
  it("inverts a percentage against the container", () => {
    expect(percentToPx(32, 1000)).toBe(320);
  });
});

describe("isThresholdMap", () => {
  it("distinguishes maps from single values", () => {
    expect(isThresholdMap({ 0: 320 })).toBe(true);
    expect(isThresholdMap(320)).toBe(false);
    expect(isThresholdMap("30%")).toBe(false);
    expect(isThresholdMap("md")).toBe(false);
  });
});

describe("toBands", () => {
  it("wraps a single value as one band at threshold 0", () => {
    expect(toBands(320)).toEqual([{ thresholdPx: 0, value: 320 }]);
  });
  it("resolves numeric and token threshold keys, sorted ascending", () => {
    const bands = toBands({ 768: "30%", 0: 320, "breakpoint-lg": 400 });
    expect(bands).toEqual([
      { thresholdPx: 0, value: 320 },
      { thresholdPx: 768, value: "30%" },
      { thresholdPx: 1024, value: 400 }, // breakpoint-lg
    ]);
  });
});

describe("bandValueAt", () => {
  it("looks up the configured value at a threshold", () => {
    const config = { 0: 320, 768: "30%" } as const;
    expect(bandValueAt(config, 0)).toBe(320);
    expect(bandValueAt(config, 768)).toBe("30%");
    expect(bandValueAt(config, 999)).toBeUndefined();
  });
});

describe("selectBand", () => {
  const bands: SizeBand[] = [
    { thresholdPx: 0, value: 320 },
    { thresholdPx: 768, value: "30%" },
    { thresholdPx: 1024, value: 400 },
  ];

  it("picks the largest threshold <= measured", () => {
    expect(selectBand(bands, 500)?.thresholdPx).toBe(0);
    expect(selectBand(bands, 800)?.thresholdPx).toBe(768);
    expect(selectBand(bands, 1200)?.thresholdPx).toBe(1024);
  });

  it("applies the smallest band below its threshold", () => {
    const noBase: SizeBand[] = [
      { thresholdPx: 768, value: "30%" },
      { thresholdPx: 1024, value: 400 },
    ];
    expect(selectBand(noBase, 500)?.thresholdPx).toBe(768);
  });

  it("holds the active band within the hysteresis deadband", () => {
    // Active = 0; just past 768 stays on 0 within the deadband, switches beyond.
    expect(
      selectBand(bands, 769, { activeThresholdPx: 0, deadbandPx: 2 })
        ?.thresholdPx
    ).toBe(0);
    expect(
      selectBand(bands, 771, { activeThresholdPx: 0, deadbandPx: 2 })
        ?.thresholdPx
    ).toBe(768);
  });
});

describe("resolveDimension", () => {
  it("resolves a single percent value synchronously (no measurement)", () => {
    expect(resolveDimension("30%", null)).toEqual({
      percent: 30,
      thresholdPx: 0,
    });
  });

  it("requires measurement for a single pixel value", () => {
    expect(resolveDimension(320, null)).toEqual({
      percent: null,
      thresholdPx: 0,
    });
    expect(resolveDimension(320, 1000)).toEqual({
      percent: 32,
      thresholdPx: 0,
    });
  });

  it("requires measurement to select a band in a multi-entry map", () => {
    const config = { 0: 320, 768: "30%" } as const;
    expect(resolveDimension(config, null).percent).toBeNull();
    expect(resolveDimension(config, 1000)).toEqual({
      percent: 30,
      thresholdPx: 768,
    });
  });

  it("lets a stored value override the config default", () => {
    expect(
      resolveDimension(320, 1000, {
        stored: { 0: { unit: "px", value: 300 } },
      })
    ).toEqual({ percent: 30, thresholdPx: 0 });
    expect(
      resolveDimension(320, 1000, {
        stored: { 0: { unit: "pct", value: 25 } },
      })
    ).toEqual({ percent: 25, thresholdPx: 0 });
  });

  it("re-pins a stored pixel value against a new container size", () => {
    // 300px stored from a 1000px session, restored into an 800px container.
    expect(
      resolveDimension(320, 800, {
        stored: { 0: { unit: "px", value: 300 } },
      }).percent
    ).toBeCloseTo(37.5);
  });

  it("falls back to the config default when a stored px lacks measurement", () => {
    expect(
      resolveDimension(320, null, {
        stored: { 0: { unit: "px", value: 300 } },
      }).percent
    ).toBeNull();
  });
});
