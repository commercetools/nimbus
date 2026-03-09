import { describe, it, expect, beforeAll, afterAll } from "vitest";
import type { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { createTestClient } from "../test-utils.js";
import type { DocSearchResult } from "../types.js";

/**
 * Behavioral tests for the search_docs tool.
 *
 * Reads the search index from data/docs/ (populated by the prebuild step).
 * Tests assert shapes and meaningful results, not exact lists.
 */

async function callSearchDocs(
  client: Client,
  args: { query: string }
): Promise<DocSearchResult[]> {
  const result = await client.callTool({
    name: "search_docs",
    arguments: args,
  });
  const text = (result.content as Array<{ type: string; text: string }>).find(
    (c) => c.type === "text"
  )?.text;

  if (!text || text === "No matching documentation found.") return [];
  return JSON.parse(text) as DocSearchResult[];
}

describe("search_docs — basic search", () => {
  let client: Client;
  let close: () => Promise<void>;

  beforeAll(async () => {
    const ctx = createTestClient();
    await ctx.connect();
    client = ctx.client;
    close = ctx.close;
  });

  afterAll(() => close());

  it("returns results for a broad query", async () => {
    const results = await callSearchDocs(client, { query: "button" });
    expect(results.length).toBeGreaterThan(0);
    expect(results.length).toBeLessThanOrEqual(10);
  });

  it("every result has the required fields", async () => {
    const results = await callSearchDocs(client, { query: "button" });
    for (const r of results) {
      expect(typeof r.title).toBe("string");
      expect(typeof r.description).toBe("string");
      expect(typeof r.path).toBe("string");
      expect(typeof r.snippet).toBe("string");
      expect(r.snippet.length).toBeGreaterThan(0);
    }
  });

  it("caps results at 10", async () => {
    // Use a very broad query that should match many pages
    const results = await callSearchDocs(client, { query: "component" });
    expect(results.length).toBeLessThanOrEqual(10);
  });

  it("returns no results for a nonsense query", async () => {
    const results = await callSearchDocs(client, { query: "xyzzy12345" });
    expect(results).toHaveLength(0);
  });
});

describe("search_docs — relevance", () => {
  let client: Client;
  let close: () => Promise<void>;

  beforeAll(async () => {
    const ctx = createTestClient();
    await ctx.connect();
    client = ctx.client;
    close = ctx.close;
  });

  afterAll(() => close());

  it('finds relevant pages for "form validation"', async () => {
    const results = await callSearchDocs(client, { query: "form validation" });
    expect(results.length).toBeGreaterThan(0);
  });

  it("returns results with meaningful snippets", async () => {
    const results = await callSearchDocs(client, { query: "color tokens" });
    expect(results.length).toBeGreaterThan(0);
    // Snippets should contain more than just whitespace
    for (const r of results) {
      expect(r.snippet.trim().length).toBeGreaterThan(10);
    }
  });

  it("searches across component and guide pages", async () => {
    const results = await callSearchDocs(client, { query: "accessibility" });
    expect(results.length).toBeGreaterThan(0);
  });
});
