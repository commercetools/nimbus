/**
 * MCP Tool Evaluation Suite
 *
 * Tests the nimbus-mcp tools against realistic UIKit fixture files to evaluate:
 * 1. Migration coverage — does every imported component get a mapping?
 * 2. Field richness — are propMappings, callbackAdapters, etc. present?
 * 3. Style props — are styleProps hints surfaced for eligible components?
 * 4. Layout guidance — is layoutGuidance hoisted for nested layout patterns?
 * 5. A/B comparison — when the published version is installed, compare responses.
 *
 * Run: pnpm --filter mcp-eval eval
 */

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  createLocalClient,
  createPublishedClient,
  type EvalClient,
} from "./helpers/create-client.js";
import {
  compareResponses,
  formatComparison,
  countFieldPresence,
} from "./helpers/compare.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------------------
// Fixture paths
// ---------------------------------------------------------------------------

const FIXTURES = {
  productList: resolve(__dirname, "fixtures/product-list-view.tsx"),
  productDetail: resolve(__dirname, "fixtures/product-detail-form.tsx"),
};

// ---------------------------------------------------------------------------
// Tricky single-component scenarios to test via componentName mode
// ---------------------------------------------------------------------------

const COMPONENT_SCENARIOS = [
  // propShapeTransforms + callbackAdapters + codeReduction
  { name: "DataTable", expectFields: ["propShapeTransforms", "codeReduction"] },
  // compound mapping → Accordion
  {
    name: "CollapsiblePanel",
    expectFields: ["breakingChanges"],
  },
  // callbackAdapter (TCustomEvent → Key)
  { name: "SelectInput", expectFields: ["callbackAdapters"] },
  // callbackAdapter (string → CalendarDate)
  { name: "DateRangeInput", expectFields: ["callbackAdapters", "typeNotes"] },
  // callbackAdapter (event → MoneyInputValue)
  { name: "MoneyInput", expectFields: ["callbackAdapters"] },
  // callbackAdapter (event → number)
  { name: "NumberInput", expectFields: ["callbackAdapters"] },
  // propMigrations (label → children, iconLeft/Right → children)
  { name: "PrimaryButton", expectFields: ["propMappings", "propMigrations"] },
  // iconWrapper
  { name: "Icon Library", expectFields: ["iconWrapper"] },
  // layoutGuidance (compound root)
  { name: "Spacings", expectCompound: true },
  // style-props-enabled target
  { name: "Avatar", expectStyleProps: true },
  // localized input
  { name: "LocalizedTextInput", expectFields: ["callbackAdapters"] },
];

// ---------------------------------------------------------------------------
// Client setup
// ---------------------------------------------------------------------------

let local: EvalClient;
let published: EvalClient | null;

beforeAll(async () => {
  local = createLocalClient();
  await local.connect();

  published = await createPublishedClient();
  if (published) {
    await published.connect();
    console.log("✅ Published MCP client connected — A/B comparison enabled");
  } else {
    console.log(
      "ℹ️  Published MCP not installed — running local-only eval. " +
        'Install with: pnpm --filter mcp-eval add -D "nimbus-mcp-published@npm:@commercetools/nimbus-mcp@latest"'
    );
  }
});

afterAll(async () => {
  await local.close();
  if (published) await published.close();
});

// ---------------------------------------------------------------------------
// Helper to call tools
// ---------------------------------------------------------------------------

async function callTool(
  client: EvalClient,
  toolName: string,
  args: Record<string, unknown>
): Promise<{
  text: string;
  parsed: Record<string, unknown>;
  isError?: boolean;
}> {
  const result = await client.client.callTool({
    name: toolName,
    arguments: args,
  });
  const content = result.content as Array<{ type: string; text: string }>;
  const text = content.find((c) => c.type === "text")?.text ?? "";
  let parsed: Record<string, unknown> = {};
  try {
    parsed = JSON.parse(text);
  } catch {
    // not JSON — that's fine for error messages
  }
  return { text, parsed, isError: result.isError as boolean | undefined };
}

// ---------------------------------------------------------------------------
// File-level migration eval
// ---------------------------------------------------------------------------

