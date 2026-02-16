import { describe, it, expect } from "vitest";
import { loadTokenData } from "./token-data";
import { designTokens as tokens } from "@commercetools/nimbus-tokens";

describe("loadTokenData", () => {
  const data = loadTokenData();

  it("loads token data successfully", () => {
    expect(data).toBeDefined();
  });

  it("contains expected categories", () => {
    const categories = Object.keys(data!.categorySets);
    expect(categories).toContain("spacing");
    expect(categories).toContain("fontSizes");
    expect(categories).toContain("radii");
    expect(categories).toContain("blurs");
    expect(categories).toContain("colors");
    expect(categories).toContain("fontWeights");
    expect(categories).toContain("shadows");
    expect(categories).toContain("opacity");
    expect(categories).toContain("zIndex");
  });

  describe("spacing tokens", () => {
    it("maps token names to CSS values from source tokens", () => {
      const spacing = data!.categoryValues["spacing"];
      for (const [name, value] of Object.entries(tokens.spacing)) {
        if (typeof value === "string") {
          expect(spacing[name]).toBe(value);
        }
      }
    });

    it("includes negative tokens derived from source", () => {
      const spacing = data!.categoryValues["spacing"];
      for (const [name, value] of Object.entries(tokens.spacing)) {
        if (
          typeof value === "string" &&
          /^\d+$/.test(name) &&
          value.endsWith("px")
        ) {
          const px = parseFloat(value);
          expect(spacing[`-${name}`]).toBe(`-${px}px`);
        }
      }
    });

    it("has matching sets and values", () => {
      const set = data!.categorySets["spacing"];
      const values = data!.categoryValues["spacing"];
      expect(set.size).toBe(Object.keys(values).length);
      for (const name of set) {
        expect(values[name]).toBeDefined();
      }
    });
  });

  describe("fontSize tokens", () => {
    it("maps all source fontSize tokens", () => {
      const fontSizes = data!.categoryValues["fontSizes"];
      for (const [name, value] of Object.entries(tokens.fontSize)) {
        if (typeof value === "string") {
          expect(fontSizes[name]).toBe(value);
        }
      }
    });
  });

  describe("borderRadius tokens", () => {
    it("maps all source borderRadius tokens", () => {
      const radii = data!.categoryValues["radii"];
      for (const [name, value] of Object.entries(tokens.borderRadius)) {
        if (typeof value === "string") {
          expect(radii[name]).toBe(value);
        }
      }
    });
  });

  describe("color tokens", () => {
    it("includes flat colors from blacks-and-whites", () => {
      const colors = data!.categoryValues["colors"];
      const bw = tokens.color["blacks-and-whites"];
      expect(colors["black"]).toBe(bw.black);
      expect(colors["white"]).toBe(bw.white);
    });

    it("includes alpha colors with dot notation", () => {
      const colors = data!.categoryValues["colors"];
      const bw = tokens.color["blacks-and-whites"];
      for (const [name, value] of Object.entries(bw.blackAlpha)) {
        expect(colors[`blackAlpha.${name}`]).toBe(value);
      }
    });

    it("flattens palette colors using light values", () => {
      const colors = data!.categoryValues["colors"];
      const amber = tokens.color["system-palettes"].amber;
      for (const [name, value] of Object.entries(amber.light)) {
        expect(colors[`amber.${name}`]).toBe(value);
      }
    });

    it("includes semantic palette colors", () => {
      const colors = data!.categoryValues["colors"];
      const neutral = tokens.color["semantic-palettes"].neutral;
      for (const [name, value] of Object.entries(neutral.light)) {
        expect(colors[`neutral.${name}`]).toBe(value);
      }
    });
  });

  describe("fontWeight tokens", () => {
    it("maps all source fontWeight tokens", () => {
      const weights = data!.categoryValues["fontWeights"];
      for (const [name, value] of Object.entries(tokens.fontWeight)) {
        expect(weights[name]).toBe(String(value));
      }
    });
  });

  describe("opacity tokens", () => {
    it("maps all source opacity tokens", () => {
      const opacity = data!.categoryValues["opacity"];
      for (const [name, value] of Object.entries(tokens.opacity)) {
        expect(opacity[name]).toBe(String(value));
      }
    });
  });

  describe("zIndex tokens", () => {
    it("maps all source zIndex tokens", () => {
      const zIndex = data!.categoryValues["zIndex"];
      for (const [name, value] of Object.entries(tokens.zIndex)) {
        expect(zIndex[name]).toBe(String(value));
      }
    });
  });
});
