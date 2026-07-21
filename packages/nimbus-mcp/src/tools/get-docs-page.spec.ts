import { describe, it, expect, beforeAll, afterAll } from "vitest";
import type { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { createTestClient } from "../test-utils.js";
import type { DocsPageResult } from "../types.js";

let client: Client;
let close: () => Promise<void>;

beforeAll(async () => {
  const ctx = createTestClient();
  await ctx.connect();
  client = ctx.client;
  close = ctx.close;
});

afterAll(() => close());

async function callGetDocsPage(args: {
  path: string;
  section?: string;
}): Promise<{ result?: DocsPageResult; error?: string; isError?: boolean }> {
  const result = await client.callTool({
    name: "get_docs_page",
    arguments: args,
  });
  const text = (result.content as Array<{ type: string; text: string }>).find(
    (c) => c.type === "text"
  )?.text;

  if (result.isError) {
    return { error: text, isError: true };
  }
  return { result: JSON.parse(text!) as DocsPageResult };
}

describe("get_docs_page — single page (no tabs)", () => {
  it("returns full content for a known route", async () => {
    const { result } = await callGetDocsPage({
      path: "home/getting-started/installation",
    });
    expect(result).toBeDefined();
    expect(result!.title).toBe("Installation");
    expect(result!.description).toBeTruthy();
    expect(result!.path).toBe("home/getting-started/installation");
    expect(result!.content.length).toBeGreaterThan(100);
  });

  it("includes sections list in metadata", async () => {
    const { result } = await callGetDocsPage({
      path: "home/getting-started/installation",
    });
    expect(result!.sections).toBeDefined();
    expect(Array.isArray(result!.sections)).toBe(true);
    expect(result!.sections.length).toBeGreaterThan(0);
  });
});

describe("get_docs_page — tabbed page", () => {
  it("returns all views concatenated when no section specified", async () => {
    const { result } = await callGetDocsPage({
      path: "components/buttons/button",
    });
    expect(result).toBeDefined();
    expect(result!.title).toBe("Button");
    expect(result!.sections.length).toBeGreaterThan(1);
    expect(result!.content.length).toBeGreaterThan(100);
  });

  it("returns a specific section when requested", async () => {
    const allViews = await callGetDocsPage({
      path: "components/buttons/button",
    });
    const single = await callGetDocsPage({
      path: "components/buttons/button",
      section: "overview",
    });
    expect(single.result).toBeDefined();
    expect(single.result!.content.length).toBeGreaterThan(0);
    expect(single.result!.content.length).toBeLessThan(
      allViews.result!.content.length
    );
  });

  it("returns error for unknown section", async () => {
    const { error, isError } = await callGetDocsPage({
      path: "components/buttons/button",
      section: "nonexistent",
    });
    expect(isError).toBe(true);
    expect(error).toContain("nonexistent");
  });
});

describe("get_docs_page — path normalization", () => {
  it("handles leading slash in path", async () => {
    const { result } = await callGetDocsPage({
      path: "/home/getting-started/installation",
    });
    expect(result).toBeDefined();
    expect(result!.title).toBe("Installation");
  });

  it("handles trailing slash in path", async () => {
    const { result } = await callGetDocsPage({
      path: "home/getting-started/installation/",
    });
    expect(result).toBeDefined();
    expect(result!.title).toBe("Installation");
  });
});

describe("get_docs_page — case-insensitive sections", () => {
  it("matches section regardless of case", async () => {
    const { result } = await callGetDocsPage({
      path: "components/buttons/button",
      section: "Overview",
    });
    expect(result).toBeDefined();
    expect(result!.content.length).toBeGreaterThan(0);
  });
});

describe("get_docs_page — error handling", () => {
  it("returns helpful error for unknown route", async () => {
    const { error, isError } = await callGetDocsPage({
      path: "this/does/not/exist",
    });
    expect(isError).toBe(true);
    expect(error).toContain("search_docs");
  });
});