describe("migrate_from_uikit — product-list-view.tsx", () => {
  it("returns mappings for all UIKit imports", async () => {
    const { parsed, isError } = await callTool(local, "migrate_from_uikit", {
      filePath: FIXTURES.productList,
    });
    expect(isError).toBeFalsy();

    const mappings = parsed.mappings as Array<Record<string, unknown>>;
    const unmapped = parsed.unmapped as Array<Record<string, unknown>>;

    // Should have mappings for the key components
    const mappedNames = mappings.map((m) => m.uiKitName);
    expect(mappedNames).toContain("PrimaryButton");
    expect(mappedNames).toContain("SecondaryButton");
    expect(mappedNames).toContain("FlatButton");
    expect(mappedNames).toContain("IconButton");
    expect(mappedNames).toContain("SearchTextInput");
    expect(mappedNames).toContain("SelectInput");
    expect(mappedNames).toContain("DataTable");
    expect(mappedNames).toContain("CollapsiblePanel");
    expect(mappedNames).toContain("Stamp");
    expect(mappedNames).toContain("Avatar");
    expect(mappedNames).toContain("Pagination");

    console.log(
      `  product-list-view: ${mappings.length} mapped, ${unmapped.length} unmapped`
    );
    if (unmapped.length > 0) {
      console.log(`  Unmapped: ${unmapped.map((u) => u.name).join(", ")}`);
    }

    // Coverage: the majority of imports should have mappings
    const coverageRatio = mappings.length / (mappings.length + unmapped.length);
    console.log(`  Coverage: ${Math.round(coverageRatio * 100)}%`);
    expect(coverageRatio).toBeGreaterThan(0.7);
  });

  it("includes layoutGuidance for nested Spacings/Constraints", async () => {
    const { parsed } = await callTool(local, "migrate_from_uikit", {
      filePath: FIXTURES.productList,
    });
    expect(parsed.layoutGuidance).toBeDefined();
    expect(typeof parsed.layoutGuidance).toBe("string");
  });

  it("includes rich migration data for DataTable", async () => {
    const { parsed } = await callTool(local, "migrate_from_uikit", {
      filePath: FIXTURES.productList,
    });
    const mappings = parsed.mappings as Array<Record<string, unknown>>;
    const dt = mappings.find((m) => m.uiKitName === "DataTable");
    expect(dt).toBeDefined();
    expect(dt!.propShapeTransforms).toBeDefined();
    expect(dt!.codeReduction).toBeDefined();
  });

  it("surfaces styleProps for eligible components", async () => {
    const { parsed } = await callTool(local, "migrate_from_uikit", {
      filePath: FIXTURES.productList,
    });
    const mappings = parsed.mappings as Array<Record<string, unknown>>;
    const withStyleProps = countFieldPresence(mappings, "styleProps");
    console.log(
      `  product-list-view: ${withStyleProps}/${mappings.length} components have styleProps hint`
    );
    // At least Avatar should have it
    const avatar = mappings.find((m) => m.uiKitName === "Avatar");
    expect(avatar?.styleProps).toBeDefined();
  });
});

