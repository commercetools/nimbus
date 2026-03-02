import { describe, it, expect } from "vitest";
import { existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  flattenTokenTree,
  flattenTokensFromFile,
  reverseLookup,
  type FlatTokenData,
} from "./flatten-tokens.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const TOKENS_PATH = resolve(__dirname, "../../../tokens/src/base/tokens.json");
const HAS_TOKENS = existsSync(TOKENS_PATH);

// ---------------------------------------------------------------------------
// Unit tests (synthetic data — always run)
// ---------------------------------------------------------------------------

describe("flattenTokenTree — unit", () => {
  it("flattens a simple DTCG tree", () => {
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

  it("handles nested color structures with light/dark modes", () => {
    const tree = {
      color: {
        $type: "color",
        "semantic-palettes": {
          primary: {
            light: {
              "1": { $value: "#e6f0ff" },
              "2": { $value: "#cce0ff" },
            },
            dark: {
              "1": { $value: "#0a1a33" },
              "2": { $value: "#142d52" },
            },
          },
        },
      },
    };

    const data = flattenTokenTree(tree);

    expect(data.tokens).toHaveLength(4);

    const names = data.tokens.map((t) => t.name);
    expect(names).toContain("color.semantic-palettes.primary.light.1");
    expect(names).toContain("color.semantic-palettes.primary.dark.1");

    // All belong to "color" category
    for (const t of data.tokens) {
      expect(t.category).toBe("color");
    }
  });

  it("builds reverse-lookup index", () => {
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
        $type: "color",
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
        $type: "number",
        square: { value: 1 },
      },
      spacing: {
        $type: "spacing",
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
});

// ---------------------------------------------------------------------------
// Integration tests (real tokens.json — skipped if not present)
// ---------------------------------------------------------------------------

describe.runIf(HAS_TOKENS)("flattenTokensFromFile — integration", () => {
  let data: FlatTokenData;

  it("flattens all 500+ tokens from tokens.json", async () => {
    data = await flattenTokensFromFile(TOKENS_PATH);
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

  it("reverse-lookup works for color hex values", () => {
    // #000 is black, should be in the tokens
    const matches = reverseLookup(data, "#000");
    expect(matches.length).toBeGreaterThan(0);
    expect(matches.some((n) => n.startsWith("color."))).toBe(true);
  });

  it("reverse-lookup works for font sizes", () => {
    const matches = reverseLookup(data, "14px");
    expect(matches.length).toBeGreaterThan(0);
  });

  it("handles light/dark color tokens", () => {
    const colorTokens = data.byCategory.color;
    const lightTokens = colorTokens.filter((t) => t.path.includes("light"));
    const darkTokens = colorTokens.filter((t) => t.path.includes("dark"));

    expect(lightTokens.length).toBeGreaterThan(0);
    expect(darkTokens.length).toBeGreaterThan(0);
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
