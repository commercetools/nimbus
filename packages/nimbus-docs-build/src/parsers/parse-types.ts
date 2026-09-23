/**
 * TypeScript Props Parser
 *
 * Extracts component prop types using react-docgen-typescript
 * with access to proper tsconfig paths
 */
import fs from "fs/promises";
import path from "path";
import docgen from "react-docgen-typescript";
import type { ComponentDoc } from "react-docgen-typescript";
import ts from "typescript";
import { processComponentTypes } from "./process-types.js";
import { flog, warnLog } from "../utils/logger.js";
import type { DocsBuilderConfig } from "../types/config.js";

/**
 * react-docgen-typescript options. Shared by the barrel parse and the
 * file-level supplement so both produce the same prop shapes.
 */
const DOCGEN_OPTIONS = {
  savePropValueAsString: true,
  shouldExtractLiteralValuesFromEnum: true,
  shouldRemoveUndefinedFromOptional: true,
};

/**
 * File name suffixes under `components/` that never declare a documented
 * component: tests, stories, Figma Code Connect bindings, Chakra slot
 * factories and test fixtures.
 */
const NON_COMPONENT_FILE_SUFFIXES = [
  ".stories.tsx",
  ".spec.tsx",
  ".docs.spec.tsx",
  ".figma.tsx",
  ".slots.tsx",
  ".test-data.tsx",
];

/**
 * Directory names under `components/` that hold no component implementations:
 * `intl/` contains generated message catalogs, `__*` contains test scaffolding.
 */
const isNonComponentDirectory = (name: string): boolean =>
  name === "intl" || name.startsWith("__");

/**
 * Recursively collect component implementation files under a directory.
 *
 * @param dir - Directory to walk
 * @returns Absolute paths of candidate `.tsx` implementation files, sorted
 */
async function collectComponentImplementationFiles(
  dir: string
): Promise<string[]> {
  const walk = async (current: string): Promise<string[]> => {
    const entries = await fs.readdir(current, { withFileTypes: true });
    const collected: string[] = [];

    for (const entry of entries) {
      const entryPath = path.join(current, entry.name);

      if (entry.isDirectory()) {
        if (isNonComponentDirectory(entry.name)) continue;
        collected.push(...(await walk(entryPath)));
        continue;
      }

      if (!entry.isFile() || !entry.name.endsWith(".tsx")) continue;
      if (NON_COMPONENT_FILE_SUFFIXES.some((s) => entry.name.endsWith(s)))
        continue;

      collected.push(entryPath);
    }

    return collected;
  };

  return (await walk(dir)).sort();
}

/**
 * A barrel export, with the own property names of its namespace object when the
 * declaration is one of the two shapes that can be read statically.
 *
 * `namespaceKeys` is `undefined` when the export is not a namespace object at
 * all (a plain component, a hook, a type) or when its shape cannot be read.
 * Both cases make the sub-component admission rule fail closed.
 */
interface BarrelExport {
  namespaceKeys?: Set<string>;
}

/** Whether an expression is the `Object.assign` callee. */
const isObjectAssignCallee = (expression: ts.Expression): boolean =>
  ts.isPropertyAccessExpression(expression) &&
  ts.isIdentifier(expression.expression) &&
  expression.expression.text === "Object" &&
  expression.name.text === "assign";

/** Strip `as const`, `satisfies X`, casts and parentheses off an expression. */
function unwrapExpression(expression: ts.Expression): ts.Expression {
  let current = expression;
  while (
    ts.isAsExpression(current) ||
    ts.isSatisfiesExpression(current) ||
    ts.isTypeAssertionExpression(current) ||
    ts.isParenthesizedExpression(current)
  ) {
    current = current.expression;
  }
  return current;
}

/**
 * Own property names of an object literal.
 *
 * Computed keys and spreads carry no statically known name, so they are simply
 * not reported — an unreported key can only cause a sub-component to be left
 * out, never a bogus one to be admitted.
 */
function readObjectLiteralKeys(
  objectLiteral: ts.ObjectLiteralExpression
): Set<string> {
  const keys = new Set<string>();

  for (const property of objectLiteral.properties) {
    const name = property.name;
    if (!name) continue; // spread assignment

    // Covers shorthand (`isTouched`), explicit (`Item: GridItem`) and
    // string-literal (`"Item": GridItem`) keys. Anything else is computed.
    if (
      ts.isIdentifier(name) ||
      ts.isStringLiteral(name) ||
      ts.isNumericLiteral(name)
    ) {
      keys.add(name.text);
    }
  }

  return keys;
}

