import { describe, it, expect, beforeAll, afterAll } from "vitest";
import type { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { createTestClient } from "../test-utils.js";
import type { IconResult, SearchIconsResponse } from "../types.js";

/**
 * Behavioral tests for the search_icons tool.
 *
 * Reads the icon catalog from data/icons.json (populated by the prebuild step).
 * Tests assert result shapes, pagination metadata, and known icon matches.
 */

async function callSearchIcons(
  client: Client,
  args: { query: string; offset?: number }
): Promise<SearchIconsResponse> {
  const result = await client.callTool({
    name: "search_icons",
    arguments: args,
  });
  const text = (result.content as Array<{ type: string; text: string }>).find(
    (c) => c.type === "text"
  )?.text;

  if (!text) {
    throw new Error("search_icons returned no text content");
  }

  return JSON.parse(text) as SearchIconsResponse;
}

describe("search_icons — basic search", () => {
  let client: Client;
  let close: () => Promise<void>;

  beforeAll(async () => {
    const ctx = createTestClient();
    await ctx.connect();
    client = ctx.client;
    close = ctx.close;
  });

  afterAll(() => close());

  it("returns results for a matching query", async () => {
    const response = await callSearchIcons(client, { query: "check" });
    expect(response.totalResults).toBeGreaterThan(0);
    expect(response.results.length).toBeGreaterThan(0);
  });

  it("every entry has the required fields", async () => {
    const response = await callSearchIcons(client, { query: "arrow" });
    expect(response.results.length).toBeGreaterThan(0);
    expect(response.importPath).toBe("@commercetools/nimbus-icons");
    for (const icon of response.results) {
      expect(typeof icon.name).toBe("string");
      expect(["material", "custom"]).toContain(icon.category);
      expect(Array.isArray(icon.keywords)).toBe(true);
    }
  });

  it("returns pagination metadata", async () => {
    const response = await callSearchIcons(client, { query: "arrow" });
    expect(response.totalResults).toBeGreaterThan(0);
    expect(response.offset).toBe(0);
    expect(response.pageSize).toBe(10);
    expect(typeof response.hasMore).toBe("boolean");
  });

  it("pages results at 10 per page", async () => {
    const response = await callSearchIcons(client, { query: "arrow" });
    expect(response.results.length).toBeLessThanOrEqual(10);
  });

  it("returns all matching results for a broad query", async () => {
    // "s" is a very broad query — totalResults should reflect actual matches
    const response = await callSearchIcons(client, { query: "s" });
    expect(response.totalResults).toBeGreaterThan(10);
  });

  it("returns zero results for a nonsense query", async () => {
    const response = await callSearchIcons(client, { query: "zzqxjwvfk" });
    expect(response.totalResults).toBe(0);
    expect(response.results).toEqual([]);
  });

  it("returns zero results for a long nonsense query containing short icon names", async () => {
    // A long garbage string that contains substrings matching short icon names
    // (e.g. "sd", "in") — should not match via reverse-substring logic
    const response = await callSearchIcons(client, {
      query: "dsfawedsf;sdklmf klsdjqwin ipwsder y",
    });
    expect(response.totalResults).toBe(0);
    expect(response.results).toEqual([]);
  });
});

describe("search_icons — pagination", () => {
  let client: Client;
  let close: () => Promise<void>;

  beforeAll(async () => {
    const ctx = createTestClient();
    await ctx.connect();
    client = ctx.client;
    close = ctx.close;
  });

  afterAll(() => close());

  it("returns hasMore and hint when more results exist", async () => {
    const response = await callSearchIcons(client, { query: "arrow" });
    // "arrow" should match more than 10 icons
    expect(response.hasMore).toBe(true);
    expect(response.hint).toBeDefined();
    expect(response.hint).toContain("offset");
  });

  it("retrieves the next page with offset", async () => {
    const page1 = await callSearchIcons(client, { query: "arrow" });
    const page2 = await callSearchIcons(client, {
      query: "arrow",
      offset: 10,
    });

    expect(page2.results.length).toBeGreaterThan(0);
    // pages should not overlap
    const page1Names = page1.results.map((r) => r.name);
    const page2Names = page2.results.map((r) => r.name);
    for (const name of page2Names) {
      expect(page1Names).not.toContain(name);
    }
  });

  it("returns hasMore: false on the last page", async () => {
    // Fetch page 1 to learn totalResults, then jump past the end
    const page1 = await callSearchIcons(client, { query: "home" });
    const lastPageOffset = page1.totalResults; // offset beyond all results
    const response = await callSearchIcons(client, {
      query: "home",
      offset: lastPageOffset,
    });
    expect(response.hasMore).toBe(false);
    expect(response.hint).toBeUndefined();
  });

  it("echoes the requested offset in the response", async () => {
    const response = await callSearchIcons(client, {
      query: "arrow",
      offset: 10,
    });
    expect(response.offset).toBe(10);
  });
});

describe("search_icons — acceptance criteria", () => {
  let client: Client;
  let close: () => Promise<void>;

  beforeAll(async () => {
    const ctx = createTestClient();
    await ctx.connect();
    client = ctx.client;
    close = ctx.close;
  });

  afterAll(() => close());

  it('search_icons("CheckCircle") returns CheckCircle across pages', async () => {
    const page1 = await callSearchIcons(client, { query: "CheckCircle" });
    const page2 = page1.hasMore
      ? await callSearchIcons(client, { query: "CheckCircle", offset: 10 })
      : { results: [] as IconResult[] };

    const names = [...page1.results, ...page2.results].map((r) => r.name);
    expect(names).toContain("CheckCircle");
  });

  it("importPath is hoisted to envelope, not per result", async () => {
    const response = await callSearchIcons(client, { query: "checkmark" });
    expect(response.importPath).toBe("@commercetools/nimbus-icons");
    for (const icon of response.results) {
      expect(
        (icon as unknown as Record<string, unknown>).importPath
      ).toBeUndefined();
    }
  });
});
