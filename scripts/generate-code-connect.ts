#!/usr/bin/env npx tsx
/**
 * Collects raw data for Figma Code Connect and writes it to
 * scripts/code-connect-data.json.
 *
 * Usage:
 *   npx tsx scripts/generate-code-connect.ts
 *
 * Requires FIGMA_ACCESS_TOKEN in .env or environment.
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join, resolve, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "dotenv";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const COMPONENTS_DIR = join(ROOT, "packages/nimbus/src/components");
const OUTPUT_FILE = join(ROOT, "scripts/code-connect-data.json");

// The main Nimbus design system Figma file
const FIGMA_FILE_KEY = "AvtPX6g7OGGCRvNlatGOIY";

// Explicit overrides: Figma component set name → { dir, subComponent? }
// dir: code directory name (only needed when name normalization can't find it)
// subComponent: explicit sub-component override (only needed when auto-matching fails)
// null: explicitly skip this Figma component
interface FigmaMapping {
  dir: string;
  subComponent?: string;
}

const FIGMA_TO_CODE: Record<string, FigmaMapping | null> = {
  // --- Name mismatches (normalization can't resolve) ---
  "I am a link": { dir: "link" },
  Textinput: { dir: "text-input" },
  "Textinput multiline": { dir: "multiline-text-input" },
  "TextInput - localized": { dir: "localized-field" },
  SelectInput: { dir: "select" },
  SearchInput: { dir: "search-input" },
  PasswordInput: { dir: "password-input" },
  NumberInput: { dir: "number-input" },
  "Money Input": { dir: "money-input" },
  "Scoped search input": { dir: "scoped-search-input" },
  "Richtext Input": { dir: "rich-text-input" },
  "Icon button": { dir: "icon-button" },
  "Toggle button": { dir: "toggle-button" },
  "Toggle Icon button": { dir: "icon-toggle-button" },
  "Toggle Button group": { dir: "toggle-button-group" },
  "Toggle Icon button group": { dir: "icon-toggle-button" },
  "Split Button": { dir: "split-button" },
  "Page navigator": { dir: "pagination" },
  "Loading spinner": { dir: "loading-spinner" },
  "Progress bar": { dir: "progress-bar" },
  "Progressbar with label": { dir: "progress-bar" },
  "Form field": { dir: "form-field" },
  "Tag group": { dir: "tag-group" },
  Tag: { dir: "tag-group" },
  "Draggable list": { dir: "draggable-list" },
  "Draggable tag": { dir: "tag-group" },
  "Checkbox with label": { dir: "checkbox" },
  "Checkbox group": { dir: "checkbox" },
  "Radio button": { dir: "radio-input" },
  "Radio button with label": { dir: "radio-input" },
  "Radio group": { dir: "radio-input" },
  "Switch with label": { dir: "switch" },
  "Date Picker": { dir: "date-picker" },
  "Calendar popover": { dir: "date-picker" },
  "Time Input": { dir: "time-input" },
  "Card content": { dir: "card" },
  "Combobox Input": { dir: "combobox" },
  "Combobox Menu": { dir: "combobox" },
  "Combobox with menu open": { dir: "combobox" },
  "Select Menu": { dir: "select" },
  Controls: { dir: "accordion" },
  "Table cell": { dir: "data-table" },
  Step: { dir: "steps" },
  "Toast ": { dir: "toast" },
  Toast: { dir: "toast" },

  // --- Sub-component overrides (auto-matching can't resolve) ---
  "Field message": { dir: "form-field", subComponent: "Error" },

  // --- Explicitly skipped ---
  "Note - CT 🚫": null,
};

// Figma property type
type FigmaPropType = "VARIANT" | "BOOLEAN" | "TEXT" | "INSTANCE_SWAP";

interface FigmaPropertyDef {
  type: FigmaPropType;
  defaultValue?: string | boolean;
  variantOptions?: string[];
  preferredValues?: Array<{ type: string; key: string }>;
}

interface FigmaComponentSet {
  name: string;
  node_id: string;
  containing_frame?: { name: string };
  description?: string;
}

interface ComponentInfo {
  dirName: string;
  dirPath: string;
  exportName: string | null;
  figmaLink: string | null;
  hasRecipe: boolean;
  hasTypes: boolean;
  /** Sub-component keys if this is a compound component (e.g. ["Root", "Header", "Content"]) */
  subComponents: string[];
  /** Whether this is a compound component (exports an object with sub-components) */
  isCompound: boolean;
}

