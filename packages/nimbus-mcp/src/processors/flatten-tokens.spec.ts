import { describe, it, expect } from "vitest";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  flattenTokenTree,
  flattenTokensFromFile,
  reverseLookup,
  type FlatTokenData,
} from "./flatten-tokens.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const THEME_TOKENS_PATH = resolve(
  __dirname,
  "../../../tokens/src/generated/chakra/theme-tokens.ts"
);
const BASE_TOKENS_PATH = resolve(
  __dirname,
  "../../../tokens/src/base/tokens.json"
);

// ---------------------------------------------------------------------------
// Unit tests (synthetic data — always run)
// ---------------------------------------------------------------------------

describe("flattenTokenTree — unit", () => {
  it("flattens a simple token tree", () => {
    const tree = {
      spacing: {
        $type: "spacing",
        "100": { $value: "4px" },
        "200": { $value: "8px" },
      },
    };

    const data = flattenTokenTree(tree);

    expect(data.tokens).toHaveLength(2);
    expect(data.tokens[0]).toEqual({
      name: "spacing.100",
      value: "4px",
      category: "spacing",
      path: ["spacing", "100"],
    });
    expect(data.tokens[1]).toEqual({
      name: "spacing.200",
      value: "8px",
      category: "spacing",
      path: ["spacing", "200"],
    });
  });

  it("groups tokens by category", () => {
    const tree = {
      spacing: { $type: "spacing", "100": { $value: "4px" } },
      fontSize: { $type: "fontSize", "300": { $value: "14px" } },
    };

    const data = flattenTokenTree(tree);

    expect(Object.keys(data.byCategory)).toEqual(["spacing", "fontSize"]);
    expect(data.byCategory.spacing).toHaveLength(1);
    expect(data.byCategory.fontSize).toHaveLength(1);
  });

  it("handles _light/_dark color-mode values", () => {
    const tree = {
      color: {
        "system-palettes": {
          amber: {
            "1": {
              value: {
                _light: "hsl(40, 60%, 99%)",
                _dark: "hsl(36, 29%, 7%)",
              },
            },
            "2": {
              value: {
                _light: "hsl(51, 91%, 95%)",
                _dark: "hsl(39, 32%, 9%)",
              },
            },
          },
        },
      },
    };

    const data = flattenTokenTree(tree);

    // Two tokens (one per step), NOT four (no light/dark split in name)
    expect(data.tokens).toHaveLength(2);

    const names = data.tokens.map((t) => t.name);
    expect(names).toContain("color.system-palettes.amber.1");
    expect(names).toContain("color.system-palettes.amber.2");

    // Display value is combined
    const amber1 = data.tokens.find(
      (t) => t.name === "color.system-palettes.amber.1"
    );
    expect(amber1?.value).toBe("hsl(40, 60%, 99%) / hsl(36, 29%, 7%)");

    // All belong to "color" category
    for (const t of data.tokens) {
      expect(t.category).toBe("color");
    }
  });

  it("registers both _light and _dark values in reverse lookup", () => {
    const tree = {
      color: {
        "system-palettes": {
          amber: {
            "1": {
              value: {
                _light: "hsl(40, 60%, 99%)",
                _dark: "hsl(36, 29%, 7%)",
              },
            },
          },
        },
      },
    };

    const data = flattenTokenTree(tree);

    // Both mode values should resolve to the same token
    expect(reverseLookup(data, "hsl(40, 60%, 99%)")).toContain(
      "color.system-palettes.amber.1"
    );
    expect(reverseLookup(data, "hsl(36, 29%, 7%)")).toContain(
      "color.system-palettes.amber.1"
    );
  });

  it("enriches reverse lookup with hex values from base color tree", () => {
    const themeTree = {
      color: {
        "system-palettes": {
          amber: {
            "1": {
              value: {
                _light: "hsl(40, 60%, 99%)",
                _dark: "hsl(36, 29%, 7%)",
              },
            },
          },
        },
      },
    };

    const baseColorTree = {
      "system-palettes": {
        amber: {
          light: {
            "1": { $value: "#fefdfb" },
          },
          dark: {
            "1": { $value: "#16120c" },
          },
        },
      },
    };

    const data = flattenTokenTree(themeTree, baseColorTree);

    // Hex values should resolve to the same Chakra token name
    expect(reverseLookup(data, "#fefdfb")).toContain(
      "color.system-palettes.amber.1"
    );
    expect(reverseLookup(data, "#16120c")).toContain(
      "color.system-palettes.amber.1"
    );
    expect(reverseLookup(data, "#FEFDFB")).toContain(
      "color.system-palettes.amber.1"
    );
  });

  it("builds reverse-lookup index for simple values", () => {
    const tree = {
      spacing: { $type: "spacing", "400": { $value: "16px" } },
      blur: { $type: "dimension", "400": { $value: "16px" } },
      fontSize: { $type: "fontSize", "400": { $value: "16px" } },
    };

    const data = flattenTokenTree(tree);
    const matches = reverseLookup(data, "16px");

    expect(matches).toHaveLength(3);
    expect(matches).toContain("spacing.400");
    expect(matches).toContain("blur.400");
    expect(matches).toContain("fontSize.400");
  });

  it("reverse-lookup is case-insensitive for hex values", () => {
    const tree = {
      color: {
        primary: { $value: "#FFC53D" },
      },
    };

    const data = flattenTokenTree(tree);

    expect(reverseLookup(data, "#ffc53d")).toEqual(["color.primary"]);
    expect(reverseLookup(data, "#FFC53D")).toEqual(["color.primary"]);
  });

  it("returns empty array for unknown reverse-lookup values", () => {
    const data = flattenTokenTree({});
    expect(reverseLookup(data, "999px")).toEqual([]);
  });

  it("supports both $value and value leaf tokens", () => {
    const tree = {
      aspectRatio: {
        square: { value: 1 },
      },
      spacing: {
        "100": { $value: "4px" },
      },
    };

    const data = flattenTokenTree(tree);
    expect(data.tokens).toHaveLength(2);
    expect(
      data.tokens.find((t) => t.name === "aspectRatio.square")?.value
    ).toBe("1");
    expect(data.tokens.find((t) => t.name === "spacing.100")?.value).toBe(
      "4px"
    );
  });

  it("skips DTCG metadata keys ($type, $description, $extensions)", () => {
    const tree = {
      spacing: {
        $type: "spacing",
        $description: "Spacing scale",
        $extensions: { "com.example": true },
        "100": { $value: "4px" },
      },
    };

    const data = flattenTokenTree(tree);
    expect(data.tokens).toHaveLength(1);
    expect(data.tokens[0].name).toBe("spacing.100");
  });

  it("handles simple color values without _light/_dark", () => {
    const tree = {
      color: {
        "blacks-and-whites": {
          black: { value: "hsl(0, 0%, 0%)" },
          white: { value: "hsl(0, 0%, 100%)" },
        },
      },
    };

    const data = flattenTokenTree(tree);
    expect(data.tokens).toHaveLength(2);

    const black = data.tokens.find(
      (t) => t.name === "color.blacks-and-whites.black"
    );
    expect(black?.value).toBe("hsl(0, 0%, 0%)");
  });
});

