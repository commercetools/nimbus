import { describe, it, expect, beforeAll, afterAll } from "vitest";
import type { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { createTestClient } from "../test-utils.js";

/**
 * Behavioral tests for the get_tokens tool.
 *
 * Reads flattened token data from data/tokens.json (populated by the prebuild step).
 * Tests assert shapes and minimums, not exact values, to stay resilient to token updates.
 */

type CategorySummary = { category: string; count: number };

type TokenEntry = {
  name: string;
  value: string;
  category: string;
  path: string[];
};

type CategoryResponse = {
  category: string;
  total: number;
  showing: number;
  tokens: TokenEntry[];
  note?: string;
};

type ReverseLookupResponse = { value: string; tokens: string[] };

async function callGetTokens(
  client: Client,
  args: { category?: string; value?: string; limit?: number } = {}
): Promise<{ text: string; isError?: boolean }> {
  const result = await client.callTool({ name: "get_tokens", arguments: args });
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
    const categories = JSON.parse(text) as CategorySummary[];
    expect(Array.isArray(categories)).toBe(true);
    expect(categories.length).toBeGreaterThan(0);
  });

  it("each entry has category (string) and count (positive integer)", async () => {
    const { text } = await callGetTokens(client);
    const categories = JSON.parse(text) as CategorySummary[];
    for (const entry of categories) {
      expect(typeof entry.category).toBe("string");
      expect(entry.category.length).toBeGreaterThan(0);
      expect(typeof entry.count).toBe("number");
      expect(entry.count).toBeGreaterThan(0);
    }
  });

  it("includes expected categories: spacing, color, fontSize", async () => {
    const { text } = await callGetTokens(client);
    const categories = JSON.parse(text) as CategorySummary[];
    const names = categories.map((c) => c.category);
    expect(names).toContain("spacing");
    expect(names).toContain("color");
    expect(names).toContain("fontSize");
  });

  it("results are sorted alphabetically by category", async () => {
    const { text } = await callGetTokens(client);
    const categories = JSON.parse(text) as CategorySummary[];
    const names = categories.map((c) => c.category);
    const sorted = [...names].sort((a, b) => a.localeCompare(b));
    expect(names).toEqual(sorted);
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
    const response = JSON.parse(text) as CategoryResponse;
    expect(response.category).toBe("spacing");
    expect(response.total).toBeGreaterThan(0);
    expect(response.showing).toBe(response.total);
    expect(Array.isArray(response.tokens)).toBe(true);
    expect(response.tokens.length).toBe(response.showing);
  });

  it("spacing.400 resolves to 16px", async () => {
    const { text } = await callGetTokens(client, { category: "spacing" });
    const response = JSON.parse(text) as CategoryResponse;
    const token400 = response.tokens.find((t) => t.name === "spacing.400");
    expect(token400).toBeDefined();
    expect(token400?.value).toBe("16px");
  });

  it("each token has required fields", async () => {
    const { text } = await callGetTokens(client, { category: "spacing" });
    const response = JSON.parse(text) as CategoryResponse;
    for (const token of response.tokens) {
      expect(typeof token.name).toBe("string");
      expect(typeof token.value).toBe("string");
      expect(typeof token.category).toBe("string");
      expect(Array.isArray(token.path)).toBe(true);
    }
  });

  it("is case-insensitive for category lookup", async () => {
    const lower = await callGetTokens(client, { category: "spacing" });
    const upper = await callGetTokens(client, { category: "SPACING" });
    const lowerData = JSON.parse(lower.text) as CategoryResponse;
    const upperData = JSON.parse(upper.text) as CategoryResponse;
    expect(lowerData.total).toBe(upperData.total);
  });

  it("summarizes large categories by default (color has > 50 tokens, shows 20)", async () => {
    const { text } = await callGetTokens(client, { category: "color" });
    const response = JSON.parse(text) as CategoryResponse;
    expect(response.total).toBeGreaterThan(50);
    expect(response.showing).toBe(20);
    expect(response.tokens.length).toBe(20);
    expect(typeof response.note).toBe("string");
  });

  it("respects limit param for large categories", async () => {
    const { text } = await callGetTokens(client, {
      category: "color",
      limit: 5,
    });
    const response = JSON.parse(text) as CategoryResponse;
    expect(response.showing).toBe(5);
    expect(response.tokens.length).toBe(5);
  });

  it("limit param can return all tokens from a large category", async () => {
    // Get total count first
    const summary = await callGetTokens(client, { category: "color" });
    const { total } = JSON.parse(summary.text) as CategoryResponse;

    const { text } = await callGetTokens(client, {
      category: "color",
      limit: total,
    });
    const response = JSON.parse(text) as CategoryResponse;
    expect(response.showing).toBe(total);
    expect(response.note).toBeUndefined();
  });

  it("returns isError for an unknown category", async () => {
    const result = await callGetTokens(client, {
      category: "nonexistent-category",
    });
    expect(result.isError).toBe(true);
    expect(result.text).toContain("not found");
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
    const response = JSON.parse(text) as ReverseLookupResponse;
    expect(response.value).toBe("16px");
    expect(Array.isArray(response.tokens)).toBe(true);
    expect(response.tokens.some((n) => n === "spacing.400")).toBe(true);
  });

  it("is case-insensitive for hex values", async () => {
    const lower = await callGetTokens(client, { value: "#fefdfb" });
    const upper = await callGetTokens(client, { value: "#FEFDFB" });
    const lowerData = JSON.parse(lower.text) as ReverseLookupResponse;
    const upperData = JSON.parse(upper.text) as ReverseLookupResponse;
    expect(lowerData.tokens.sort()).toEqual(upperData.tokens.sort());
  });

  it("returns a plain string message for values with no match", async () => {
    const { text } = await callGetTokens(client, {
      value: "999999px-nonexistent",
    });
    expect(text).toContain("No tokens found");
  });
});
