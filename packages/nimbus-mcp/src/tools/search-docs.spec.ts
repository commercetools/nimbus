import { describe, it, expect, beforeAll, afterAll } from "vitest";
import type { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { createTestClient } from "../test-utils.js";
import type { DocSearchResult } from "../types.js";

/**
 * Behavioral tests for the search_docs tool.
 *
 * Reads the search index from data/docs/ (populated by the prebuild step).
 * Tests assert shapes and meaningful results, not exact lists.
 *
 * A single MCP client connection is shared across all describe blocks since
 * the server is stateless — module-level caches are singletons and do not
 * need to be reset between test suites.
 */

let client: Client;
let close: () => Promise<void>;

beforeAll(async () => {
  const ctx = createTestClient();
  await ctx.connect();
  client = ctx.client;
  close = ctx.close;
});

afterAll(() => close());

async function callSearchDocs(args: {
  query: string;
}): Promise<DocSearchResult[]> {
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
  it("returns results for a broad query", async () => {
    const results = await callSearchDocs({ query: "button" });
    expect(results.length).toBeGreaterThan(0);
    expect(results.length).toBeLessThanOrEqual(10);
  });

  it("every result has the required fields", async () => {
    const results = await callSearchDocs({ query: "button" });
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
    const results = await callSearchDocs({ query: "component" });
    expect(results.length).toBeLessThanOrEqual(10);
  });

  it("returns no results for a nonsense query", async () => {
    const results = await callSearchDocs({ query: "xyzzy12345" });
    expect(results).toHaveLength(0);
  });
});

describe("search_docs — relevance", () => {
  it('finds relevant pages for "form validation"', async () => {
    const results = await callSearchDocs({ query: "form validation" });
    expect(results.length).toBeGreaterThan(0);
  });

  it("returns results with meaningful snippets", async () => {
    const results = await callSearchDocs({ query: "color tokens" });
    expect(results.length).toBeGreaterThan(0);
    // Snippets should contain more than just whitespace
    for (const r of results) {
      expect(r.snippet.trim().length).toBeGreaterThan(10);
    }
  });

  it("searches across component and guide pages", async () => {
    const results = await callSearchDocs({ query: "accessibility" });
    expect(results.length).toBeGreaterThan(0);
  });
});

describe("search_docs — relevance ordering", () => {
  it('ranks "Colors" page in the top 2 results for "color tokens"', async () => {
    const results = await callSearchDocs({ query: "color tokens" });
    expect(results.length).toBeGreaterThan(0);
    const colorsIndex = results.findIndex((r) => r.path.includes("colors"));
    expect(colorsIndex).toBeGreaterThanOrEqual(0);
    expect(colorsIndex).toBeLessThan(2);
  });
});

describe("search_docs — deep content search (phase 2)", () => {
  it("finds content from dev views (import paths, props)", async () => {
    const results = await callSearchDocs({ query: "ButtonProps" });
    expect(results.length).toBeGreaterThan(0);
    const hasButton = results.some(
      (r) => r.title === "Button" || r.path.includes("button")
    );
    expect(hasButton).toBe(true);
  });

  it("finds content from guidelines views", async () => {
    // "do" and "don't" patterns are typically in guidelines
    const results = await callSearchDocs({
      query: "Button Guidelines",
    });
    expect(results.length).toBeGreaterThan(0);
    const guidelineMatch = results.find((r) => r.matchedView === "guidelines");
    expect(guidelineMatch).toBeDefined();
  });

  it("returns matchedView when match is not in overview", async () => {
    // "import" statements are in the dev view, not overview
    const results = await callSearchDocs({
      query: "import Button from",
    });
    const devMatch = results.find((r) => r.matchedView === "dev");
    expect(devMatch).toBeDefined();
  });

  it("snippet comes from the matched view content", async () => {
    const results = await callSearchDocs({ query: "ButtonProps" });
    const buttonResult = results.find(
      (r) => r.title === "Button" || r.path.includes("button")
    );
    expect(buttonResult).toBeDefined();
    expect(buttonResult!.snippet.toLowerCase()).toContain("buttonprops");
  });
});
