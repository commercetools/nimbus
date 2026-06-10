import { describe, it, expect } from "vitest";
import { generateColorScale } from "./generate-color-scale.ts";
import { getContrastRatio } from "./contrast.ts";
import { parse, oklch } from "culori";

const STEPS = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
] as const;

function getLightness(hex: string): number {
  const color = oklch(parse(hex));
  return color?.l ?? 0;
}

describe("generateColorScale", () => {
  const baseColor = "#4E4ED8"; // ctviolet step 9

  it("returns light and dark palettes", () => {
    const result = generateColorScale(baseColor);
    expect(result).toHaveProperty("light");
    expect(result).toHaveProperty("dark");
  });

  it("each palette has 12 steps plus DEFAULT and contrast", () => {
    const result = generateColorScale(baseColor);
    for (const mode of ["light", "dark"] as const) {
      for (const step of STEPS) {
        expect(result[mode]).toHaveProperty(step);
        expect(typeof result[mode][step]).toBe("string");
      }
      expect(result[mode]).toHaveProperty("DEFAULT");
      expect(result[mode]).toHaveProperty("contrast");
    }
  });

  it("all color values are valid hex strings", () => {
    const result = generateColorScale(baseColor);
    const hexRegex = /^#[0-9a-f]{6}$/i;
    for (const mode of ["light", "dark"] as const) {
      for (const step of STEPS) {
        expect(result[mode][step]).toMatch(hexRegex);
      }
      expect(result[mode].DEFAULT).toMatch(hexRegex);
      expect(result[mode].contrast).toMatch(hexRegex);
    }
  });

  it("DEFAULT equals step 9", () => {
    const result = generateColorScale(baseColor);
    expect(result.light.DEFAULT).toBe(result.light["9"]);
    expect(result.dark.DEFAULT).toBe(result.dark["9"]);
  });

  it("light mode step 9 preserves the hue of the base color", () => {
    const result = generateColorScale(baseColor);
    const baseHue = oklch(parse(baseColor))?.h ?? 0;
    const step9Hue = oklch(parse(result.light["9"]))?.h ?? 0;
    expect(Math.abs(step9Hue - baseHue)).toBeLessThan(5);
  });

  it("light scale has decreasing lightness from step 1 to step 12", () => {
    const result = generateColorScale(baseColor);
    const lightnesses = STEPS.map((s) => getLightness(result.light[s]));
    for (let i = 1; i < lightnesses.length; i++) {
      expect(lightnesses[i]).toBeLessThanOrEqual(lightnesses[i - 1] + 0.01);
    }
  });

  it("dark scale has increasing lightness from step 1 to step 12", () => {
    const result = generateColorScale(baseColor);
    const lightnesses = STEPS.map((s) => getLightness(result.dark[s]));
    for (let i = 1; i < lightnesses.length; i++) {
      expect(lightnesses[i]).toBeGreaterThanOrEqual(lightnesses[i - 1] - 0.01);
    }
  });

  it("contrast color meets WCAG AA (4.5:1) against step 9", () => {
    const result = generateColorScale(baseColor);
    for (const mode of ["light", "dark"] as const) {
      const ratio = getContrastRatio(result[mode]["9"], result[mode].contrast);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("step 11 meets WCAG AA (4.5:1) against steps 1-2 in light mode", () => {
    const result = generateColorScale(baseColor);
    const ratio = getContrastRatio(result.light["11"], result.light["1"]);
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  it("works with various base colors", () => {
    const colors = ["#E63946", "#2A9D8F", "#E9C46A", "#264653", "#F4A261"];
    for (const color of colors) {
      const result = generateColorScale(color);
      expect(Object.keys(result.light)).toHaveLength(14); // 12 + DEFAULT + contrast
      expect(Object.keys(result.dark)).toHaveLength(14);
    }
  });
});
