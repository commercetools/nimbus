import { describe, it, expect, beforeAll, afterAll } from "vitest";
import type { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { createTestClient } from "../test-utils.js";

/**
 * Behavioral tests for the get_component tool.
 *
 * Uses real route manifest and type data from data/docs/ (populated by the
 * prebuild step). Tests verify the tool against Button (a well-documented
 * component) and assert shapes rather than exact content to stay resilient
 * to documentation edits.
 *
 * A single MCP client connection is shared across all describe blocks since
 * the server is stateless.
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

async function callGetComponent(args: {
  name: string;
  section?: string;
}): Promise<{ text: string; isError?: boolean }> {
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
  it("returns metadata and section list for a known component", async () => {
    const { text, isError } = await callGetComponent({ name: "Button" });
    expect(isError).toBeFalsy();

    const data = JSON.parse(text);
    expect(data.name).toBe("Button");
    expect(data.exportName).toBe("Button");
    expect(data.description).toBeTruthy();
    expect(data.path).toBe("/components/buttons/button");
    expect(Array.isArray(data.sections)).toBe(true);
    expect(data.sections).toContain("props");
  });

  it("is case-insensitive", async () => {
    const lower = await callGetComponent({ name: "button" });
    const upper = await callGetComponent({ name: "BUTTON" });
    expect(lower.isError).toBeFalsy();
    expect(upper.isError).toBeFalsy();

    const lowerData = JSON.parse(lower.text);
    const upperData = JSON.parse(upper.text);
    expect(lowerData.name).toBe(upperData.name);
  });

  it("returns an error for an unknown component", async () => {
    const { text, isError } = await callGetComponent({
      name: "NonExistentWidget",
    });
    expect(isError).toBe(true);
    expect(text).toContain("not found");
  });

  it("includes available content sections", async () => {
    const { text } = await callGetComponent({ name: "Button" });
    const data = JSON.parse(text);
    // Button has overview, guidelines, implementation, accessibility + props, recipe
    expect(data.sections.length).toBeGreaterThanOrEqual(4);
  });
});

// ---------------------------------------------------------------------------
// Props section
// ---------------------------------------------------------------------------

describe("get_component — props section", () => {
  it("returns filtered props for Button (not ~20 inherited ones)", async () => {
    const { text, isError } = await callGetComponent({
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
    const { text } = await callGetComponent({
      name: "Button",
      section: "props",
    });
    const data = JSON.parse(text);
    const names = data.props.map((p: { name: string }) => p.name);
    expect(names).toContain("variant");
    expect(names).toContain("size");
    expect(names).toContain("colorPalette");
    expect(names).toContain("isDisabled");
  });

  it("excludes low-level DOM/Chakra system props", async () => {
    const { text } = await callGetComponent({
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
    const { text } = await callGetComponent({
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
    const { text } = await callGetComponent({
      name: "Button",
      section: "props",
    });
    const data = JSON.parse(text);
    const variantProp = data.props.find(
      (p: { name: string }) => p.name === "variant"
    );
    expect(variantProp).toBeDefined();
    expect(variantProp.defaultValue).toBe('"subtle"');
  });
});

// ---------------------------------------------------------------------------
// Compound component props (sub-component aggregation)
// ---------------------------------------------------------------------------

describe("get_component — compound component props", () => {
  it("returns aggregated props for a compound component (Drawer)", async () => {
    const { text, isError } = await callGetComponent({
      name: "Drawer",
      section: "props",
    });
    expect(isError).toBeFalsy();

    const data = JSON.parse(text);
    expect(data.component).toBe("Drawer");
    expect(data.propCount).toBeGreaterThan(0);
    expect(Array.isArray(data.props)).toBe(true);
  });

  it("tags each prop with its subComponent name", async () => {
    const { text } = await callGetComponent({
      name: "Drawer",
      section: "props",
    });
    const data = JSON.parse(text);
    for (const prop of data.props) {
      expect(typeof prop.subComponent).toBe("string");
      expect(prop.subComponent.toLowerCase()).toMatch(/^drawer/);
    }
  });

  it("includes known Drawer props (e.g. isOpen from DrawerRoot)", async () => {
    const { text } = await callGetComponent({
      name: "Drawer",
      section: "props",
    });
    const data = JSON.parse(text);
    const names = data.props.map((p: { name: string }) => p.name);
    expect(names).toContain("isOpen");
  });

  it("does not include standalone top-level components as sub-components (Icon)", async () => {
    const { text } = await callGetComponent({
      name: "Icon",
      section: "props",
    });
    const data = JSON.parse(text);
    const subComponents = [
      ...new Set(
        data.props
          .map((p: { subComponent?: string }) => p.subComponent)
          .filter(Boolean)
      ),
    ];
    // IconButton and IconToggleButton are standalone components, not sub-components of Icon
    expect(subComponents).not.toContain("IconButton");
    expect(subComponents).not.toContain("IconToggleButton");
  });

  it("does not include *Props type files as sub-components (Steps)", async () => {
    const { text } = await callGetComponent({
      name: "Steps",
      section: "props",
    });
    const data = JSON.parse(text);
    const subComponents = [
      ...new Set(
        data.props
          .map((p: { subComponent?: string }) => p.subComponent)
          .filter(Boolean)
      ),
    ] as string[];
    // *Props files are type-only duplicates and should be excluded
    expect(subComponents.some((s) => s.endsWith("Props"))).toBe(false);
  });

  it("does not include method exports as sub-components (FieldErrors)", async () => {
    const { text } = await callGetComponent({
      name: "FieldErrors",
      section: "props",
    });
    const data = JSON.parse(text);
    const subComponents = [
      ...new Set(
        data.props
          .map((p: { subComponent?: string }) => p.subComponent)
          .filter(Boolean)
      ),
    ] as string[];
    // Method exports like FieldErrors.getBuiltInMessage should be excluded
    expect(subComponents.some((s) => s.includes("."))).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Accessibility section
// ---------------------------------------------------------------------------

describe("get_component — accessibility section", () => {
  it("returns markdown content for Button accessibility", async () => {
    const { text, isError } = await callGetComponent({
      name: "Button",
      section: "accessibility",
    });
    expect(isError).toBeFalsy();
    // Should be non-trivial content
    expect(text.length).toBeGreaterThan(100);
  });
});

// ---------------------------------------------------------------------------
// Other content sections
// ---------------------------------------------------------------------------

describe("get_component — content sections", () => {
  it("returns overview content", async () => {
    const { text, isError } = await callGetComponent({
      name: "Button",
      section: "overview",
    });
    expect(isError).toBeFalsy();
    expect(text.length).toBeGreaterThan(100);
  });

  it("returns guidelines content", async () => {
    const { text, isError } = await callGetComponent({
      name: "Button",
      section: "guidelines",
    });
    expect(isError).toBeFalsy();
    expect(text.length).toBeGreaterThan(100);
  });

  it("returns implementation content", async () => {
    const { text, isError } = await callGetComponent({
      name: "Button",
      section: "implementation",
    });
    expect(isError).toBeFalsy();
    expect(text.length).toBeGreaterThan(100);
  });

  it("section content has fence markers stripped but code content preserved", async () => {
    // implementation (dev) view is richest in MDX markup — verify stripping works
    const { text, isError } = await callGetComponent({
      name: "Button",
      section: "implementation",
    });
    expect(isError).toBeFalsy();
    // Fenced code block fence markers must be stripped
    expect(text).not.toContain("```");
    // But code content (e.g. import paths) must still be present for LLM usefulness
    expect(text).toContain("Button");
  });
});
