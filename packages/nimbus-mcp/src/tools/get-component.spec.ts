import { describe, it, expect, beforeAll, afterAll } from "vitest";
import type { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { createTestClient } from "../test-utils.js";
import { log } from "node:console";

/**
 * Behavioral tests for the get_component tool.
 *
 * Uses real route manifest and type data from data/docs/ (populated by the
 * prebuild step). Tests verify the tool against Button (a well-documented
 * component) and assert shapes rather than exact content to stay resilient
 * to documentation edits.
 */

async function callGetComponent(
  client: Client,
  args: { name: string; section?: string }
): Promise<{ text: string; isError?: boolean }> {
  const result = await client.callTool({
    name: "get_component",
    arguments: args,
  });
  const content = result.content as Array<{ type: string; text: string }>;
  const text = content.find((c) => c.type === "text")?.text ?? "";
  return { text, isError: result.isError as boolean | undefined };
}

// ---------------------------------------------------------------------------
// Metadata (no section)
// ---------------------------------------------------------------------------

describe("get_component — metadata", () => {
  let client: Client;
  let close: () => Promise<void>;

  beforeAll(async () => {
    const ctx = createTestClient();
    await ctx.connect();
    client = ctx.client;
    close = ctx.close;
  });

  afterAll(() => close());

  it("returns metadata and section list for a known component", async () => {
    const { text, isError } = await callGetComponent(client, {
      name: "Button",
    });
    expect(isError).toBeFalsy();

    const data = JSON.parse(text);
    expect(data.name).toBe("Button");
    expect(data.exportName).toBe("Button");
    expect(data.description).toBeTruthy();
    expect(data.path).toBe("/components/buttons/button");
    expect(Array.isArray(data.sections)).toBe(true);
    expect(data.sections).toContain("props");
    expect(data.sections).toContain("recipe");
  });

  it("is case-insensitive", async () => {
    const lower = await callGetComponent(client, { name: "button" });
    const upper = await callGetComponent(client, { name: "BUTTON" });
    expect(lower.isError).toBeFalsy();
    expect(upper.isError).toBeFalsy();

    const lowerData = JSON.parse(lower.text);
    const upperData = JSON.parse(upper.text);
    expect(lowerData.name).toBe(upperData.name);
  });

  it("returns an error for an unknown component", async () => {
    const { text, isError } = await callGetComponent(client, {
      name: "NonExistentWidget",
    });
    expect(isError).toBe(true);
    expect(text).toContain("not found");
  });

  it("includes available content sections", async () => {
    const { text } = await callGetComponent(client, { name: "Button" });
    const data = JSON.parse(text);
    // Button has overview, guidelines, implementation, accessibility + props, recipe
    expect(data.sections.length).toBeGreaterThanOrEqual(4);
  });
});

// ---------------------------------------------------------------------------
// Props section
// ---------------------------------------------------------------------------

describe("get_component — props section", () => {
  let client: Client;
  let close: () => Promise<void>;

  beforeAll(async () => {
    const ctx = createTestClient();
    await ctx.connect();
    client = ctx.client;
    close = ctx.close;
  });

  afterAll(() => close());

  it("returns filtered props for Button (not ~20 inherited ones)", async () => {
    const { text, isError } = await callGetComponent(client, {
      name: "Button",
      section: "props",
    });
    expect(isError).toBeFalsy();

    const data = JSON.parse(text);
    expect(data.component).toBe("Button");
    // Should have the full API-reference prop set (not hundreds of DOM/system props)
    expect(data.propCount).toBeLessThan(60);
    expect(data.propCount).toBeGreaterThan(0);
    expect(Array.isArray(data.props)).toBe(true);
  });

  it("includes key component-specific props", async () => {
    const { text } = await callGetComponent(client, {
      name: "Button",
      section: "props",
    });
    const data = JSON.parse(text);
    const names = data.props.map((p: { name: string }) => p.name);
    expect(names).toContain("variant");
    expect(names).toContain("size");
    expect(names).toContain("colorPalette");
  });

  it("excludes low-level DOM/Chakra system props", async () => {
    const { text } = await callGetComponent(client, {
      name: "Button",
      section: "props",
    });
    const data = JSON.parse(text);
    const names = data.props.map((p: { name: string }) => p.name);
    // Low-level DOM and internal props should be filtered out
    expect(names).not.toContain("key");
    expect(names).not.toContain("recipe");
  });

  it("each prop has the expected shape", async () => {
    const { text } = await callGetComponent(client, {
      name: "Button",
      section: "props",
    });
    const data = JSON.parse(text);
    for (const prop of data.props) {
      expect(typeof prop.name).toBe("string");
      expect(typeof prop.type).toBe("string");
      expect(typeof prop.required).toBe("boolean");
    }
  });

  it("includes default values for props that have them", async () => {
    const { text } = await callGetComponent(client, {
      name: "Button",
      section: "props",
    });
    const data = JSON.parse(text);
    const variantProp = data.props.find((p: { name: string }) => p.name === "variant");
    expect(variantProp).toBeDefined();
    expect(variantProp.defaultValue).toBe('"subtle"');
  });
});

// ---------------------------------------------------------------------------
// Accessibility section
// ---------------------------------------------------------------------------

describe("get_component — accessibility section", () => {
  let client: Client;
  let close: () => Promise<void>;

  beforeAll(async () => {
    const ctx = createTestClient();
    await ctx.connect();
    client = ctx.client;
    close = ctx.close;
  });

  afterAll(() => close());

  it("returns markdown content for Button accessibility", async () => {
    const { text, isError } = await callGetComponent(client, {
      name: "Button",
      section: "accessibility",
    });
    expect(isError).toBeFalsy();
    // Should be non-trivial markdown content
    expect(text.length).toBeGreaterThan(100);
  });
});

// ---------------------------------------------------------------------------
// Other content sections
// ---------------------------------------------------------------------------

describe("get_component — content sections", () => {
  let client: Client;
  let close: () => Promise<void>;

  beforeAll(async () => {
    const ctx = createTestClient();
    await ctx.connect();
    client = ctx.client;
    close = ctx.close;
  });

  afterAll(() => close());

  it("returns overview content", async () => {
    const { text, isError } = await callGetComponent(client, {
      name: "Button",
      section: "overview",
    });
    expect(isError).toBeFalsy();
    expect(text.length).toBeGreaterThan(100);
  });

  it("returns guidelines content", async () => {
    const { text, isError } = await callGetComponent(client, {
      name: "Button",
      section: "guidelines",
    });
    expect(isError).toBeFalsy();
    expect(text.length).toBeGreaterThan(100);
  });

  it("returns implementation content", async () => {
    const { text, isError } = await callGetComponent(client, {
      name: "Button",
      section: "implementation",
    });
    expect(isError).toBeFalsy();
    expect(text.length).toBeGreaterThan(100);
  });
});
