/**
 * Runs all MCP eval dimensions and writes results to public/eval-results.json.
 * This is consumed by the Vite dashboard app.
 *
 * Each dimension evaluates a different aspect of the nimbus-mcp server:
 * - migration/uikit: UIKit → Nimbus migration quality (file + component level)
 * - component-docs: get_component tool response quality
 * - docs-pages: get_docs_page tool response quality (style props landing, etc.)
 *
 * New dimensions (migration sources, search quality, token lookup, etc.) can be
 * added by defining a new run function and adding it to the dimensions array.
 *
 * Usage: tsx scripts/run-eval.ts
 */

import { writeFileSync, mkdirSync, readdirSync, readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { createServer } from "@commercetools/nimbus-mcp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const FIXTURES_DIR = resolve(ROOT, "src/fixtures");

// ---------------------------------------------------------------------------
// MCP client setup
// ---------------------------------------------------------------------------

async function createClient() {
  const server = createServer();
  const [ct, st] = InMemoryTransport.createLinkedPair();
  const client = new Client(
    { name: "eval-runner", version: "1.0.0" },
    { capabilities: {} }
  );
  await server.connect(st);
  await client.connect(ct);
  return client;
}

async function callTool(
  client: Client,
  name: string,
  args: Record<string, unknown>
) {
  const result = await client.callTool({ name, arguments: args });
  const text =
    (result.content as Array<{ type: string; text: string }>).find(
      (c) => c.type === "text"
    )?.text ?? "";
  try {
    return { data: JSON.parse(text), isError: result.isError };
  } catch {
    return { data: { raw: text }, isError: result.isError };
  }
}

// ---------------------------------------------------------------------------
// Shared types
// ---------------------------------------------------------------------------

interface MappingResult {
  uiKitName: string;
  nimbusEquivalent: string | null;
  importPath: string | null;
  mappingType: string;
  styleProps?: string;
  propMappings?: unknown[];
  callbackAdapters?: unknown[];
  propShapeTransforms?: unknown[];
  codeReduction?: unknown;
  propMigrations?: unknown[];
  iconWrapper?: unknown;
  layoutGuidance?: string;
  typeNotes?: string[];
  hint?: string;
  breakingChanges: string[];
  notes: string;
}

// ---------------------------------------------------------------------------
// Dimension: migration/uikit
// ---------------------------------------------------------------------------

interface FileMigrationResult {
  source: string;
  fixture: string;
  filePath: string;
  mappings: MappingResult[];
  unmapped: Array<{
    name: string;
    suggestion?: { name: string; confidence: string };
  }>;
  layoutGuidance?: string;
  coverage: number;
  stylePropsCount: number;
}

interface ComponentLookupResult {
  source: string;
  name: string;
  data: Record<string, unknown>;
  hasStyleProps: boolean;
  fields: string[];
}

interface MigrationDimension {
  kind: "migration";
  source: string;
  label: string;
  fileMigrations: FileMigrationResult[];
  componentLookups: ComponentLookupResult[];
}

/** Discovers fixture files for a migration source. */
function discoverFixtures(
  source: string
): Array<{ name: string; path: string }> {
  const dir = resolve(FIXTURES_DIR, source);
  try {
    return readdirSync(dir)
      .filter((f) => f.endsWith(".tsx") || f.endsWith(".ts"))
      .map((f) => ({
        name: f.replace(/\.tsx?$/, ""),
        path: resolve(dir, f),
      }));
  } catch {
    return [];
  }
}

/** UIKit-specific component scenarios. */
const UIKIT_COMPONENT_SCENARIOS = [
  { name: "DataTable", expectFields: ["propShapeTransforms", "codeReduction"] },
  { name: "CollapsiblePanel", expectFields: ["breakingChanges"] },
  { name: "SelectInput", expectFields: ["callbackAdapters"] },
  { name: "DateRangeInput", expectFields: ["callbackAdapters", "typeNotes"] },
  { name: "MoneyInput", expectFields: ["callbackAdapters"] },
  { name: "NumberInput", expectFields: ["callbackAdapters"] },
  { name: "PrimaryButton", expectFields: ["propMappings", "propMigrations"] },
  { name: "Icon Library", expectFields: ["iconWrapper"] },
  { name: "Avatar", expectFields: ["styleProps"] },
  { name: "LocalizedTextInput", expectFields: ["callbackAdapters"] },
];

async function runMigrationDimension(
  client: Client,
  source: string,
  label: string,
  componentScenarios: Array<{ name: string; expectFields?: string[] }>
): Promise<MigrationDimension> {
  const fixtures = discoverFixtures(source);

  const fileMigrations: FileMigrationResult[] = [];
  for (const f of fixtures) {
    const { data } = await callTool(client, "migrate_from_uikit", {
      filePath: f.path,
    });
    const mappings = (data.mappings ?? []) as MappingResult[];
    const unmapped = (data.unmapped ?? []) as Array<{ name: string }>;
    fileMigrations.push({
      source,
      fixture: f.name,
      filePath: f.path,
      mappings,
      unmapped,
      layoutGuidance: data.layoutGuidance as string | undefined,
      coverage:
        mappings.length / Math.max(mappings.length + unmapped.length, 1),
      stylePropsCount: mappings.filter((m) => m.styleProps).length,
    });
  }

  const componentLookups: ComponentLookupResult[] = [];
  for (const scenario of componentScenarios) {
    const { data } = await callTool(client, "migrate_from_uikit", {
      componentName: scenario.name,
    });
    componentLookups.push({
      source,
      name: scenario.name,
      data: data as Record<string, unknown>,
      hasStyleProps: !!data.styleProps,
      fields: Object.keys(data),
    });
  }

  return { kind: "migration", source, label, fileMigrations, componentLookups };
}

// ---------------------------------------------------------------------------
// Dimension: component-docs
// ---------------------------------------------------------------------------

interface ComponentDocResult {
  name: string;
  hasStyleProps: boolean;
  styleProps?: string;
  sections: string[];
  hasDescription: boolean;
}

interface ComponentDocsDimension {
  kind: "component-docs";
  label: string;
  components: ComponentDocResult[];
}

async function runComponentDocsDimension(
  client: Client
): Promise<ComponentDocsDimension> {
  const checkComponents = [
    "Box",
    "Avatar",
    "Badge",
    "Text",
    "Stack",
    "Button",
    "Pagination",
    "Menu",
    "Select",
    "Checkbox",
    "Drawer",
    "Card",
    "Icon",
    "LoadingSpinner",
  ];

  const components: ComponentDocResult[] = [];
  for (const name of checkComponents) {
    const { data, isError } = await callTool(client, "get_component", { name });
    if (isError) {
      components.push({
        name,
        hasStyleProps: false,
        sections: [],
        hasDescription: false,
      });
    } else {
      components.push({
        name,
        hasStyleProps: !!data.styleProps,
        styleProps: data.styleProps as string | undefined,
        sections: (data.sections as string[]) ?? [],
        hasDescription: !!data.description,
      });
    }
  }

  return {
    kind: "component-docs",
    label: "Component Documentation",
    components,
  };
}

// ---------------------------------------------------------------------------
// Dimension: docs-pages
// ---------------------------------------------------------------------------

interface DocsPageCheck {
  path: string;
  label: string;
  hasStyleProps: boolean;
  contentLength: number;
  /** Extra data specific to the check (e.g. category count for style-props). */
  extra?: Record<string, unknown>;
}

interface DocsPagesDimension {
  kind: "docs-pages";
  label: string;
  pages: DocsPageCheck[];
}

async function runDocsPagesDimension(
  client: Client
): Promise<DocsPagesDimension> {
  const checks = [
    { path: "home/style-props", label: "Style Props Landing" },
    { path: "home/style-props/spacing", label: "Style Props / Spacing" },
    { path: "home/getting-started/installation", label: "Installation" },
    { path: "components/layout/box", label: "Box (component page)" },
    { path: "components/buttons/button", label: "Button (component page)" },
  ];

  const pages: DocsPageCheck[] = [];
  for (const check of checks) {
    const { data, isError } = await callTool(client, "get_docs_page", {
      path: check.path,
    });
    if (isError) {
      pages.push({
        path: check.path,
        label: check.label,
        hasStyleProps: false,
        contentLength: 0,
      });
      continue;
    }

    const content = (data.content as string) ?? "";
    const result: DocsPageCheck = {
      path: check.path,
      label: check.label,
      hasStyleProps: !!data.styleProps,
      contentLength: content.length,
    };

    // Extra data for the style-props landing page
    if (check.path === "home/style-props") {
      const categoryCount = (content.match(/home\/style-props\//g) || [])
        .length;
      result.extra = { categoryCount };
    }

    pages.push(result);
  }

  return { kind: "docs-pages", label: "Documentation Pages", pages };
}

// ---------------------------------------------------------------------------
// Top-level results
// ---------------------------------------------------------------------------

type EvalDimension =
  MigrationDimension | ComponentDocsDimension | DocsPagesDimension;

interface StylePropCategory {
  name: string;
  path: string;
  props: string[];
}

/** Side-by-side comparison of a single tool call between local and published. */
interface McpComparison {
  /** Human label for this scenario. */
  label: string;
  tool: string;
  args: Record<string, unknown>;
  local: Record<string, unknown>;
  published: Record<string, unknown>;
  /** Fields only in local. */
  addedFields: string[];
  /** Fields only in published. */
  removedFields: string[];
  /** Fields in both but different. */
  changedFields: string[];
}

interface EvalResults {
  timestamp: string;
  dimensions: EvalDimension[];
  /** Pre-built style props summary for display in the dashboard. */
  stylePropCategories: StylePropCategory[];
  /** Side-by-side comparisons of local vs published MCP. Null when published not installed. */
  mcpComparisons: McpComparison[] | null;
}

// ---------------------------------------------------------------------------
// Run all dimensions
// ---------------------------------------------------------------------------

/** Try to create a published MCP client. Returns null if not installed. */
async function createPublishedClient(): Promise<Client | null> {
  try {
    const mod = await import(
      // @ts-expect-error — alias may not be installed
      "nimbus-mcp-published"
    );
    const server = mod.createServer();
    const [ct, st] = InMemoryTransport.createLinkedPair();
    const client = new Client(
      { name: "eval-published", version: "1.0.0" },
      { capabilities: {} }
    );
    await server.connect(st);
    await client.connect(ct);
    return client;
  } catch {
    return null;
  }
}

function diffFields(
  local: Record<string, unknown>,
  published: Record<string, unknown>
): { addedFields: string[]; removedFields: string[]; changedFields: string[] } {
  const allKeys = new Set([...Object.keys(local), ...Object.keys(published)]);
  const addedFields: string[] = [];
  const removedFields: string[] = [];
  const changedFields: string[] = [];

  for (const key of allKeys) {
    const inLocal = key in local;
    const inPublished = key in published;
    if (inLocal && !inPublished) addedFields.push(key);
    else if (!inLocal && inPublished) removedFields.push(key);
    else if (JSON.stringify(local[key]) !== JSON.stringify(published[key]))
      changedFields.push(key);
  }
  return { addedFields, removedFields, changedFields };
}

/** Run side-by-side comparisons of local vs published MCP. */
async function runMcpComparisons(
  localClient: Client,
  publishedClient: Client
): Promise<McpComparison[]> {
  const scenarios: Array<{
    label: string;
    tool: string;
    args: Record<string, unknown>;
  }> = [
    // File-level migrations
    ...discoverFixtures("uikit").map((f) => ({
      label: `File: ${f.name}`,
      tool: "migrate_from_uikit",
      args: { filePath: f.path },
    })),
    // Component lookups
    ...[
      "DataTable",
      "PrimaryButton",
      "Avatar",
      "CollapsiblePanel",
      "SelectInput",
      "MoneyInput",
    ].map((name) => ({
      label: `Component: ${name}`,
      tool: "migrate_from_uikit",
      args: { componentName: name },
    })),
    // get_component
    ...["Box", "Button", "Drawer"].map((name) => ({
      label: `get_component: ${name}`,
      tool: "get_component",
      args: { name },
    })),
    // Docs pages
    {
      label: "Docs: style-props landing",
      tool: "get_docs_page",
      args: { path: "home/style-props" },
    },
    {
      label: "Docs: Box component",
      tool: "get_docs_page",
      args: { path: "components/layout/box" },
    },
  ];

  const comparisons: McpComparison[] = [];
  for (const s of scenarios) {
    const [localResult, pubResult] = await Promise.all([
      callTool(localClient, s.tool, s.args),
      callTool(publishedClient, s.tool, s.args),
    ]);

    const diff = diffFields(
      localResult.data as Record<string, unknown>,
      pubResult.data as Record<string, unknown>
    );

    comparisons.push({
      label: s.label,
      tool: s.tool,
      args: s.args,
      local: localResult.data as Record<string, unknown>,
      published: pubResult.data as Record<string, unknown>,
      ...diff,
    });
  }

  return comparisons;
}

async function runAllDimensions(): Promise<EvalResults> {
  const client = await createClient();

  const dimensions: EvalDimension[] = [];

  // Migration dimensions — add new sources here
  dimensions.push(
    await runMigrationDimension(
      client,
      "uikit",
      "UI Kit → Nimbus",
      UIKIT_COMPONENT_SCENARIOS
    )
  );

  // Component documentation quality
  dimensions.push(await runComponentDocsDimension(client));

  // Docs page quality
  dimensions.push(await runDocsPagesDimension(client));

  // A/B comparison with published MCP
  let mcpComparisons: McpComparison[] | null = null;
  const publishedClient = await createPublishedClient();
  if (publishedClient) {
    console.log("[eval] Published MCP detected — running A/B comparisons...");
    mcpComparisons = await runMcpComparisons(client, publishedClient);
    console.log(`[eval] ${mcpComparisons.length} comparisons complete`);
    await publishedClient.close();
  } else {
    console.log(
      '[eval] Published MCP not installed — skip A/B. Install with: pnpm --filter mcp-eval add -D "nimbus-mcp-published@npm:@commercetools/nimbus-mcp@latest"'
    );
  }

  await client.close();

  // Load style props summary for the dashboard
  let stylePropCategories: StylePropCategory[] = [];
  try {
    const summaryPath = resolve(
      ROOT,
      "../../packages/nimbus-mcp/data/style-props-summary.json"
    );
    const summary = JSON.parse(readFileSync(summaryPath, "utf-8"));
    stylePropCategories = summary.categories;
  } catch {
    console.warn("[eval] Could not load style-props-summary.json");
  }

  return {
    timestamp: new Date().toISOString(),
    dimensions,
    stylePropCategories,
    mcpComparisons,
  };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

console.log("[eval] Running MCP eval dimensions...");
const results = await runAllDimensions();
const outDir = resolve(ROOT, "public");
mkdirSync(outDir, { recursive: true });
const outPath = resolve(outDir, "eval-results.json");
writeFileSync(outPath, JSON.stringify(results, null, 2), "utf-8");

// Summary
for (const dim of results.dimensions) {
  if (dim.kind === "migration") {
    const totalMapped = dim.fileMigrations.reduce(
      (s, f) => s + f.mappings.length,
      0
    );
    const totalUnmapped = dim.fileMigrations.reduce(
      (s, f) => s + f.unmapped.length,
      0
    );
    console.log(
      `[eval] ${dim.label}: ${dim.fileMigrations.length} fixtures (${totalMapped} mapped, ${totalUnmapped} unmapped), ${dim.componentLookups.length} component lookups`
    );
  } else if (dim.kind === "component-docs") {
    const withSP = dim.components.filter((c) => c.hasStyleProps).length;
    console.log(
      `[eval] ${dim.label}: ${dim.components.length} components (${withSP} with styleProps)`
    );
  } else if (dim.kind === "docs-pages") {
    console.log(`[eval] ${dim.label}: ${dim.pages.length} pages checked`);
  }
}
if (results.mcpComparisons) {
  const withDiffs = results.mcpComparisons.filter(
    (c) =>
      c.addedFields.length > 0 ||
      c.removedFields.length > 0 ||
      c.changedFields.length > 0
  );
  console.log(
    `[eval] A/B: ${results.mcpComparisons.length} scenarios, ${withDiffs.length} with differences`
  );
}
console.log(`[eval] Wrote ${outPath}`);