// ---------------------------------------------------------------------------
// Integration tests (real theme tokens)
// ---------------------------------------------------------------------------

describe("flattenTokensFromFile — integration", () => {
  let data: FlatTokenData;

  it("flattens all tokens from theme-tokens.ts", async () => {
    data = await flattenTokensFromFile(THEME_TOKENS_PATH, BASE_TOKENS_PATH);
    expect(data.tokens.length).toBeGreaterThan(500);
  });

  it("covers expected categories", () => {
    const categories = Object.keys(data.byCategory);
    expect(categories).toContain("spacing");
    expect(categories).toContain("color");
    expect(categories).toContain("fontSize");
    expect(categories).toContain("borderRadius");
    expect(categories).toContain("fontWeight");
  });

  it("reverse-lookup works for spacing values", () => {
    const matches = reverseLookup(data, "16px");
    expect(matches.length).toBeGreaterThan(0);
    expect(matches.some((n) => n.startsWith("spacing."))).toBe(true);
  });

  it("reverse-lookup works for HSL color values", () => {
    const matches = reverseLookup(data, "hsl(40, 60%, 99%)");
    expect(matches.length).toBeGreaterThan(0);
    expect(matches).toContain("color.system-palettes.amber.1");
  });

  it("reverse-lookup works for hex color values from base tokens", () => {
    const matches = reverseLookup(data, "#fefdfb");
    expect(matches.length).toBeGreaterThan(0);
    expect(matches).toContain("color.system-palettes.amber.1");
  });

  it("reverse-lookup works for dark-mode hex values", () => {
    const matches = reverseLookup(data, "#16120c");
    expect(matches.length).toBeGreaterThan(0);
    expect(matches).toContain("color.system-palettes.amber.1");
  });

  it("reverse-lookup works for dark-mode HSL values", () => {
    const matches = reverseLookup(data, "hsl(36, 29%, 7%)");
    expect(matches.length).toBeGreaterThan(0);
    expect(matches).toContain("color.system-palettes.amber.1");
  });

  it("reverse-lookup works for font sizes", () => {
    const matches = reverseLookup(data, "14px");
    expect(matches.length).toBeGreaterThan(0);
  });

  it("color tokens do NOT include light/dark in path", () => {
    const colorTokens = data.byCategory.color;
    const systemPaletteTokens = colorTokens.filter((t) =>
      t.name.startsWith("color.system-palettes.")
    );

    // No token should have "light" or "dark" as a path segment
    for (const t of systemPaletteTokens) {
      expect(t.path).not.toContain("light");
      expect(t.path).not.toContain("dark");
    }
  });

  it("all tokens have required fields", () => {
    for (const token of data.tokens) {
      expect(typeof token.name).toBe("string");
      expect(token.name.length).toBeGreaterThan(0);
      expect(typeof token.value).toBe("string");
      expect(typeof token.category).toBe("string");
      expect(Array.isArray(token.path)).toBe(true);
      expect(token.path.length).toBeGreaterThanOrEqual(2);
    }
  });
});
