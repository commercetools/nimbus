import { describe, it, expect, beforeAll, afterAll } from "vitest";
import type { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { createTestClient } from "../test-utils.js";
import type { IconCatalogEntry } from "../types.js";

/**
 * Behavioral tests for the search_icons tool.
 *
 * Reads the icon catalog from data/icons.json (populated by the prebuild step).
 * Tests assert result shapes and known icon matches.
 */

async function callSearchIcons(
  client: Client,
  args: { query: string }
): Promise<IconCatalogEntry[]> {
  const result = await client.callTool({
    name: "search_icons",
    arguments: args,
  });
  const text = (result.content as Array<{ type: string; text: string }>).find(
    (c) => c.type === "text"
  )?.text;

  if (!text || text.startsWith("No icons found")) return [];
  return JSON.parse(text) as IconCatalogEntry[];
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
    const results = await callSearchIcons(client, { query: "check" });
    expect(results.length).toBeGreaterThan(0);
  });

  it("every entry has the required fields", async () => {
    const results = await callSearchIcons(client, { query: "arrow" });
    expect(results.length).toBeGreaterThan(0);
    for (const icon of results) {
      expect(typeof icon.name).toBe("string");
      expect(icon.importPath).toBe("@commercetools/nimbus-icons");
      expect(["material", "custom"]).toContain(icon.category);
      expect(Array.isArray(icon.keywords)).toBe(true);
    }
  });

  it("caps results at 20", async () => {
    // "s" is a very broad query that should match many icons
    const results = await callSearchIcons(client, { query: "s" });
    expect(results.length).toBeLessThanOrEqual(20);
  });

  it("returns fewer results for a nonsense query than a real one", async () => {
    const good = await callSearchIcons(client, { query: "arrow" });
    const bad = await callSearchIcons(client, { query: "zzqxjwvfk" });
    expect(bad.length).toBeLessThan(good.length);
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

  it('search_icons("checkmark") returns CheckCircle, Check, Done', async () => {
    const results = await callSearchIcons(client, { query: "checkmark" });
    const names = results.map((r) => r.name);
    expect(names).toContain("CheckCircle");
    expect(names).toContain("Check");
    expect(names).toContain("Done");
  });

  it("results include correct import paths", async () => {
    const results = await callSearchIcons(client, { query: "checkmark" });
    for (const icon of results) {
      expect(icon.importPath).toBe("@commercetools/nimbus-icons");
    }
  });
});