describe("migrate_from_uikit — product-detail-form.tsx", () => {
  it("returns mappings for all UIKit imports", async () => {
    const { parsed, isError } = await callTool(local, "migrate_from_uikit", {
      filePath: FIXTURES.productDetail,
    });
    expect(isError).toBeFalsy();

    const mappings = parsed.mappings as Array<Record<string, unknown>>;
    const unmapped = parsed.unmapped as Array<Record<string, unknown>>;

    const mappedNames = mappings.map((m) => m.uiKitName);
    expect(mappedNames).toContain("MoneyInput");
    expect(mappedNames).toContain("NumberInput");
    expect(mappedNames).toContain("LocalizedTextInput");
    expect(mappedNames).toContain("LocalizedMultilineTextInput");
    expect(mappedNames).toContain("ContentNotification");
    expect(mappedNames).toContain("Card");

    console.log(
      `  product-detail-form: ${mappings.length} mapped, ${unmapped.length} unmapped`
    );
    if (unmapped.length > 0) {
      console.log(
        `  Unmapped: ${unmapped.map((u: Record<string, unknown>) => u.name).join(", ")}`
      );
    }
    const coverageRatio = mappings.length / (mappings.length + unmapped.length);
    console.log(`  Coverage: ${Math.round(coverageRatio * 100)}%`);
    expect(coverageRatio).toBeGreaterThan(0.7);
  });

  it("includes callbackAdapters for MoneyInput and NumberInput", async () => {
    const { parsed } = await callTool(local, "migrate_from_uikit", {
      filePath: FIXTURES.productDetail,
    });
    const mappings = parsed.mappings as Array<Record<string, unknown>>;

    const money = mappings.find((m) => m.uiKitName === "MoneyInput");
    expect(money?.callbackAdapters).toBeDefined();

    const number = mappings.find((m) => m.uiKitName === "NumberInput");
    expect(number?.callbackAdapters).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// Single-component eval
// ---------------------------------------------------------------------------

describe("migrate_from_uikit — component-level scenarios", () => {
  for (const scenario of COMPONENT_SCENARIOS) {
    if (scenario.expectCompound) {
      it(`returns compound mappings for ${scenario.name}`, async () => {
        const { parsed, isError } = await callTool(
          local,
          "migrate_from_uikit",
          { componentName: scenario.name }
        );
        expect(isError).toBeFalsy();
        expect(parsed.compoundRoot).toBe(scenario.name);
        expect(Array.isArray(parsed.mappings)).toBe(true);
        const mappings = parsed.mappings as Array<Record<string, unknown>>;
        expect(mappings.length).toBeGreaterThan(0);
        console.log(
          `  ${scenario.name}: ${mappings.length} sub-component mappings`
        );
      });
      continue;
    }

    it(`returns rich data for ${scenario.name}`, async () => {
      const { parsed, isError } = await callTool(local, "migrate_from_uikit", {
        componentName: scenario.name,
      });
      expect(isError).toBeFalsy();

      if (scenario.expectFields) {
        for (const field of scenario.expectFields) {
          expect(
            parsed[field],
            `Expected ${scenario.name} to have ${field}`
          ).toBeDefined();
        }
      }

      if (scenario.expectStyleProps) {
        expect(
          parsed.styleProps,
          `Expected ${scenario.name} to have styleProps`
        ).toBeDefined();
      }
    });
  }
});

// ---------------------------------------------------------------------------
// get_component eval (style props)
// ---------------------------------------------------------------------------

describe("get_component — style props coverage", () => {
  const STYLE_PROPS_COMPONENTS = ["Box", "Avatar", "Badge", "Text", "Stack"];
  const NO_STYLE_PROPS = ["Button", "Pagination", "Menu"];

  for (const name of STYLE_PROPS_COMPONENTS) {
    it(`${name} metadata includes styleProps hint`, async () => {
      const { parsed, isError } = await callTool(local, "get_component", {
        name,
      });
      if (isError) return; // component might not exist
      expect(parsed.styleProps).toBeDefined();
    });
  }

  for (const name of NO_STYLE_PROPS) {
    it(`${name} metadata omits styleProps`, async () => {
      const { parsed, isError } = await callTool(local, "get_component", {
        name,
      });
      if (isError) return;
      expect(parsed.styleProps).toBeUndefined();
    });
  }
});

// ---------------------------------------------------------------------------
// get_docs_page eval (style props landing page)
// ---------------------------------------------------------------------------

describe("get_docs_page — style props landing page", () => {
  it("returns enriched content with prop index", async () => {
    const { parsed } = await callTool(local, "get_docs_page", {
      path: "home/style-props",
    });
    const content = parsed.content as string;
    expect(content).toContain("Style Props Index");
    expect(content).toContain("Spacing");
    expect(content).toContain("padding");
    // Count categories mentioned
    const categoryCount = (content.match(/home\/style-props\//g) || []).length;
    expect(categoryCount).toBeGreaterThanOrEqual(10);
    console.log(`  style-props landing: ${categoryCount} categories in index`);
  });
});

// ---------------------------------------------------------------------------
// A/B comparison (only runs when published version is installed)
// ---------------------------------------------------------------------------

describe("A/B comparison — local vs published", () => {
  it("compares file migration for product-list-view", async () => {
    if (!published) return;

    const localResult = await callTool(local, "migrate_from_uikit", {
      filePath: FIXTURES.productList,
    });
    const pubResult = await callTool(published, "migrate_from_uikit", {
      filePath: FIXTURES.productList,
    });

    const comparison = compareResponses(
      "product-list-view (file)",
      "migrate_from_uikit",
      localResult.parsed,
      pubResult.parsed
    );
    console.log(formatComparison(comparison));

    // Local should have at least as many fields as published
    expect(comparison.localFieldCount).toBeGreaterThanOrEqual(
      comparison.publishedFieldCount
    );
  });

  it("compares component lookups for key components", async () => {
    if (!published) return;

    const components = [
      "DataTable",
      "PrimaryButton",
      "Avatar",
      "CollapsiblePanel",
    ];

    for (const name of components) {
      const localResult = await callTool(local, "migrate_from_uikit", {
        componentName: name,
      });
      const pubResult = await callTool(published, "migrate_from_uikit", {
        componentName: name,
      });

      const comparison = compareResponses(
        name,
        "migrate_from_uikit",
        localResult.parsed,
        pubResult.parsed
      );
      console.log(formatComparison(comparison));
    }
  });

  it("compares get_component metadata", async () => {
    if (!published) return;

    const components = ["Box", "Button", "Drawer"];

    for (const name of components) {
      const localResult = await callTool(local, "get_component", { name });
      const pubResult = await callTool(published, "get_component", { name });

      const comparison = compareResponses(
        name,
        "get_component",
        localResult.parsed,
        pubResult.parsed
      );
      console.log(formatComparison(comparison));
    }
  });
});
