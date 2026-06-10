import { describe, it, expect } from "vitest";
import { getContrastRatio, calculateContrastColor } from "./contrast.ts";

describe("getContrastRatio", () => {
  it("returns 21 for black on white", () => {
    const ratio = getContrastRatio("#000000", "#ffffff");
    expect(ratio).toBeCloseTo(21, 0);
  });

  it("returns 1 for same color", () => {
    const ratio = getContrastRatio("#ff0000", "#ff0000");
    expect(ratio).toBeCloseTo(1, 1);
  });

  it("is symmetric (order does not matter)", () => {
    const ratio1 = getContrastRatio("#336699", "#ffffff");
    const ratio2 = getContrastRatio("#ffffff", "#336699");
    expect(ratio1).toBeCloseTo(ratio2, 5);
  });

  it("calculates correct ratio for a mid-tone color against white", () => {
    // #767676 is the lightest gray that passes WCAG AA (4.5:1) against white
    const ratio = getContrastRatio("#767676", "#ffffff");
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });
});

describe("calculateContrastColor", () => {
  it("returns white for dark colors", () => {
    expect(calculateContrastColor("#000000")).toBe("#ffffff");
    expect(calculateContrastColor("#1a1a2e")).toBe("#ffffff");
    expect(calculateContrastColor("#4E4ED8")).toBe("#ffffff");
  });

  it("returns black for light colors", () => {
    expect(calculateContrastColor("#ffffff")).toBe("#000000");
    expect(calculateContrastColor("#ffcc16")).toBe("#000000");
    expect(calculateContrastColor("#f0f0f0")).toBe("#000000");
  });

  it("chooses the color with higher contrast ratio", () => {
    const color = "#808080";
    const contrast = calculateContrastColor(color);
    const chosenRatio = getContrastRatio(color, contrast);
    const otherColor = contrast === "#ffffff" ? "#000000" : "#ffffff";
    const otherRatio = getContrastRatio(color, otherColor);
    expect(chosenRatio).toBeGreaterThanOrEqual(otherRatio);
  });
});
