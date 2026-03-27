import { describe, it, expect, beforeAll, afterAll } from "vitest";
import type { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { createTestClient } from "../test-utils.js";
import type { ComponentSummary } from "../types.js";

/**
 * Behavioral tests for the list_components tool.
 *
 * Reads the route manifest from data/docs/ (populated by the prebuild step).
 * Tests are written to be resilient to new components being added — they
 * assert minimums and shapes, not exact lists.
 */

async function callListComponents(
  client: Client,
  args: { category?: string; query?: string } = {}
): Promise<ComponentSummary[]> {
  const result = await client.callTool({
    name: "list_components",
    arguments: args,
  });
  const text = (result.content as Array<{ type: string; text: string }>).find(
    (c) => c.type === "text"
  )?.text;

  if (!text || text === "No components found.") return [];
  return JSON.parse(text) as ComponentSummary[];
}

describe("list_components — no params", () => {
  let client: Client;
  let close: () => Promise<void>;

  beforeAll(async () => {
    const ctx = createTestClient();
    await ctx.connect();
    client = ctx.client;
    close = ctx.close;
  });

  afterAll(() => close());

  it("returns all individual component entries", async () => {
    const components = await callListComponents(client);
    // Route manifest currently has 69 individual components; allow for additions
    expect(components.length).toBeGreaterThanOrEqual(60);
  });

  it("every entry has the required fields", async () => {
    const components = await callListComponents(client);
    for (const c of components) {
      expect(typeof c.title).toBe("string");
      expect(typeof c.description).toBe("string");
      expect(typeof c.path).toBe("string");
    }
  });

  it("includes exportName when available", async () => {
    const components = await callListComponents(client);
    const withExportName = components.filter((c) => c.exportName);
    // Most components have exportName in their frontmatter
    expect(withExportName.length).toBeGreaterThan(0);
    for (const c of withExportName) {
      expect(typeof c.exportName).toBe("string");
    }
  });

  it("omits empty tags field (sparse response)", async () => {
    const components = await callListComponents(client);
    // If tags is present it must be non-empty
    for (const c of components) {
      if ("tags" in c) {
        expect(Array.isArray(c.tags)).toBe(true);
        expect(c.tags!.length).toBeGreaterThan(0);
      }
    }
  });
});

describe("list_components — category filter", () => {
  let client: Client;
  let close: () => Promise<void>;

  beforeAll(async () => {
    const ctx = createTestClient();
    await ctx.connect();
    client = ctx.client;
    close = ctx.close;
  });

  afterAll(() => close());

  it("filters to the matching subcategory", async () => {
    const components = await callListComponents(client, { category: "Inputs" });
    expect(components.length).toBeGreaterThan(0);
    for (const c of components) {
      expect(c.subcategory).toBe("Inputs");
    }
  });

  it("is case-insensitive", async () => {
    const lower = await callListComponents(client, { category: "inputs" });
    const upper = await callListComponents(client, { category: "INPUTS" });
    expect(lower.length).toBe(upper.length);
  });

  it("returns no results for an unknown category", async () => {
    const components = await callListComponents(client, {
      category: "nonexistent",
    });
    expect(components).toHaveLength(0);
  });

  it("includes known input components", async () => {
    const components = await callListComponents(client, { category: "Inputs" });
    const titles = components.map((c) => c.title);
    expect(titles).toContain("Select");
    expect(titles).toContain("Combo box");
    expect(titles).toContain("Text input");
  });
});

describe("list_components — query search", () => {
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
    const components = await callListComponents(client, { query: "dropdown" });
    expect(components.length).toBeGreaterThan(0);
  });

  it("includes Combo box for 'dropdown' (its description contains the word)", async () => {
    const components = await callListComponents(client, { query: "dropdown" });
    const titles = components.map((c) => c.title);
    expect(titles).toContain("Combo box");
  });

  it("returns results for a component name query", async () => {
    const components = await callListComponents(client, { query: "button" });
    const titles = components.map((c) => c.title);
    expect(titles.some((t) => t.toLowerCase().includes("button"))).toBe(true);
  });

  it("returns no results for a nonsense query", async () => {
    const components = await callListComponents(client, {
      query: "xyzzy12345",
    });
    expect(components).toHaveLength(0);
  });
});

describe("list_components — relevance ordering", () => {
  let client: Client;
  let close: () => Promise<void>;

  beforeAll(async () => {
    const ctx = createTestClient();
    await ctx.connect();
    client = ctx.client;
    close = ctx.close;
  });

  afterAll(() => close());

  it("ranks the title-match component above partial matches", async () => {
    // "Text input" has both tokens in title — should rank above components
    // that only match one token (e.g. "Text area" matches "text" but not "input")
    const results = await callListComponents(client, { query: "text input" });
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].title.toLowerCase()).toContain("text input");
  });

  it("ranks the exact title match first for a single-word query", async () => {
    // "Button" is the exact title — should outrank "Icon Button", "Toggle Button", etc.
    const results = await callListComponents(client, { query: "select" });
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].title.toLowerCase()).toBe("select");
  });
});
