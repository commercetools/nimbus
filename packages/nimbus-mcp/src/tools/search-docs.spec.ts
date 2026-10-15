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

/** Returns the raw text payload so byte-budget tests can measure it. */
async function callSearchDocsRaw(args: {
  query: string;
  limit?: number;
}): Promise<string> {
  const result = await client.callTool({
    name: "search_docs",
    arguments: args,
  });
  return (
    (result.content as Array<{ type: string; text: string }>).find(
      (c) => c.type === "text"
    )?.text ?? ""
  );
}

async function callSearchDocs(args: {
  query: string;
  limit?: number;
}): Promise<DocSearchResult[]> {
  const text = await callSearchDocsRaw(args);
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
      if (r.snippet !== undefined) expect(r.snippet.length).toBeGreaterThan(0);
    }
  });

  it("caps results at 10", async () => {
    // Use a very broad query that should match many pages
    const results = await callSearchDocs({ query: "component", limit: 10 });
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
    // A view-matched result carries a substantial excerpt, not a stub
    for (const r of results) {
      if (r.matchedView) expect(r.snippet!.trim().length).toBeGreaterThan(100);
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

describe("search_docs — toolHint coverage", () => {
  it("every result includes a toolHint", async () => {
    const results = await callSearchDocs({ query: "installation" });
    expect(results.length).toBeGreaterThan(0);
    for (const r of results) {
      expect(r.toolHint).toBeDefined();
      expect(typeof r.toolHint).toBe("string");
    }
  });

  it("returns get_docs_page hint for non-component/token/icon pages", async () => {
    const results = await callSearchDocs({ query: "installation" });
    const installPage = results.find((r) =>
      r.path.includes("getting-started/installation")
    );
    expect(installPage).toBeDefined();
    expect(installPage!.toolHint).toBe("get_docs_page");
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
    expect(buttonResult!.snippet!.toLowerCase()).toContain("buttonprops");
  });

  it("matches tokens that only appear deep in a view (past 2 KB)", async () => {
    const results = await callSearchDocs({ query: "allowFocusWhenDisabled" });
    const button = results.find((r) => r.path === "components/buttons/button");
    expect(button).toBeDefined();
    expect(button!.matchedView).toBe("dev");
    expect(button!.snippet).toContain("allowFocusWhenDisabled");
  });

  it("deep-searches every route, not just the first 30 candidates", async () => {
    // Lives in Toggle button's overview and dev views; neither reaches phase 2
    // under the old 30-candidate alphabetical gate.
    const toggle = (await callSearchDocs({ query: "activeFillStyle" })).find(
      (r) => r.path === "components/buttons/toggle-button"
    );
    expect(toggle?.snippet).toContain("activeFillStyle");

    const tabs = (await callSearchDocs({ query: "tabListAriaLabel" })).find(
      (r) => r.path === "components/navigation/tabs"
    );
    expect(tabs?.matchedView).toBe("dev");
  });

  it("snippet contains every query token when they co-occur in a view", async () => {
    const results = await callSearchDocs({ query: "isLoading setTimeout" });
    const button = results.find((r) => r.path === "components/buttons/button");
    expect(button).toBeDefined();
    expect(button!.matchedView).toBe("dev");
    expect(button!.snippet).toContain("isLoading");
    expect(button!.snippet).toContain("setTimeout");
  });

  it("ranks a deep-content full match above a shallow partial match", async () => {
    const results = await callSearchDocs({ query: "button loading state" });
    const button = results.find((r) => r.path === "components/buttons/button");
    expect(button).toBeDefined();
    expect(button!.matchedView).toBe("dev");
    expect(button!.snippet!.toLowerCase()).toContain("loading state");
  });

  it("never emits a snippet with leaked fence markers or empty JSX bodies", async () => {
    // "Box" matches Box's dev view, whose examples the old index content mangled.
    const results = await callSearchDocs({
      query: "Box flex container",
      limit: 10,
    });
    for (const r of results) {
      if (r.snippet === undefined) continue;
      expect(r.snippet).not.toMatch(/``\w/);
      expect(r.snippet).not.toMatch(/=> \(\s*\n\s*\n\s*\)/);
    }
  });
});

describe("search_docs — context budget", () => {
  const QUERIES = [
    "button",
    "component",
    "allowFocusWhenDisabled",
    "color tokens",
    "accessibility",
  ];

  it("returns at most 5 results by default and honours limit up to 10", async () => {
    expect(
      (await callSearchDocs({ query: "button" })).length
    ).toBeLessThanOrEqual(5);
    expect(
      (await callSearchDocs({ query: "button", limit: 10 })).length
    ).toBeLessThanOrEqual(10);
    expect(
      (await callSearchDocs({ query: "button", limit: 10 })).length
    ).toBeGreaterThan(5);
  });

  it("only emits a snippet when a view matched", async () => {
    const results = await callSearchDocs({
      query: "allowFocusWhenDisabled",
      limit: 10,
    });
    for (const r of results) {
      if (r.snippet !== undefined)
        expect(r.matchedView ?? "overview").toBeTruthy();
    }
    expect(
      results.filter((r) => r.snippet === undefined).length
    ).toBeGreaterThan(0);
  });

  it("never exceeds OUTPUT_BUDGET_CHARS serialized", async () => {
    for (const query of QUERIES) {
      const raw = await callSearchDocsRaw({ query, limit: 10 });
      expect(raw.length).toBeLessThanOrEqual(4000);
    }
  });

  it("keeps the top result's snippet intact under budget pressure", async () => {
    const results = await callSearchDocs({
      query: "button loading state",
      limit: 10,
    });
    expect(results[0].snippet!.length).toBeGreaterThan(300);
  });

  it("omits category", async () => {
    const results = await callSearchDocs({ query: "button" });
    for (const r of results) expect("category" in r).toBe(false);
  });
});