/**
 * Read the namespace keys a compound component declares, statically from the
 * AST — nothing is evaluated.
 *
 * Two shapes are understood, which are the two Nimbus uses:
 * - a bare object literal: `export const Card = { Root: CardRoot, … }`
 * - `Object.assign`: `export const Grid = Object.assign(GridComponent, { … })`
 *
 * @param declaration - Declaration of the exported symbol
 * @returns The declared keys, or undefined when the shape is not readable
 */
function readNamespaceKeys(
  declaration: ts.Declaration
): Set<string> | undefined {
  if (!ts.isVariableDeclaration(declaration) || !declaration.initializer) {
    return undefined;
  }

  const initializer = unwrapExpression(declaration.initializer);

  if (ts.isObjectLiteralExpression(initializer)) {
    return readObjectLiteralKeys(initializer);
  }

  if (
    ts.isCallExpression(initializer) &&
    isObjectAssignCallee(initializer.expression)
  ) {
    // The first argument is the callable base; every later argument extends it.
    const keys = new Set<string>();

    for (const argument of initializer.arguments.slice(1)) {
      const source = unwrapExpression(argument);
      // A non-literal source (a variable, a spread) would make the key set
      // incomplete in a way we cannot detect later, so refuse the whole shape.
      if (!ts.isObjectLiteralExpression(source)) return undefined;
      for (const key of readObjectLiteralKeys(source)) keys.add(key);
    }

    return keys;
  }

  return undefined;
}

/**
 * Read what the barrel re-exports, plus the namespace keys of each export.
 *
 * Both feed the supplement's admission rule: a `Parent.Key` display name is
 * only documented when `Parent` is a public symbol (which drops internal
 * artifacts such as `CustomSettings.Context`) and `Key` is a property the
 * parent namespace actually declares.
 *
 * @param indexPath - Path to the component barrel (index) file
 * @param tsconfigPath - tsconfig to inherit compiler options from, if found
 * @returns Map of exported symbol name to its namespace information (empty when
 *   the barrel cannot be read)
 */
function readBarrelExports(
  indexPath: string,
  tsconfigPath: string | undefined
): Map<string, BarrelExport> {
  let compilerOptions: ts.CompilerOptions = {};

  if (tsconfigPath) {
    const { config } = ts.readConfigFile(tsconfigPath, ts.sys.readFile);
    compilerOptions = ts.parseJsonConfigFileContent(
      config,
      ts.sys,
      path.dirname(tsconfigPath)
    ).options;
  }

  const program = ts.createProgram([indexPath], compilerOptions);
  const checker = program.getTypeChecker();
  const sourceFile = program.getSourceFile(indexPath);
  const moduleSymbol = sourceFile && checker.getSymbolAtLocation(sourceFile);

  if (!moduleSymbol) {
    // Fatal rather than a warning: the admission rules below are all keyed on
    // the barrel's exports, so an empty map silently drops every supplemental
    // doc and still exits 0. There is no correct output from here.
    throw new Error(
      `[parse-types] Could not resolve barrel exports from ${indexPath}`
    );
  }

  const exports = new Map<string, BarrelExport>();

  for (const exported of checker.getExportsOfModule(moduleSymbol)) {
    // The barrel re-exports everything (`export * from "./components"`), so the
    // symbol seen here is an alias; follow it to the real declaration.
    const symbol =
      exported.flags & ts.SymbolFlags.Alias
        ? checker.getAliasedSymbol(exported)
        : exported;

    let namespaceKeys: Set<string> | undefined;
    for (const declaration of symbol.getDeclarations() ?? []) {
      namespaceKeys = readNamespaceKeys(declaration);
      if (namespaceKeys) break;
    }

    exports.set(exported.getName(), { namespaceKeys });
  }

  return exports;
}

/**
 * Decide whether a file-level doc may supplement the barrel output, and under
 * which name.
 *
 * The rule is deliberately tight. The output directory is not private to the
 * docs site — `nimbus-mcp` copies it and discovers sub-components with
 * `readdir` + prefix matching — so anything admitted here that is not a real
 * sub-component shows up there as a bogus public API.
 *
 * All conditions must hold:
 * 1. the display name is exactly `Parent.Key`
 * 2. `Parent` is a real exported barrel symbol (drops `CustomSettings.Context`)
 * 3. `Key` starts uppercase (drops utilities like `MoneyInput.isEmpty`)
 * 4. `Key` does not end in `Context` (contexts are not components, and the
 *    docs site filters them out at runtime anyway)
 * 5. the dot-stripped name is not already produced by the barrel parse
 * 6. `Key` is a property the parent namespace object actually declares. A
 *    dotted `displayName` is only an author's label, so internal parts carry
 *    aspirational ones — `Select.ClearButton` and `ComboBox.Input` are private
 *    helpers that no namespace exposes. Without this check they reach
 *    `nimbus-mcp` as public sub-components and it reports their props as props
 *    of `Select` / `ComboBox`.
 *
 * @param doc - Raw doc from the file-level parse
 * @param barrelExports - What the barrel re-exports, with namespace keys
 * @param alreadyProduced - Names the barrel parse already emitted
 * @returns The dot-stripped name to emit, or undefined when not admitted
 */
