import { describe, it, expect, beforeAll, afterAll } from "vitest";
import type { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { createTestClient } from "../test-utils.js";
import type {
  PaletteGroupResponse,
  TokenCategorySummary,
  TokenCategoryResponse,
  TokenReverseLookupResponse,
} from "../types.js";

/**
 * Behavioral tests for the get_tokens tool.
 *
 * Reads flattened token data from data/tokens.json (populated by the prebuild step).
 * Tests assert shapes and minimums, not exact values, to stay resilient to token updates.
 */

async function callGetTokens(
  client: Client,
  args: {
    category?: string;
    value?: string;
    offset?: number;
    limit?: number;
  } = {}
): Promise<{ text: string; isError?: boolean }> {
  const result = await client.callTool({
    name: "get_tokens",
    arguments: args,
  });
  const content = result.content as Array<{ type: string; text: string }>;
  const text = content.find((c) => c.type === "text")?.text ?? "";
  return { text, isError: result.isError as boolean | undefined };
}

describe("get_tokens — no params", () => {
  let client: Client;
  let close: () => Promise<void>;

  beforeAll(async () => {
    const ctx = createTestClient();
    await ctx.connect();
    client = ctx.client;
    close = ctx.close;
  });

  afterAll(() => close());

  it("returns a non-empty list of categories", async () => {
    const { text } = await callGetTokens(client);
    const categories = JSON.parse(text) as TokenCategorySummary[];
    expect(Array.isArray(categories)).toBe(true);
    expect(categories.length).toBeGreaterThan(0);
  });

  it("each entry has category (string) and count (positive integer)", async () => {
    const { text } = await callGetTokens(client);
    const categories = JSON.parse(text) as TokenCategorySummary[];
    for (const entry of categories) {
      expect(typeof entry.category).toBe("string");
      expect(entry.category.length).toBeGreaterThan(0);
      expect(typeof entry.count).toBe("number");
      expect(entry.count).toBeGreaterThan(0);
    }
  });

  it("includes expected categories: spacing, color, fontSize", async () => {
    const { text } = await callGetTokens(client);
    const categories = JSON.parse(text) as TokenCategorySummary[];
    const names = categories.map((c) => c.category);
    expect(names).toContain("spacing");
    expect(names).toContain("color");
    expect(names).toContain("fontSize");
  });

  it("lists high-priority categories first (color, spacing, fontSize)", async () => {
    const { text } = await callGetTokens(client);
    const categories = JSON.parse(text) as TokenCategorySummary[];
    const names = categories.map((c) => c.category);
    const colorIdx = names.indexOf("color");
    const spacingIdx = names.indexOf("spacing");
    const fontSizeIdx = names.indexOf("fontSize");
    expect(colorIdx).toBe(0);
    expect(spacingIdx).toBe(1);
    expect(fontSizeIdx).toBe(2);
  });
});

describe("get_tokens — category param", () => {
  let client: Client;
  let close: () => Promise<void>;

  beforeAll(async () => {
    const ctx = createTestClient();
    await ctx.connect();
    client = ctx.client;
    close = ctx.close;
  });

  afterAll(() => close());

  it("returns spacing tokens", async () => {
    const { text } = await callGetTokens(client, { category: "spacing" });
    const response = JSON.parse(text) as TokenCategoryResponse;
    expect(response.category).toBe("spacing");
    expect(response.total).toBeGreaterThan(0);
    expect(response.showing).toBe(response.total);
    expect(Array.isArray(response.tokens)).toBe(true);
    expect(response.tokens.length).toBe(response.showing);
  });

  it("spacing.400 resolves to 16px", async () => {
    const { text } = await callGetTokens(client, { category: "spacing" });
    const response = JSON.parse(text) as TokenCategoryResponse;
    const token400 = response.tokens.find((t) => t.name === "spacing.400");
    expect(token400).toBeDefined();
    expect(token400?.value).toBe("16px");
  });

  it("each token has name and value only (no redundant fields)", async () => {
    const { text } = await callGetTokens(client, { category: "spacing" });
    const response = JSON.parse(text) as TokenCategoryResponse;
    for (const token of response.tokens) {
      expect(typeof token.name).toBe("string");
      expect(typeof token.value).toBe("string");
      expect(Object.keys(token)).toEqual(["name", "value"]);
    }
  });

  it("is case-insensitive for category lookup", async () => {
    const lower = await callGetTokens(client, { category: "spacing" });
    const upper = await callGetTokens(client, { category: "SPACING" });
    const lowerData = JSON.parse(lower.text) as TokenCategoryResponse;
    const upperData = JSON.parse(upper.text) as TokenCategoryResponse;
    expect(lowerData.total).toBe(upperData.total);
  });

  it("paginates large categories by default (color has > 55 tokens, shows 20)", async () => {
    const { text } = await callGetTokens(client, { category: "color" });
    const response = JSON.parse(text) as TokenCategoryResponse;
    expect(response.total).toBeGreaterThan(55);
    expect(response.showing).toBe(20);
    expect(response.tokens.length).toBe(20);
    expect(typeof response.hint).toBe("string");
  });

  it("respects limit param for large categories", async () => {
    const { text } = await callGetTokens(client, {
      category: "color",
      limit: 5,
    });
    const response = JSON.parse(text) as TokenCategoryResponse;
    expect(response.showing).toBe(5);
    expect(response.tokens.length).toBe(5);
  });

  it("offset paginates through large categories", async () => {
    const first = await callGetTokens(client, {
      category: "color",
      limit: 5,
    });
    const firstPage = JSON.parse(first.text) as TokenCategoryResponse;

    const second = await callGetTokens(client, {
      category: "color",
      offset: 5,
      limit: 5,
    });
    const secondPage = JSON.parse(second.text) as TokenCategoryResponse;

    // Pages should not overlap
    const firstNames = firstPage.tokens.map((t) => t.name);
    const secondNames = secondPage.tokens.map((t) => t.name);
    expect(firstNames).not.toEqual(secondNames);

    // Both should show 5 tokens
    expect(firstPage.showing).toBe(5);
    expect(secondPage.showing).toBe(5);

    // Total should be consistent
    expect(firstPage.total).toBe(secondPage.total);
  });

  it("limit param can return all tokens from a large category", async () => {
    // Get total count first
    const summary = await callGetTokens(client, { category: "color" });
    const { total } = JSON.parse(summary.text) as TokenCategoryResponse;

    const { text } = await callGetTokens(client, {
      category: "color",
      limit: total,
    });
    const response = JSON.parse(text) as TokenCategoryResponse;
    expect(response.showing).toBe(total);
    expect(response.hint).toBeUndefined();
  });

  it("returns empty results when offset exceeds total", async () => {
    const { text } = await callGetTokens(client, {
      category: "spacing",
      offset: 99999,
    });
    const response = JSON.parse(text) as TokenCategoryResponse;
    expect(response.showing).toBe(0);
    expect(response.tokens).toEqual([]);
  });

  it("returns isError for an unknown category", async () => {
    const result = await callGetTokens(client, {
      category: "nonexistent-category",
    });
    expect(result.isError).toBe(true);
    expect(result.text).toContain("not found");
  });
});

describe("get_tokens — colorPalettes virtual category", () => {
  let client: Client;
  let close: () => Promise<void>;

  beforeAll(async () => {
    const ctx = createTestClient();
    await ctx.connect();
    client = ctx.client;
    close = ctx.close;
  });

  afterAll(() => close());

  it("returns grouped palette entries with name and solid", async () => {
    const { text } = await callGetTokens(client, {
      category: "colorPalettes",
    });
    const response = JSON.parse(text) as PaletteGroupResponse;
    for (const group of [
      "semantic-palettes",
      "brand-palettes",
      "system-palettes",
      "blacks-and-whites",
    ] as const) {
      expect(Array.isArray(response[group])).toBe(true);
      for (const entry of response[group]) {
        expect(typeof entry.name).toBe("string");
        expect(typeof entry.solid).toBe("string");
        expect(entry.solid.length).toBeGreaterThan(0);
      }
    }
  });

  it("semantic palettes include primary and critical", async () => {
    const { text } = await callGetTokens(client, {
      category: "colorPalettes",
    });
    const response = JSON.parse(text) as PaletteGroupResponse;
    const names = response["semantic-palettes"].map((p) => p.name);
    expect(names).toContain("primary");
    expect(names).toContain("critical");
    expect(names).toContain("neutral");
  });

  it("system palettes include amber and red", async () => {
    const { text } = await callGetTokens(client, {
      category: "colorPalettes",
    });
    const response = JSON.parse(text) as PaletteGroupResponse;
    const names = response["system-palettes"].map((p) => p.name);
    expect(names).toContain("amber");
    expect(names).toContain("red");
  });

  it("excludes alpha palette names (e.g. amberAlpha) from non-blacks-and-whites groups", async () => {
    const { text } = await callGetTokens(client, {
      category: "colorPalettes",
    });
    const response = JSON.parse(text) as PaletteGroupResponse;
    for (const group of [
      "semantic-palettes",
      "brand-palettes",
      "system-palettes",
    ] as const) {
      const names = response[group].map((p) => p.name);
      const alphas = names.filter((n) => n.endsWith("Alpha"));
      expect(alphas).toEqual([]);
    }
  });

  it("is case-insensitive", async () => {
    const lower = await callGetTokens(client, {
      category: "colorpalettes",
    });
    const upper = await callGetTokens(client, {
      category: "COLORPALETTES",
    });
    expect(lower.text).toEqual(upper.text);
  });
});

describe("get_tokens — value reverse-lookup", () => {
  let client: Client;
  let close: () => Promise<void>;

  beforeAll(async () => {
    const ctx = createTestClient();
    await ctx.connect();
    client = ctx.client;
    close = ctx.close;
  });

  afterAll(() => close());

  it("resolves 16px to spacing.400", async () => {
    const { text } = await callGetTokens(client, { value: "16px" });
    const response = JSON.parse(text) as TokenReverseLookupResponse;
    expect(response.value).toBe("16px");
    expect(Array.isArray(response.tokens)).toBe(true);
    expect(response.tokens.some((n) => n === "spacing.400")).toBe(true);
  });

  it("is case-insensitive for hex values", async () => {
    const lower = await callGetTokens(client, { value: "#fefdfb" });
    const upper = await callGetTokens(client, { value: "#FEFDFB" });
    const lowerData = JSON.parse(lower.text) as TokenReverseLookupResponse;
    const upperData = JSON.parse(upper.text) as TokenReverseLookupResponse;
    expect(lowerData.tokens.sort()).toEqual(upperData.tokens.sort());
  });

  it("returns a plain string message for values with no match", async () => {
    const { text } = await callGetTokens(client, {
      value: "999999px-nonexistent",
    });
    expect(text).toContain("No tokens found");
  });
});