interface RecipeVariants {
  [variantName: string]: string[];
}

// ---------------------------------------------------------------------------
// Output types
// ---------------------------------------------------------------------------

interface FigmaPropInfo {
  type: "VARIANT" | "BOOLEAN" | "TEXT" | "INSTANCE_SWAP";
  variantOptions?: string[];
  defaultValue?: string | boolean;
}

interface CodeConnectFiles {
  types: string | null;
  recipe: string | null;
  devDocs: string | null;
  stories: string | null;
  mainComponent: string | null;
  figmaOutput: string;
}

interface CodeConnectCodeMetadata {
  exportName: string;
  isCompound: boolean;
  subComponents: string[];
  recipeVariants: Record<string, string[]>;
  typesProps: string[];
  files: CodeConnectFiles;
}

interface CodeConnectEntry {
  component: string;
  dirName: string;
  subComponent?: string;
  figmaName: string;
  figmaUrl: string;
  figmaNodeId: string;
  figmaProps: Record<string, FigmaPropInfo>;
  codeMetadata: CodeConnectCodeMetadata;
}

interface CodeConnectData {
  generated: string;
  figmaFileKey: string;
  entries: CodeConnectEntry[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function loadEnv() {
  config({ path: join(ROOT, ".env") });
  const token = process.env.FIGMA_ACCESS_TOKEN;
  if (!token) {
    console.error(
      "Error: FIGMA_ACCESS_TOKEN not found. Set it in .env or as an environment variable."
    );
    process.exit(1);
  }
  return token;
}

/** Parse sub-component keys from a compound component's main .tsx file.
 *  Looks for the pattern: export const X = { Root: ..., Header: ..., Content: ... }
 *  Returns the keys (e.g. ["Root", "Header", "Content"]) or empty array if not compound. */
function parseSubComponents(mainFilePath: string): string[] {
  if (!existsSync(mainFilePath)) return [];

  const content = readFileSync(mainFilePath, "utf-8");

  // Match: export const ComponentName = {
  const exportMatch = content.match(
    /export const \w+ = \{([\s\S]*?)\n\};?\s*$/m
  );
  if (!exportMatch) return [];

  const objectBody = exportMatch[1];
  // Extract keys like "Root: CardRoot," or "Header: CardHeader,"
  const keyRegex = /^\s+(?:\/\*[\s\S]*?\*\/\s*)?(\w+)\s*:/gm;
  const keys: string[] = [];
  let match;
  while ((match = keyRegex.exec(objectBody)) !== null) {
    keys.push(match[1]);
  }

  return keys;
}

/** Extract prop names from a component's .types.ts file.
 *  Parses explicitly declared properties from type definitions. */
function parseTypesProps(dirPath: string, dirName: string): string[] {
  // Try both .ts and .tsx extensions
  const tsPath = join(dirPath, `${dirName}.types.ts`);
  const tsxPath = join(dirPath, `${dirName}.types.tsx`);
  const filePath = existsSync(tsPath)
    ? tsPath
    : existsSync(tsxPath)
      ? tsxPath
      : null;

  if (!filePath) return [];

  const content = readFileSync(filePath, "utf-8");
  const props = new Set<string>();

  // Match property declarations in type/interface definitions:
  //   propName?: Type;
  //   propName: Type;
  //   /** jsdoc */ propName?: Type;
  const propRegex = /(?:\/\*\*[\s\S]*?\*\/\s*)?^\s{2}(\w+)\??:\s/gm;
  let match;
  while ((match = propRegex.exec(content)) !== null) {
    const propName = match[1];
    // Skip non-prop patterns (type params, internal fields)
    if (
      propName === "key" ||
      propName === "ref" ||
      propName === "slot" ||
      propName.startsWith("_")
    ) {
      continue;
    }
    props.add(propName);
  }

  return [...props];
}

/** Parse YAML-ish MDX frontmatter */
function parseFrontmatter(content: string): Record<string, string> {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};

  const result: Record<string, string> = {};
  const lines = match[1].split("\n");

  let currentKey = "";
  for (const line of lines) {
    if (/^\s+\S/.test(line) && currentKey) {
      const existing = result[currentKey] || "";
      result[currentKey] = (existing + " " + line.trim()).trim();
      continue;
    }

    const kvMatch = line.match(/^(\w[\w\s]*?):\s*(.*)$/);
    if (kvMatch) {
      currentKey = kvMatch[1].trim();
      const value = kvMatch[2].replace(/^>-?\s*$/, "").trim();
      result[currentKey] = value || "";
    }
  }

  return result;
}

/** Fetch all component sets from a Figma file */
async function fetchFigmaComponentSets(
  token: string,
  fileKey: string
): Promise<FigmaComponentSet[]> {
  const resp = await fetch(
    `https://api.figma.com/v1/files/${fileKey}/component_sets`,
    { headers: { "X-FIGMA-TOKEN": token } }
  );

  if (!resp.ok) {
    console.error(`Figma API error: ${resp.status} ${resp.statusText}`);
    return [];
  }

  const data = await resp.json();
  return data.meta?.component_sets || [];
}

/** Fetch component property definitions for multiple nodes in one API call */
async function fetchAllNodeProps(
  token: string,
  fileKey: string,
  nodeIds: string[]
): Promise<Map<string, Record<string, FigmaPropertyDef>>> {
  const result = new Map<string, Record<string, FigmaPropertyDef>>();

  // Figma API supports multiple ids comma-separated
  // Batch in groups of 50 to avoid URL length limits
  const batchSize = 50;
  for (let i = 0; i < nodeIds.length; i += batchSize) {
    const batch = nodeIds.slice(i, i + batchSize);
    const idsParam = batch.map(encodeURIComponent).join(",");

    if (i > 0) {
      // Wait between batches to avoid rate limits
      await new Promise((r) => setTimeout(r, 1000));
    }

    const resp = await fetch(
      `https://api.figma.com/v1/files/${fileKey}/nodes?ids=${idsParam}`,
      { headers: { "X-FIGMA-TOKEN": token } }
    );

    if (!resp.ok) {
      console.warn(
        `  Figma API error (batch): ${resp.status} ${resp.statusText}`
      );
      continue;
    }

    const data = await resp.json();
    if (!data.nodes) continue;

    for (const nodeId of batch) {
      const node = data.nodes[nodeId];
      if (node?.document?.componentPropertyDefinitions) {
        result.set(nodeId, node.document.componentPropertyDefinitions);
      }
    }
  }

  return result;
}

/** Extract variant values from a recipe file */
function parseRecipeVariants(filePath: string): RecipeVariants {
  const variants: RecipeVariants = {};
  if (!existsSync(filePath)) return variants;

  const content = readFileSync(filePath, "utf-8");

  const variantsMatch = content.match(/variants:\s*\{([\s\S]*?)\n\s{2}\}/);
  if (!variantsMatch) return variants;

  const variantsBlock = variantsMatch[1];
  const groupRegex = /(\w+):\s*\{/g;
  let groupMatch;

  while ((groupMatch = groupRegex.exec(variantsBlock)) !== null) {
    const variantName = groupMatch[1];
    const startIdx = groupMatch.index + groupMatch[0].length;

    let depth = 1;
    let idx = startIdx;
    while (depth > 0 && idx < variantsBlock.length) {
      if (variantsBlock[idx] === "{") depth++;
      if (variantsBlock[idx] === "}") depth--;
      idx++;
    }

    const groupContent = variantsBlock.slice(startIdx, idx - 1);
    const keyRegex = /^\s{6,8}(?:"([^"]+)"|'([^']+)'|(\w[\w-]*))\s*:/gm;
    const values: string[] = [];
    let keyMatch;
    while ((keyMatch = keyRegex.exec(groupContent)) !== null) {
      values.push(keyMatch[1] || keyMatch[2] || keyMatch[3]);
    }

    if (values.length > 0) {
      variants[variantName] = values;
    }
  }

  return variants;
}

/** Normalize a name for matching */
function normalizeName(name: string): string {
  return name
    .replace(/[#\d]+$/, "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toLowerCase();
}

interface FigmaMatchResult {
  component: ComponentInfo;
  subComponent?: string; // e.g. "Option", "Tag", "Content"
}

/** Try to match a Figma name against a compound component's sub-components.
 *  Returns the sub-component key if found, undefined otherwise.
 *  For compound components with no sub-component match, defaults to "Root". */
function matchSubComponent(
  figmaName: string,
  comp: ComponentInfo
): string | undefined {
  if (!comp.isCompound) return undefined;

  const normalizedFigma = normalizeName(figmaName);
  const normalizedExport = comp.exportName
    ? normalizeName(comp.exportName)
    : normalizeName(comp.dirName);

  // Strip the component name from the Figma name to get the "remainder"
  // e.g. "Card content" → strip "card" → "content"
  // e.g. "Combobox Menu" → strip "combobox" → "menu"
  let remainder = normalizedFigma.replace(normalizedExport, "").trim();

  // If stripping didn't change anything (export name not in figma name),
  // split the Figma name into words and use all of them for matching
  if (remainder === normalizedFigma) {
    // Split original Figma name into normalized words for matching
    const figmaWords = figmaName
      .split(/[\s\-_]+/)
      .map(normalizeName)
      .filter(Boolean);
    remainder = figmaWords.join(" ");
  }

  // If there's no remainder, this is the base component → Root
  if (!remainder) return "Root";

  // Sub-component name aliases for when Figma uses different terminology
  const SUB_COMPONENT_ALIASES: Record<string, string[]> = {
    menu: ["listbox", "options", "popover"],
    input: ["trigger", "root"],
    button: ["option", "trigger"],
    message: ["error", "description"],
    cell: ["body", "root"],
    group: ["root"],
    item: ["root"],
  };

  // Try exact match first, then substring match
  for (const subKey of comp.subComponents) {
    if (subKey === "Root") continue;
    if (normalizeName(subKey) === remainder) {
      return subKey;
    }
  }
  for (const subKey of comp.subComponents) {
    if (subKey === "Root") continue;
    const normalizedSub = normalizeName(subKey);
    if (
      remainder.includes(normalizedSub) ||
      normalizedSub.includes(remainder)
    ) {
      return subKey;
    }
  }

  // Try aliases: check each word in remainder against alias table
  const remainderWords = remainder.split(/\s+/);
  for (const word of remainderWords) {
    const aliases = SUB_COMPONENT_ALIASES[word] || [];
    for (const alias of aliases) {
      for (const subKey of comp.subComponents) {
        if (subKey === "Root") continue;
        if (normalizeName(subKey) === alias) {
          return subKey;
        }
      }
    }
  }

  // No sub-component matched the remainder → default to Root
  return "Root";
}

/** Match Figma component set name to a code component directory + sub-component */
function matchFigmaToCodeDir(
  figmaName: string,
  codeComponents: ComponentInfo[]
): FigmaMatchResult | null {
  // 1. Check explicit mapping
  if (figmaName in FIGMA_TO_CODE) {
    const mapping = FIGMA_TO_CODE[figmaName];
    if (!mapping) return null; // explicitly skipped
    const comp = codeComponents.find((c) => c.dirName === mapping.dir);
    if (!comp) return null;

    // Use explicit subComponent if provided, otherwise auto-detect
    const subComponent =
      mapping.subComponent ?? matchSubComponent(figmaName, comp);
    return { component: comp, subComponent };
  }

  // 2. Normalize and try direct match on dir name
  const normalizedFigma = normalizeName(figmaName);
  const directMatch = codeComponents.find(
    (c) => normalizeName(c.dirName) === normalizedFigma
  );
  if (directMatch) {
    const subComponent = matchSubComponent(figmaName, directMatch);
    return { component: directMatch, subComponent };
  }

  // 3. Try matching against exportName
  const exportMatch = codeComponents.find(
    (c) => c.exportName && normalizeName(c.exportName) === normalizedFigma
  );
  if (exportMatch) {
    const subComponent = matchSubComponent(figmaName, exportMatch);
    return { component: exportMatch, subComponent };
  }

  // 4. Try matching Figma name against any compound component's sub-components
  // e.g. "Card content" → check if any component has a "Content" sub-component
  //       where the component name is also part of the Figma name
  for (const comp of codeComponents) {
    if (!comp.isCompound || !comp.exportName) continue;
    const normalizedExport = normalizeName(comp.exportName);

    // Figma name must contain the component name
    if (!normalizedFigma.includes(normalizedExport)) continue;

    // Try to find a matching sub-component from the remainder
    for (const subKey of comp.subComponents) {
      if (subKey === "Root") continue;
      const normalizedSub = normalizeName(subKey);
      if (normalizedFigma.includes(normalizedSub)) {
        return { component: comp, subComponent: subKey };
      }
    }
  }

  return null;
}

/** Build the Figma URL for a component set node */
function buildFigmaUrl(fileKey: string, nodeId: string): string {
  const dashNodeId = nodeId.replace(/:/g, "-");
  return `https://www.figma.com/design/${fileKey}/NIMBUS-design-system?node-id=${dashNodeId}`;
}

/** Convert an absolute path to a path relative to the project root */
function toRootRelative(absPath: string): string {
  return relative(ROOT, absPath);
}

// ---------------------------------------------------------------------------
// Discovery
// ---------------------------------------------------------------------------

function discoverComponents(): ComponentInfo[] {
  const components: ComponentInfo[] = [];

  const dirs = readdirSync(COMPONENTS_DIR, {
    withFileTypes: true,
  }).filter((d) => d.isDirectory());

  for (const dir of dirs) {
    const dirPath = join(COMPONENTS_DIR, dir.name);
    const mdxPath = join(dirPath, `${dir.name}.mdx`);

    let exportName: string | null = null;
    let figmaLink: string | null = null;

    if (existsSync(mdxPath)) {
      const content = readFileSync(mdxPath, "utf-8");
      const fm = parseFrontmatter(content);
      exportName = fm.exportName || null;
      figmaLink = fm.figmaLink || null;
    }

    const hasRecipe = existsSync(join(dirPath, `${dir.name}.recipe.ts`));
    const hasTypes = existsSync(join(dirPath, `${dir.name}.types.ts`));

    // Discover sub-components from the main component file
    const mainTsxPath = join(dirPath, `${dir.name}.tsx`);
    const subComponents = parseSubComponents(mainTsxPath);

    components.push({
      dirName: dir.name,
      dirPath,
      exportName,
      figmaLink,
      hasRecipe,
      hasTypes,
      subComponents,
      isCompound: subComponents.length > 0,
    });
  }

  return components;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const token = loadEnv();

  // 1. Discover code components
  const codeComponents = discoverComponents();
  const compoundComps = codeComponents.filter((c) => c.isCompound);
  console.log(`Found ${codeComponents.length} code component directories`);
  console.log(
    `  ${compoundComps.length} compound components with sub-components:`
  );
  for (const c of compoundComps) {
    console.log(`    ${c.exportName}: ${c.subComponents.join(", ")}`);
  }
  console.log("");

  // 2. Fetch Figma component sets
  console.log("Fetching Figma component sets...");
  const figmaComponentSets = await fetchFigmaComponentSets(
    token,
    FIGMA_FILE_KEY
  );
  console.log(`Found ${figmaComponentSets.length} Figma component sets\n`);

  // 3. Match Figma component sets to code components
  // Collect all Figma matches per code directory (supports multiple sub-components)
  const figmaMatchesByDir = new Map<
    string,
    Array<{
      cs: FigmaComponentSet;
      comp: ComponentInfo;
      subComponent?: string;
    }>
  >();

  // Track which (dir, subComponent) combos we've seen to skip true duplicates
  const seenDirSubCombos = new Set<string>();

  let unmatchedFigmaCount = 0;

  for (const cs of figmaComponentSets) {
    const matchResult = matchFigmaToCodeDir(cs.name, codeComponents);

    if (!matchResult) {
      unmatchedFigmaCount++;
      continue;
    }

    const { component: comp, subComponent } = matchResult;
    const comboKey = `${comp.dirName}::${subComponent || ""}`;

    // Skip true duplicates (same dir + same subComponent)
    if (seenDirSubCombos.has(comboKey)) continue;
    seenDirSubCombos.add(comboKey);

    if (!figmaMatchesByDir.has(comp.dirName)) {
      figmaMatchesByDir.set(comp.dirName, []);
    }
    figmaMatchesByDir.get(comp.dirName)!.push({ cs, comp, subComponent });
  }

  // 4. Batch-fetch all Figma node properties in one API call
  const allNodeIds = [...figmaMatchesByDir.values()]
    .flat()
    .map(({ cs }) => cs.node_id);
  console.log(`Fetching properties for ${allNodeIds.length} component sets...`);
  const allNodeProps = await fetchAllNodeProps(
    token,
    FIGMA_FILE_KEY,
    allNodeIds
  );
  console.log(`Got properties for ${allNodeProps.size} component sets\n`);

  // 5. Build the output entries
  const entries: CodeConnectEntry[] = [];
  let noPropsCount = 0;

  for (const [, matches] of figmaMatchesByDir) {
    const comp = matches[0].comp;
    const exportName = comp.exportName || comp.dirName;

    // Parse recipe variants and types props once per component directory
    const recipePath = join(comp.dirPath, `${comp.dirName}.recipe.ts`);
    const recipeVariants = parseRecipeVariants(recipePath);
    const typesProps = parseTypesProps(comp.dirPath, comp.dirName);

    // Resolve file paths (relative to project root)
    const typesTs = join(comp.dirPath, `${comp.dirName}.types.ts`);
    const typesTsx = join(comp.dirPath, `${comp.dirName}.types.tsx`);
    const devMdx = join(comp.dirPath, `${comp.dirName}.dev.mdx`);
    const storiesPath = join(comp.dirPath, `${comp.dirName}.stories.tsx`);
    const mainTsxPath = join(comp.dirPath, `${comp.dirName}.tsx`);
    const figmaOutputPath = join(comp.dirPath, `${comp.dirName}.figma.tsx`);

    const files: CodeConnectFiles = {
      types: existsSync(typesTs)
        ? toRootRelative(typesTs)
        : existsSync(typesTsx)
          ? toRootRelative(typesTsx)
          : null,
      recipe: existsSync(recipePath) ? toRootRelative(recipePath) : null,
      devDocs: existsSync(devMdx) ? toRootRelative(devMdx) : null,
      stories: existsSync(storiesPath) ? toRootRelative(storiesPath) : null,
      mainComponent: existsSync(mainTsxPath)
        ? toRootRelative(mainTsxPath)
        : null,
      figmaOutput: toRootRelative(figmaOutputPath),
    };

    for (const { cs, subComponent } of matches) {
      const figmaProps = allNodeProps.get(cs.node_id) || null;

      if (!figmaProps) {
        console.log(
          `  No properties: ${exportName}${subComponent ? `.${subComponent}` : ""}`
        );
        noPropsCount++;
        continue;
      }

      // Build normalized figmaProps record
      const normalizedFigmaProps: Record<string, FigmaPropInfo> = {};
      for (const [propName, def] of Object.entries(figmaProps)) {
        const info: FigmaPropInfo = { type: def.type };
        if (def.variantOptions !== undefined) {
          info.variantOptions = def.variantOptions;
        }
        if (def.defaultValue !== undefined) {
          info.defaultValue = def.defaultValue;
        }
        normalizedFigmaProps[propName] = info;
      }

      const componentLabel = subComponent
        ? `${exportName}.${subComponent}`
        : exportName;

      const entry: CodeConnectEntry = {
        component: componentLabel,
        dirName: comp.dirName,
        ...(subComponent !== undefined && { subComponent }),
        figmaName: cs.name,
        figmaUrl: buildFigmaUrl(FIGMA_FILE_KEY, cs.node_id),
        figmaNodeId: cs.node_id,
        figmaProps: normalizedFigmaProps,
        codeMetadata: {
          exportName,
          isCompound: comp.isCompound,
          subComponents: comp.subComponents,
          recipeVariants,
          typesProps,
          files,
        },
      };

      entries.push(entry);
      console.log(
        `  Collected ${componentLabel}: ${Object.keys(normalizedFigmaProps).length} Figma props`
      );
    }
  }

  // 6. Write output JSON
  const output: CodeConnectData = {
    generated: new Date().toISOString(),
    figmaFileKey: FIGMA_FILE_KEY,
    entries,
  };

  writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2), "utf-8");

  console.log("");
  console.log("=== Summary ===");
  console.log(`Entries collected: ${entries.length}`);
  console.log(`No Figma properties: ${noPropsCount}`);
  console.log(`Unmatched Figma component sets: ${unmatchedFigmaCount}`);
  console.log(`\nData written to: ${OUTPUT_FILE}`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
