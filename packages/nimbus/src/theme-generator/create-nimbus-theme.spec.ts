import { describe, it, expect } from "vitest";
import {
  palettesToSemanticTokens,
  buildTokenOverrides,
  createNimbusTheme,
} from "./create-nimbus-theme";

describe("palettesToSemanticTokens", () => {
  it("converts a generated palette config into Chakra semantic token format", () => {
    const result = palettesToSemanticTokens({
      brand: { type: "generated", baseColor: "#E63946" },
    });

    expect(result).toHaveProperty("brand");
    expect(result.brand).toHaveProperty("1");
    expect(result.brand["1"]).toHaveProperty("value");
    expect(result.brand["1"].value).toHaveProperty("_light");
    expect(result.brand["1"].value).toHaveProperty("_dark");
  });

  it("includes all 12 steps plus DEFAULT and contrast", () => {
    const result = palettesToSemanticTokens({
      brand: { type: "generated", baseColor: "#E63946" },
    });

    const steps = [
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
      "DEFAULT",
      "contrast",
    ];
    for (const step of steps) {
      expect(result.brand).toHaveProperty(step);
    }
  });

  it("converts a manual palette config", () => {
    const result = palettesToSemanticTokens({
      custom: {
        type: "manual",
        light: {
          "1": "#fff",
          "2": "#fef",
          "3": "#fdf",
          "4": "#fcf",
          "5": "#fbf",
          "6": "#faf",
          "7": "#f9f",
          "8": "#f8f",
          "9": "#f7f",
          "10": "#f6f",
          "11": "#333",
          "12": "#111",
        },
        dark: {
          "1": "#111",
          "2": "#121",
          "3": "#131",
          "4": "#141",
          "5": "#151",
          "6": "#161",
          "7": "#171",
          "8": "#181",
          "9": "#f7f",
          "10": "#f8f",
          "11": "#ddd",
          "12": "#fff",
        },
      },
    });

    const val = result.custom["1"].value;
    expect(typeof val === "object" && "_light" in val && val._light).toBe(
      "#fff"
    );
    expect(typeof val === "object" && "_dark" in val && val._dark).toBe("#111");
  });

  it("applies semantic mappings as token references", () => {
    const result = palettesToSemanticTokens(
      { brand: { type: "generated", baseColor: "#E63946" } },
      { primary: "brand" }
    );

    expect(result).toHaveProperty("primary");
    expect(result.primary["1"].value).toEqual({
      _light: "{colors.brand.1}",
      _dark: "{colors.brand.1}",
    });
    expect(result.primary["9"].value).toEqual({
      _light: "{colors.brand.9}",
      _dark: "{colors.brand.9}",
    });
    expect(result.primary.contrast.value).toEqual({
      _light: "{colors.brand.contrast}",
      _dark: "{colors.brand.contrast}",
    });
  });

  it("handles multiple palettes", () => {
    const result = palettesToSemanticTokens({
      brand: { type: "generated", baseColor: "#E63946" },
      accent: { type: "generated", baseColor: "#2A9D8F" },
    });

    expect(result).toHaveProperty("brand");
    expect(result).toHaveProperty("accent");
  });
});

describe("buildTokenOverrides", () => {
  it("returns empty object when no overrides provided", () => {
    const result = buildTokenOverrides(undefined);
    expect(result).toEqual({});
  });

  it("converts flat key-value overrides to Chakra token format", () => {
    const result = buildTokenOverrides({
      fonts: {
        body: { value: "Roboto, sans-serif" },
        heading: { value: "Montserrat, sans-serif" },
      },
    });

    expect(result.fonts).toEqual({
      body: { value: "Roboto, sans-serif" },
      heading: { value: "Montserrat, sans-serif" },
    });
  });

  it("handles multiple token categories", () => {
    const result = buildTokenOverrides({
      fonts: { body: { value: "Roboto, sans-serif" } },
      spacing: { "400": { value: "20px" } },
      radii: { md: { value: "8px" } },
    });

    expect(result.fonts).toBeDefined();
    expect(result.spacing).toBeDefined();
    expect(result.radii).toBeDefined();
  });
});

describe("createNimbusTheme", () => {
  it("produces a valid system object", () => {
    const system = createNimbusTheme({
      palettes: {
        brand: { type: "generated", baseColor: "#E63946" },
      },
      semantic: { primary: "brand" },
    });

    expect(system).toBeDefined();
    expect(system).toHaveProperty("token");
    expect(system).toHaveProperty("getTokenCss");
  });

  it("system token dictionary contains the custom palette", () => {
    const system = createNimbusTheme({
      palettes: {
        brand: { type: "generated", baseColor: "#E63946" },
      },
    });

    const brandToken = system.token("colors.brand.9");
    expect(brandToken).toBeDefined();
  });

  it("semantic override creates a primary token that references brand", () => {
    const system = createNimbusTheme({
      palettes: {
        brand: { type: "generated", baseColor: "#E63946" },
      },
      semantic: { primary: "brand" },
    });

    const primaryToken = system.token("colors.primary.9");
    const brandToken = system.token("colors.brand.9");
    expect(primaryToken).toBeDefined();
    expect(brandToken).toBeDefined();
    // primary resolves to a CSS var reference (which at runtime maps to brand.9)
    expect(typeof primaryToken).toBe("string");
    expect(typeof brandToken).toBe("string");
  });
});
