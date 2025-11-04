import { describe, it, expect } from "vitest";
import {
  ALL_COLOR_PALETTES,
  BRAND_COLOR_PALETTES,
  SEMANTIC_COLOR_PALETTES,
  SYSTEM_COLOR_PALETTES,
} from "./color-palettes";
describe("Color Palette Constants", () => {
  it("should have no duplicate palettes across groups", () => {
    const allPalettes = [
      ...SEMANTIC_COLOR_PALETTES,
      ...BRAND_COLOR_PALETTES,
      ...SYSTEM_COLOR_PALETTES,
    ];
    const uniquePalettes = new Set(allPalettes);
    expect(allPalettes.length).toBe(uniquePalettes.size);
  });

  it("should match ALL_PALETTES array", () => {
    expect(ALL_COLOR_PALETTES.length).toBe(
      SEMANTIC_COLOR_PALETTES.length +
        BRAND_COLOR_PALETTES.length +
        SYSTEM_COLOR_PALETTES.length
    );
  });
});
