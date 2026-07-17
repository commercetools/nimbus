import { describe, it, expect } from "vitest";
import { validatePalette } from "./validate-palette";
import { generateColorScale } from "./generate-color-scale";
import type { ColorPaletteWithModes } from "./types";

describe("validatePalette", () => {
  it("returns valid for a well-generated palette", () => {
    const palette = generateColorScale("#4E4ED8");
    const result = validatePalette(palette);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("warns when contrast color does not meet 4.5:1 against step 9", () => {
    const palette: ColorPaletteWithModes = {
      light: {
        "1": "#ffffff",
        "2": "#f8f8f8",
        "3": "#f0f0f0",
        "4": "#e8e8e8",
        "5": "#e0e0e0",
        "6": "#d0d0d0",
        "7": "#c0c0c0",
        "8": "#a0a0a0",
        "9": "#808080", // mid gray
        "10": "#707070",
        "11": "#505050",
        "12": "#303030",
        DEFAULT: "#808080",
        contrast: "#909090", // bad contrast against #808080
      },
      dark: {
        "1": "#111111",
        "2": "#1a1a1a",
        "3": "#222222",
        "4": "#2a2a2a",
        "5": "#333333",
        "6": "#3d3d3d",
        "7": "#4a4a4a",
        "8": "#5a5a5a",
        "9": "#808080",
        "10": "#909090",
        "11": "#b0b0b0",
        "12": "#d0d0d0",
        DEFAULT: "#808080",
        contrast: "#909090",
      },
    };
    const result = validatePalette(palette);
    expect(result.warnings.length).toBeGreaterThan(0);
    expect(result.warnings.some((w) => w.message.includes("contrast"))).toBe(
      true
    );
  });

  it("warns when step 11 does not meet 4.5:1 against step 1 in light mode", () => {
    const palette: ColorPaletteWithModes = {
      light: {
        "1": "#ffffff",
        "2": "#f8f8f8",
        "3": "#f0f0f0",
        "4": "#e8e8e8",
        "5": "#e0e0e0",
        "6": "#d0d0d0",
        "7": "#c0c0c0",
        "8": "#a0a0a0",
        "9": "#808080",
        "10": "#707070",
        "11": "#aaaaaa", // too light for text against white
        "12": "#303030",
        DEFAULT: "#808080",
        contrast: "#ffffff",
      },
      dark: {
        "1": "#111111",
        "2": "#1a1a1a",
        "3": "#222222",
        "4": "#2a2a2a",
        "5": "#333333",
        "6": "#3d3d3d",
        "7": "#4a4a4a",
        "8": "#5a5a5a",
        "9": "#808080",
        "10": "#909090",
        "11": "#b0b0b0",
        "12": "#d0d0d0",
        DEFAULT: "#808080",
        contrast: "#000000",
      },
    };
    const result = validatePalette(palette);
    expect(result.warnings.some((w) => w.step === "11")).toBe(true);
  });

  it("reports no warnings for generated palettes across various colors", () => {
    const colors = ["#E63946", "#2A9D8F", "#264653"];
    for (const color of colors) {
      const palette = generateColorScale(color);
      const result = validatePalette(palette);
      expect(result.valid).toBe(true);
    }
  });
});