function admitSupplementalDocName(
  doc: ComponentDoc,
  barrelExports: Map<string, BarrelExport>,
  alreadyProduced: Set<string>
): string | undefined {
  const segments = doc.displayName?.split(".") ?? [];
  if (segments.length !== 2) return undefined;

  const [parent, key] = segments;
  const barrelExport = barrelExports.get(parent);
  if (!barrelExport) return undefined;
  if (!/^[A-Z]/.test(key)) return undefined;
  if (key.endsWith("Context")) return undefined;
  if (!barrelExport.namespaceKeys?.has(key)) return undefined;

  // The docs site looks sub-components up as `${id}${key}` (see the docs app's
  // props-table), so the dot is simply removed.
  const name = parent + key;
  if (alreadyProduced.has(name)) return undefined;

  return name;
}

/**
 * Parse component implementation files directly to recover sub-component props
 * the barrel parse cannot see.
 *
 * Why a second parse is needed: react-docgen-typescript resolves the members of
 * a bare object-literal namespace export, but not of `Object.assign(Base, {…})`
 * (DataTable, Region) or of an object literal carrying a type annotation (List,
 * CollapsibleMotion, Table).
 *
 * Why the names come out usable: when a file is parsed directly, docgen reports
 * the **authored** `displayName` (`"DataTable.Root"`) instead of the exported
 * symbol name. Dot-stripped, that is exactly the `${id}${key}` key the docs site
 * already builds, so neither the docs site lookup nor the file naming changes.
 *
 * The result is additive — the barrel always wins, see condition 5 of
 * {@link admitSupplementalDocName}.
 *
 * @param indexPath - Path to the component barrel (index) file; the
 *   implementation files are taken from the sibling `components/` tree
 * @param alreadyProduced - Display names the barrel parse already emitted
 * @param propFilter - Optional custom prop filter
 * @returns Processed docs for the admitted sub-components
 */
export async function parseSupplementalComponentTypes(
  indexPath: string,
  alreadyProduced: Set<string>,
  propFilter?: DocsBuilderConfig["propFilter"]
): Promise<ComponentDoc[]> {
  const componentsDir = path.join(path.dirname(indexPath), "components");

  try {
    if (!(await fs.stat(componentsDir)).isDirectory()) return [];
  } catch {
    warnLog(
      `No components directory at ${componentsDir}; skipping the file-level type supplement`
    );
    return [];
  }

  const files = await collectComponentImplementationFiles(componentsDir);
  if (files.length === 0) return [];

  // Same tsconfig discovery as the barrel parse: without it, subpath imports
  // like @chakra-ui/react/styled-system fail to resolve and recipe props
  // (variant, size, …) silently disappear.
  const tsconfigPath = ts.findConfigFile(
    path.dirname(indexPath),
    ts.sys.fileExists,
    "tsconfig.json"
  );

  const rawDocs = tsconfigPath
    ? docgen.withCustomConfig(tsconfigPath, DOCGEN_OPTIONS).parse(files)
    : docgen.parse(files, DOCGEN_OPTIONS);

  const barrelExports = readBarrelExports(indexPath, tsconfigPath);

  const admitted: ComponentDoc[] = [];
  const admittedNames = new Set<string>();

  for (const doc of rawDocs) {
    const name = admitSupplementalDocName(doc, barrelExports, alreadyProduced);
    if (!name) continue;

    // Two implementation files claiming the same sub-component would overwrite
    // each other's JSON file; keep the first and make the clash visible.
    if (admittedNames.has(name)) {
      warnLog(
        `Duplicate supplemental type doc "${name}" from ${doc.filePath}; keeping the first`
      );
      continue;
    }

    admittedNames.add(name);
    admitted.push({ ...doc, displayName: name });
  }

  // A silent supplement is the failure mode this stage is most exposed to: a
  // sub-component that stops being admitted loses its prop table on the docs
  // site only, which CI never builds. Report the counts every run.
  const dotted = rawDocs.filter((doc) => doc.displayName.includes(".")).length;
  flog(
    `[TSX] Supplement: admitted ${admitted.length} of ${dotted} dotted displayNames ` +
      `across ${files.length} implementation files`
  );

  // Run the supplement through the same post-processing as the barrel docs so
  // the emitted shape (filtered props + supportsStyleProps) is identical.
  return processComponentTypes(admitted, propFilter);
}

/**
 * Parse TypeScript files and extract component props
 * @param config - Configuration with componentIndexPath and optional propFilter
 * @returns Array of processed component docs
 */
