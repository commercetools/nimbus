import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { createTestClient } from "../test-utils.js";

/**
 * Behavioral tests for the get_component tool.
 *
 * Uses real route manifest and type data (monorepo mode). Tests verify
 * the tool against Button (a well-documented component) and assert shapes
 * rather than exact content to stay resilient to documentation edits.
 *
 * Skipped when the route manifest is not available (e.g. CI without a docs build).
 */

const __dirname = dirname(fileURLToPath(import.meta.url));
const MANIFEST_PATH = resolve(
  __dirname,
  "../../../../apps/docs/src/data/route-manifest.json"
);
const HAS_MANIFEST = existsSync(MANIFEST_PATH);

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

describe.runIf(HAS_MANIFEST)("get_component — metadata", () => {
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

describe.runIf(HAS_MANIFEST)("get_component — props section", () => {
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
    // Should have roughly 7 component-specific props, not ~50 total
    expect(data.propCount).toBeLessThan(15);
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

  it("excludes inherited Chakra/React Aria props", async () => {
    const { text } = await callGetComponent(client, {
      name: "Button",
      section: "props",
    });
    const data = JSON.parse(text);
    const names = data.props.map((p: { name: string }) => p.name);
    // These are inherited and should be filtered out
    expect(names).not.toContain("as");
    expect(names).not.toContain("asChild");
    expect(names).not.toContain("css");
    expect(names).not.toContain("unstyled");
    expect(names).not.toContain("onPress");
    expect(names).not.toContain("autoFocus");
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
});

// ---------------------------------------------------------------------------
// Accessibility section
// ---------------------------------------------------------------------------

describe.runIf(HAS_MANIFEST)("get_component — accessibility section", () => {
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
// Recipe section
// ---------------------------------------------------------------------------

describe.runIf(HAS_MANIFEST)("get_component — recipe section", () => {
  let client: Client;
  let close: () => Promise<void>;

  beforeAll(async () => {
    const ctx = createTestClient();
    await ctx.connect();
    client = ctx.client;
    close = ctx.close;
  });

  afterAll(() => close());

  it("returns variant and size values for Button", async () => {
    const { text, isError } = await callGetComponent(client, {
      name: "Button",
      section: "recipe",
    });
    expect(isError).toBeFalsy();

    const data = JSON.parse(text);
    expect(data.component).toBe("Button");
    expect(data.variants).toBeDefined();
    // Button has size and variant
    expect(data.variants.size).toBeDefined();
    expect(data.variants.variant).toBeDefined();
    expect(data.variants.size.length).toBeGreaterThan(0);
    expect(data.variants.variant.length).toBeGreaterThan(0);
  });

  it("includes default variant values", async () => {
    const { text } = await callGetComponent(client, {
      name: "Button",
      section: "recipe",
    });
    const data = JSON.parse(text);
    expect(data.defaultVariants).toBeDefined();
    expect(data.defaultVariants.size).toBe("md");
    expect(data.defaultVariants.variant).toBe("subtle");
  });
});

// ---------------------------------------------------------------------------
// Other content sections
// ---------------------------------------------------------------------------

describe.runIf(HAS_MANIFEST)("get_component — content sections", () => {
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
