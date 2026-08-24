/**
 * Runs all MCP eval scenarios and writes results to public/eval-results.json.
 * This is consumed by the Vite dashboard app.
 *
 * Usage: tsx scripts/run-eval.ts
 */

import { writeFileSync, mkdirSync } from "node:fs";
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
// Scenario types
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

interface FileMigrationResult {
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

interface ComponentResult {
  name: string;
  data: Record<string, unknown>;
  hasStyleProps: boolean;
  fields: string[];
}

interface StylePropsPageResult {
  categoryCount: number;
  content: string;
}

interface EvalResults {
  timestamp: string;
  fileMigrations: FileMigrationResult[];
  componentLookups: ComponentResult[];
  stylePropsPage: StylePropsPageResult;
  componentStyleProps: Array<{
    name: string;
    hasStyleProps: boolean;
    styleProps?: string;
  }>;
}

// ---------------------------------------------------------------------------
// Run eval
// ---------------------------------------------------------------------------

async function runEval(): Promise<EvalResults> {
  const client = await createClient();

  // File-level migrations
  const fixtures = [
    { name: "product-list-view", file: "product-list-view.tsx" },
    { name: "product-detail-form", file: "product-detail-form.tsx" },
  ];

  const fileMigrations: FileMigrationResult[] = [];
  for (const f of fixtures) {
    const path = resolve(FIXTURES_DIR, f.file);
    const { data } = await callTool(client, "migrate_from_uikit", {
      filePath: path,
    });
    const mappings = (data.mappings ?? []) as MappingResult[];
    const unmapped = (data.unmapped ?? []) as Array<{ name: string }>;
    fileMigrations.push({
      fixture: f.name,
      filePath: path,
      mappings,
      unmapped,
      layoutGuidance: data.layoutGuidance as string | undefined,
      coverage: mappings.length / (mappings.length + unmapped.length),
      stylePropsCount: mappings.filter((m: MappingResult) => m.styleProps)
        .length,
    });
  }

  // Component-level lookups
  const componentNames = [
    "DataTable",
    "CollapsiblePanel",
    "SelectInput",
    "DateRangeInput",
    "MoneyInput",
    "NumberInput",
    "PrimaryButton",
    "Icon Library",
    "Avatar",
    "LocalizedTextInput",
  ];

  const componentLookups: ComponentResult[] = [];
  for (const name of componentNames) {
    const { data } = await callTool(client, "migrate_from_uikit", {
      componentName: name,
    });
    componentLookups.push({
      name,
      data: data as Record<string, unknown>,
      hasStyleProps: !!data.styleProps,
      fields: Object.keys(data),
    });
  }

  // Style props landing page
  const { data: stylePropsData } = await callTool(client, "get_docs_page", {
    path: "home/style-props",
  });
  const content = (stylePropsData.content as string) ?? "";
  const categoryCount = (content.match(/home\/style-props\//g) || []).length;

  // get_component styleProps check
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
  const componentStyleProps: EvalResults["componentStyleProps"] = [];
  for (const name of checkComponents) {
    const { data, isError } = await callTool(client, "get_component", { name });
    if (isError) {
      componentStyleProps.push({ name, hasStyleProps: false });
    } else {
      componentStyleProps.push({
        name,
        hasStyleProps: !!data.styleProps,
        styleProps: data.styleProps as string | undefined,
      });
    }
  }

  await client.close();

  return {
    timestamp: new Date().toISOString(),
    fileMigrations,
    componentLookups,
    stylePropsPage: { categoryCount, content },
    componentStyleProps,
  };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

console.log("[eval] Running MCP eval scenarios...");
const results = await runEval();
const outDir = resolve(ROOT, "public");
mkdirSync(outDir, { recursive: true });
const outPath = resolve(outDir, "eval-results.json");
writeFileSync(outPath, JSON.stringify(results, null, 2), "utf-8");
console.log(`[eval] Wrote ${outPath}`);
console.log(
  `[eval] ${results.fileMigrations.length} file migrations, ` +
    `${results.componentLookups.length} component lookups, ` +
    `${results.componentStyleProps.length} styleProps checks`
);