export async function parseTypes(
  config: Pick<DocsBuilderConfig, "sources" | "propFilter">
): Promise<ComponentDoc[]> {
  try {
    const indexPath = config.sources.componentIndexPath;
    if (!indexPath) {
      throw new Error("componentIndexPath is required for type parsing");
    }

    // Find the tsconfig nearest to the component index file so that
    // react-docgen-typescript inherits moduleResolution, paths, etc.
    // Without this, subpath imports like @chakra-ui/react/styled-system
    // fail to resolve and recipe props (variant, size, …) are lost.
    const tsconfigPath = ts.findConfigFile(
      path.dirname(indexPath),
      ts.sys.fileExists,
      "tsconfig.json"
    );

    const rawTypes = tsconfigPath
      ? docgen.withCustomConfig(tsconfigPath, DOCGEN_OPTIONS).parse(indexPath)
      : docgen.parse(indexPath, DOCGEN_OPTIONS);

    // Process types (filter + enrich)
    const processedTypes = processComponentTypes(rawTypes, config.propFilter);

    // Supplement with a file-level parse for the sub-components the barrel
    // parse cannot resolve. Additive only — the barrel wins every name.
    const supplementalTypes = await parseSupplementalComponentTypes(
      indexPath,
      new Set(processedTypes.map((doc) => doc.displayName)),
      config.propFilter
    );

    return [...processedTypes, ...supplementalTypes];
  } catch (error) {
    console.error("Error parsing types:", error);
    throw error;
  }
}

/**
 * Parse types and write to a single output file
 * @param componentIndexPath - Path to component index file
 * @param outputPath - Path to write types JSON
 * @param propFilter - Optional custom prop filter
 */
export async function parseTypesToFile(
  componentIndexPath: string,
  outputPath: string,
  propFilter?: DocsBuilderConfig["propFilter"]
): Promise<void> {
  const processedTypes = await parseTypes({
    sources: { packagesDir: "", componentIndexPath },
    propFilter,
  });

  await fs.writeFile(outputPath, JSON.stringify(processedTypes, null, 2));
}

/**
 * Remove type JSON files in the output directory that the current run did not
 * produce.
 *
 * Without this, renamed or deleted components leave their JSON behind forever,
 * and those stale files are live inputs: the docs site resolves type data
 * through a Vite dynamic-import glob over this directory, and `nimbus-mcp`
 * discovers sub-components by `readdir` + prefix match.
 *
 * Intentionally conservative: only top-level `.json` files of this directory
 * are considered, `manifest.json` is kept, and nothing is followed into
 * subdirectories or symlinks.
 *
 * @param outputDir - Directory holding the per-component type files
 * @param keep - Component names written by the current run
 * @returns Number of files removed
 */
async function pruneStaleTypeFiles(
  outputDir: string,
  keep: Set<string>
): Promise<number> {
  const entries = await fs.readdir(outputDir, { withFileTypes: true });
  let removed = 0;

  for (const entry of entries) {
    if (!entry.isFile()) continue;
    if (!entry.name.endsWith(".json")) continue;
    if (entry.name === "manifest.json") continue;
    if (keep.has(entry.name.slice(0, -".json".length))) continue;

    await fs.unlink(path.join(outputDir, entry.name));
    removed++;
  }

  return removed;
}

/**
 * Parse types and write individual component type files
 * @param componentIndexPath - Path to component index file
 * @param outputDir - Directory to write individual type files
 * @param propFilter - Optional custom prop filter
 * @returns Manifest mapping component names to filenames
 */
export async function parseTypesToFiles(
  componentIndexPath: string,
  outputDir: string,
  propFilter?: DocsBuilderConfig["propFilter"]
): Promise<Record<string, string>> {
  const processedTypes = await parseTypes({
    sources: { packagesDir: "", componentIndexPath },
    propFilter,
  });

  // Ensure output directory exists
  await fs.mkdir(outputDir, { recursive: true });

  // Write individual component type files and build manifest
  const manifest: Record<string, string> = {};

  for (const componentDoc of processedTypes) {
    const componentName = componentDoc.displayName;
    if (!componentName) continue;

    const filename = `${componentName}.json`;
    const filePath = `${outputDir}/${filename}`;

    // Write individual component type file
    await fs.writeFile(filePath, JSON.stringify(componentDoc, null, 2));

    // Add to manifest (without .json extension, similar to routes)
    manifest[componentName] = componentName;
  }

  // Drop type files from earlier runs that are no longer in the manifest
  const pruned = await pruneStaleTypeFiles(
    outputDir,
    new Set(Object.keys(manifest))
  );
  if (pruned > 0) {
    flog(`[TSX] Pruned ${pruned} stale type file(s) from ${outputDir}`);
  }

  // Write manifest file
  const manifestPath = `${outputDir}/manifest.json`;
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));

  return manifest;
}
