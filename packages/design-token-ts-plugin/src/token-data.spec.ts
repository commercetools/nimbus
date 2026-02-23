import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { loadTokenData } from "./token-data";
import { designTokens as tokens } from "@commercetools/nimbus-tokens";

/** Load the generated mapping as the source of truth for generated categories */
const generatedMapping = JSON.parse(
  readFileSync(join(__dirname, "generated-token-mapping.json"), "utf-8")
) as {
  semanticColors: Record<string, string>;
  textStyles: Record<string, string>;
  layerStyles: Record<string, string>;
  letterSpacing: Record<string, string>;
};

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
    expect(categories).toContain("textStyles");
    expect(categories).toContain("layerStyles");
    expect(categories).toContain("letterSpacing");
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

    it("flattens palette colors with light/dark values", () => {
      const colors = data!.categoryValues["colors"];
      const amber = tokens.color["system-palettes"].amber;
      for (const [name, lightVal] of Object.entries(amber.light)) {
        const darkVal = (amber.dark as Record<string, string>)[name];
        const expected =
          lightVal === darkVal ? lightVal : `l: ${lightVal} d: ${darkVal}`;
        expect(colors[`amber.${name}`]).toBe(expected);
      }
    });

    it("includes semantic palette colors with light/dark values", () => {
      const colors = data!.categoryValues["colors"];
      const neutral = tokens.color["semantic-palettes"].neutral;
      for (const [name, lightVal] of Object.entries(neutral.light)) {
        const darkVal = (neutral.dark as Record<string, string>)[name];
        const expected =
          lightVal === darkVal ? lightVal : `l: ${lightVal} d: ${darkVal}`;
        expect(colors[`neutral.${name}`]).toBe(expected);
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

  describe("semantic color tokens (from generated mapping)", () => {
    it("includes all semantic colors from generated mapping", () => {
      const colors = data!.categoryValues["colors"];
      for (const name of Object.keys(generatedMapping.semanticColors)) {
        expect(colors[name]).toBeDefined();
      }
    });

    it("matches resolved values from generated mapping", () => {
      const colors = data!.categoryValues["colors"];
      for (const [name, expected] of Object.entries(
        generatedMapping.semanticColors
      )) {
        expect(colors[name]).toBe(expected);
      }
    });

    it("resolves semantic colors to CSS values (not token references)", () => {
      const colors = data!.categoryValues["colors"];
      for (const name of Object.keys(generatedMapping.semanticColors)) {
        expect(colors[name]).not.toMatch(/^\{/);
      }
    });

    it("merges with existing palette colors", () => {
      const colors = data!.categoryValues["colors"];
      // Semantic shortcuts should coexist with palette colors
      expect(
        Object.keys(generatedMapping.semanticColors).length
      ).toBeGreaterThan(0);
      expect(colors["neutral.12"]).toBeDefined();
    });
  });

  describe("textStyle tokens (from generated mapping)", () => {
    it("contains all textStyle entries from designTokens", () => {
      const textStyles = data!.categoryValues["textStyles"];
      for (const name of Object.keys(tokens.textStyle)) {
        expect(textStyles[name]).toBeDefined();
      }
    });

    it("formats composites as display strings derived from source", () => {
      const textStyles = data!.categoryValues["textStyles"];
      for (const [name, value] of Object.entries(tokens.textStyle)) {
        if (value && typeof value === "object") {
          const expected = Object.entries(value)
            .map(([prop, val]) => `${prop}: ${val}`)
            .join(", ");
          expect(textStyles[name]).toBe(expected);
        }
      }
    });

    it("has matching sets and values", () => {
      const set = data!.categorySets["textStyles"];
      const values = data!.categoryValues["textStyles"];
      expect(set.size).toBe(Object.keys(values).length);
      for (const name of set) {
        expect(values[name]).toBeDefined();
      }
    });
  });

  describe("layerStyle tokens (from generated mapping)", () => {
    it("contains all layerStyle entries from generated mapping", () => {
      const layerStyles = data!.categoryValues["layerStyles"];
      for (const name of Object.keys(generatedMapping.layerStyles)) {
        expect(layerStyles[name]).toBeDefined();
      }
    });

    it("matches values from generated mapping", () => {
      const layerStyles = data!.categoryValues["layerStyles"];
      for (const [name, expected] of Object.entries(
        generatedMapping.layerStyles
      )) {
        expect(layerStyles[name]).toBe(expected);
      }
    });

    it("has matching sets and values", () => {
      const set = data!.categorySets["layerStyles"];
      const values = data!.categoryValues["layerStyles"];
      expect(set.size).toBe(Object.keys(values).length);
      for (const name of set) {
        expect(values[name]).toBeDefined();
      }
    });
  });

  describe("letterSpacing tokens (from generated mapping)", () => {
    it("contains all letterSpacing entries from designTokens", () => {
      const letterSpacing = data!.categoryValues["letterSpacing"];
      for (const name of Object.keys(tokens.letterSpacing)) {
        expect(letterSpacing[name]).toBeDefined();
      }
    });

    it("unwraps {value} objects to plain strings from source", () => {
      const letterSpacing = data!.categoryValues["letterSpacing"];
      for (const [name, value] of Object.entries(tokens.letterSpacing)) {
        if (value && typeof value === "object" && "value" in value) {
          expect(letterSpacing[name]).toBe((value as { value: string }).value);
        }
      }
    });

    it("has matching sets and values", () => {
      const set = data!.categorySets["letterSpacing"];
      const values = data!.categoryValues["letterSpacing"];
      expect(set.size).toBe(Object.keys(values).length);
      for (const name of set) {
        expect(values[name]).toBeDefined();
      }
    });
  });
});
