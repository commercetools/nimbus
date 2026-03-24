/**
 * Classifies Figma properties and generates .figma.tsx Code Connect files
 * deterministically — no LLM involvement.
 *
 * Usage:
 *   pnpm exec tsx .claude/skills/figma-code-connect/generate-code-connect.ts [component-name]
 *
 * Reads code-connect-data.json (produced by collect-figma-data.ts) and writes
 * .figma.tsx files directly into component directories.
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = process.cwd();
const DATA_FILE = join(__dirname, "code-connect-data.json");

// ---------------------------------------------------------------------------
// Types (matching collect-figma-data.ts output)
// ---------------------------------------------------------------------------

interface FigmaPropInfo {
  type: "VARIANT" | "BOOLEAN" | "TEXT" | "INSTANCE_SWAP";
  variantOptions?: string[];
  defaultValue?: string | boolean;
}

export interface CodeConnectEntry {
  component: string;
  dirName: string;
  subComponent?: string;
  figmaName: string;
  figmaUrl: string;
  figmaNodeId: string;
  figmaProps: Record<string, FigmaPropInfo>;
  codeMetadata: {
    exportName: string;
    isCompound: boolean;
    subComponents: string[];
    recipeVariants: Record<string, string[]>;
    typesProps: string[];
    files: {
      types: string | null;
      recipe: string | null;
      devDocs: string | null;
      stories: string | null;
      mainComponent: string | null;
      figmaOutput: string;
    };
  };
}

interface CodeConnectData {
  generated: string;
  figmaFileKey: string;
  entries: CodeConnectEntry[];
}

// ---------------------------------------------------------------------------
// Classification output types
// ---------------------------------------------------------------------------

import type { PropPosition } from "./code-connect-constants";
import {
  ALIAS_MAP,
  SOFT_ALIAS_MAP,
  VISUAL_STATE_VALUES,
  STATE_BOOLEAN_MAP,
  BOOLEAN_TRUE_VALUES,
  BOOLEAN_FALSE_VALUES,
  SELF_CLOSING_COMPONENTS,
  CONTAINER_SUB_COMPONENTS,
  KNOWN_VALID_PROPS,
  VISUAL_BOOLEAN_PROPS,
  VALUE_NORMALIZATIONS,
  OVERRIDES,
} from "./code-connect-constants";

interface ClassifiedProp {
  codePropName: string;
  code: string; // The figma.xxx() call code
  position: PropPosition;
}

interface ConnectSpec {
  comment?: string;
  codeComponent: string;
  figmaUrl: string;
  variant?: Record<string, string>;
  props: ClassifiedProp[];
  fixmes: string[]; // FIXME comments for unresolvable mappings
  exampleJsx?: string; // Override for the example body
  needsAriaLabel?: boolean;
  typesProps?: string[]; // For auto-generating example with children
  dirName?: string; // For self-closing detection
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Strip Figma internal property IDs: "Clear button#274:0" → "Clear button" */
function cleanPropName(name: string): string {
  return name.replace(/#\d+:\d+$/, "").trim();
}

/** Try to match a Figma enum value to a recipe variant value */
function matchEnumValue(
  figmaValue: string,
  recipeValues: string[]
): string | null {
  const lower = figmaValue.toLowerCase();

  // Exact match (case-insensitive)
  for (const rv of recipeValues) {
    if (rv.toLowerCase() === lower) return rv;
  }

  // Strip trailing "d" (Outlined → outline)
  if (lower.endsWith("d")) {
    const stripped = lower.slice(0, -1);
    for (const rv of recipeValues) {
      if (rv.toLowerCase() === stripped) return rv;
    }
  }

  return null;
}

/** Convert a string to camelCase (strips → prefix and #ID suffix) */
function toCamelCase(str: string): string {
  return str
    .replace(/^→\s*/, "")
    .replace(/[#\d:]+$/, "")
    .trim()
    .split(/[\s\-_]+/)
    .map((word, i) =>
      i === 0
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join("");
}

/** Format a key for use in an object literal */
function formatKey(key: string): string {
  return /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : JSON.stringify(key);
}

/** Format a value for code output */
function formatValue(value: string | number | boolean): string {
  if (typeof value === "string") return JSON.stringify(value);
  return String(value);
}

/** Check if a Figma prop name matches a code prop name (case-insensitive, ignore spaces) */
function matchesCodeProp(figmaName: string, codePropName: string): boolean {
  const a = figmaName.toLowerCase().replace(/[\s\-_]+/g, "");
  const b = codePropName.toLowerCase();
  return a === b;
}

/**
 * Find the best matching INSTANCE_SWAP for a BOOLEAN prop.
 * Returns the raw prop name of the matching instance, or null.
 */
function findMatchingInstance(
  boolName: string,
  allProps: Record<string, FigmaPropInfo>
): string | null {
  const boolWords = new Set(cleanPropName(boolName).toLowerCase().split(/\s+/));

  let bestMatch: string | null = null;
  let bestScore = 0;

  for (const [propName, prop] of Object.entries(allProps)) {
    if (prop.type !== "INSTANCE_SWAP") continue;
    const cleanName = cleanPropName(propName);
    const instanceWords = new Set(
      cleanName.replace(/^→\s*/, "").toLowerCase().split(/\s+/)
    );

    let score = 0;
    for (const word of boolWords) {
      if (instanceWords.has(word)) score++;
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = propName;
    }
  }

  return bestScore > 0 ? bestMatch : null;
}

// ---------------------------------------------------------------------------
// Prop Classification
// ---------------------------------------------------------------------------

interface ClassifyResult {
  props: ClassifiedProp[];
  fixmes: string[];
}

/** Check if a prop name exists on the component (in typesProps, recipeVariants, or KNOWN_VALID_PROPS) */
function isValidCodeProp(
  codePropName: string,
  typesProps: string[],
  recipeVariants: Record<string, string[]>
): boolean {
  return (
    KNOWN_VALID_PROPS.has(codePropName) ||
    typesProps.includes(codePropName) ||
    Object.keys(recipeVariants).includes(codePropName)
  );
}

function classifyProps(entry: CodeConnectEntry): ClassifyResult {
  const props: ClassifiedProp[] = [];
  const fixmes: string[] = [];
  const { figmaProps, codeMetadata } = entry;
  const { recipeVariants, typesProps } = codeMetadata;

  // Determine which override applies
  const override =
    OVERRIDES[entry.dirName]?.entries?.[entry.subComponent ?? ""];
  const skipFigmaProps = new Set(override?.skipFigmaProps ?? []);

  // First pass: pair BOOLEANs with INSTANCE_SWAPs
  const consumedInstances = new Set<string>();
  const boolInstancePairs = new Map<string, string>();

  for (const [propName, prop] of Object.entries(figmaProps)) {
    if (prop.type !== "BOOLEAN") continue;
    const cleanName = cleanPropName(propName);
    if (skipFigmaProps.has(cleanName)) continue;

    const matchingInstance = findMatchingInstance(propName, figmaProps);
    if (matchingInstance) {
      boolInstancePairs.set(propName, matchingInstance);
      consumedInstances.add(matchingInstance);
    }
  }

  // Process each Figma prop
  for (const [rawPropName, prop] of Object.entries(figmaProps)) {
    const cleanName = cleanPropName(rawPropName);
    const lowerClean = cleanName.toLowerCase();

    // Skip overridden props
    if (skipFigmaProps.has(cleanName)) continue;

    // Skip consumed instances (handled by boolean pairing)
    if (consumedInstances.has(rawPropName)) continue;

    // Skip globally known visual-only boolean props (no NOTE needed)
    if (prop.type === "BOOLEAN" && VISUAL_BOOLEAN_PROPS.has(lowerClean))
      continue;

    switch (prop.type) {
      case "INSTANCE_SWAP": {
        const codePropName = ALIAS_MAP[lowerClean] || toCamelCase(cleanName);
        const position: PropPosition =
          lowerClean.includes("left") || lowerClean.includes("leading")
            ? "leading"
            : lowerClean.includes("right") || lowerClean.includes("trailing")
              ? "trailing"
              : "child";
        if (isValidCodeProp(codePropName, typesProps, recipeVariants)) {
          props.push({
            codePropName,
            code: `figma.instance("${cleanName}")`,
            position,
          });
        } else {
          fixmes.push(
            `Skipped INSTANCE_SWAP "${cleanName}" → no matching code prop "${codePropName}"`
          );
        }
        break;
      }

      case "BOOLEAN": {
        const matchingInstance = boolInstancePairs.get(rawPropName);
        if (matchingInstance) {
          const instanceCleanName = cleanPropName(matchingInstance);
          const codePropName = ALIAS_MAP[lowerClean] || toCamelCase(cleanName);
          const position: PropPosition =
            lowerClean.includes("left") || lowerClean.includes("leading")
              ? "leading"
              : lowerClean.includes("right") || lowerClean.includes("trailing")
                ? "trailing"
                : "child";
          if (isValidCodeProp(codePropName, typesProps, recipeVariants)) {
            props.push({
              codePropName,
              code: `figma.boolean("${cleanName}", { true: figma.instance("${instanceCleanName}"), false: undefined })`,
              position,
            });
          } else {
            fixmes.push(
              `Skipped BOOLEAN+INSTANCE "${cleanName}" → no matching code prop "${codePropName}"`
            );
          }
        } else {
          // Standalone boolean — only include if it maps to an actual code prop
          const aliasResolved = ALIAS_MAP[lowerClean];
          const codePropName =
            aliasResolved ||
            SOFT_ALIAS_MAP[lowerClean] ||
            toCamelCase(cleanName);
          if (isValidCodeProp(codePropName, typesProps, recipeVariants)) {
            props.push({
              codePropName,
              code: `figma.boolean("${cleanName}")`,
              position: "attribute",
            });
          } else {
            fixmes.push(
              `Skipped BOOLEAN "${cleanName}" → no matching code prop found`
            );
          }
        }
        break;
      }

      case "TEXT": {
        const codePropName = ALIAS_MAP[lowerClean] || "children";
        if (
          codePropName === "children" ||
          isValidCodeProp(codePropName, typesProps, recipeVariants)
        ) {
          props.push({
            codePropName,
            code: `figma.string("${cleanName}")`,
            position: codePropName === "children" ? "child" : "attribute",
          });
        } else {
          fixmes.push(
            `Skipped TEXT "${cleanName}" → no matching code prop "${codePropName}"`
          );
        }
        break;
      }

      case "VARIANT": {
        const options = prop.variantOptions || [];
        const lowerOptions = options.map((o) => o.toLowerCase());

        // --- State decomposition ---
        if (lowerClean === "state") {
          for (const option of options) {
            const lo = option.toLowerCase();
            if (VISUAL_STATE_VALUES.has(lo)) continue;
            const codePropName = STATE_BOOLEAN_MAP[lo];
            // Validate state-decomposed prop exists on this component
            if (
              codePropName &&
              isValidCodeProp(codePropName, typesProps, recipeVariants)
            ) {
              props.push({
                codePropName,
                code: `figma.enum("${cleanName}", { ${formatKey(option)}: true })`,
                position: "attribute",
              });
            } else if (codePropName) {
              fixmes.push(
                `Skipped State "${option}" → "${codePropName}" not found on component`
              );
            }
          }
          break;
        }

        // --- Boolean-like VARIANT (YES/NO, On/Off, True/False) ---
        const hasTrueVal = lowerOptions.some((o) => BOOLEAN_TRUE_VALUES.has(o));
        const hasFalseVal = lowerOptions.some((o) =>
          BOOLEAN_FALSE_VALUES.has(o)
        );

        if (hasTrueVal && hasFalseVal && options.length === 2) {
          const trueOption = options.find((o) =>
            BOOLEAN_TRUE_VALUES.has(o.toLowerCase())
          )!;
          const aliasResolved = ALIAS_MAP[lowerClean];
          const codePropName = aliasResolved || toCamelCase(cleanName);

          // Validate the prop exists in code
          if (isValidCodeProp(codePropName, typesProps, recipeVariants)) {
            props.push({
              codePropName,
              code: `figma.enum("${cleanName}", { ${formatKey(trueOption)}: true })`,
              position: "attribute",
            });
          } else {
            fixmes.push(
              `Skipped VARIANT "${cleanName}" (boolean-like) → no matching code prop "${codePropName}"`
            );
          }
          break;
        }

        // --- Standard VARIANT → enum mapping ---
        // Resolve code prop name
        const aliasResolved = ALIAS_MAP[lowerClean] || null;
        let codePropName = aliasResolved;

        if (!codePropName) {
          for (const recipeVarName of Object.keys(recipeVariants)) {
            if (matchesCodeProp(cleanName, recipeVarName)) {
              codePropName = recipeVarName;
              break;
            }
          }
        }

        if (!codePropName) {
          for (const typeProp of typesProps) {
            if (matchesCodeProp(cleanName, typeProp)) {
              codePropName = typeProp;
              break;
            }
          }
        }

        if (!codePropName) {
          codePropName = toCamelCase(cleanName);
        }

        // Validate the prop exists in code (skip unknown props)
        if (!isValidCodeProp(codePropName, typesProps, recipeVariants)) {
          fixmes.push(
            `Skipped VARIANT "${cleanName}" [${options.join(", ")}] → no matching code prop "${codePropName}"`
          );
          break; // Skip unknown prop
        }

        // Build value mapping
        const isColorPalette = codePropName === "colorPalette";
        const recipeValues = recipeVariants[codePropName] ?? null;

        const valueMapping: Record<string, string | number | boolean> = {};

        for (const option of options) {
          if (isColorPalette) {
            valueMapping[option] = option.toLowerCase();
          } else if (recipeValues) {
            const match = matchEnumValue(option, recipeValues);
            if (match) {
              valueMapping[option] = match;
            }
            // If recipe exists but no match, skip this value (don't guess)
          } else {
            // No recipe — apply known normalizations, then fall back to lowercase
            const lower = option.toLowerCase();
            valueMapping[option] = VALUE_NORMALIZATIONS[lower] ?? lower;
          }
        }

        if (Object.keys(valueMapping).length > 0) {
          const valuesCode = Object.entries(valueMapping)
            .map(([k, v]) => `${formatKey(k)}: ${formatValue(v)}`)
            .join(", ");

          props.push({
            codePropName,
            code: `figma.enum("${cleanName}", { ${valuesCode} })`,
            position: "attribute",
          });
        }
        break;
      }
    }
  }

  // Add figma.children("*") for compound container sub-components
  if (
    entry.codeMetadata.isCompound &&
    (!entry.subComponent || CONTAINER_SUB_COMPONENTS.has(entry.subComponent))
  ) {
    if (!props.some((p) => p.codePropName === "children")) {
      props.push({
        codePropName: "children",
        code: `figma.children("*")`,
        position: "children",
      });
    }
  }

  // Apply raw prop overrides
  if (override?.rawProps) {
    for (const [codePropName, rawProp] of Object.entries(override.rawProps)) {
      // Remove any auto-classified prop with the same name
      const existingIdx = props.findIndex(
        (p) => p.codePropName === codePropName
      );
      if (existingIdx !== -1) props.splice(existingIdx, 1);

      props.push({
        codePropName,
        code: rawProp.code,
        position: rawProp.position,
      });
    }
  }

  // Deduplicate props by codePropName (keep first occurrence)
  const seen = new Set<string>();
  const dedupedProps = props.filter((p) => {
    if (seen.has(p.codePropName)) return false;
    seen.add(p.codePropName);
    return true;
  });

  return { props: dedupedProps, fixmes };
}

// ---------------------------------------------------------------------------
// Code Generation
// ---------------------------------------------------------------------------

function generatePropsBlock(props: ClassifiedProp[]): string {
  if (props.length === 0) return "";
  const lines = props.map((p) => `      ${p.codePropName}: ${p.code},`);
  return `    props: {\n${lines.join("\n")}\n    },`;
}

function generateExampleJsx(
  componentRef: string,
  props: ClassifiedProp[],
  typesProps: string[],
  needsAriaLabel: boolean,
  dirName?: string
): string {
  const attrProps = props.filter((p) => p.position === "attribute");
  const leadingProps = props.filter((p) => p.position === "leading");
  const trailingProps = props.filter((p) => p.position === "trailing");
  const childProps = props.filter((p) => p.position === "child");
  const childrenProp = props.find((p) => p.position === "children");

  // Build attributes
  const attrs: string[] = [];
  if (needsAriaLabel) attrs.push('aria-label="Action"');
  for (const p of attrProps) {
    attrs.push(`${p.codePropName}={props.${p.codePropName}}`);
  }

  // Build children content
  const children: string[] = [];

  // Leading slots
  for (const p of leadingProps) children.push(`{props.${p.codePropName}}`);

  // Text content
  const textChild = childProps.find((p) => p.code.startsWith("figma.string"));
  const nonTextChildren = childProps.filter(
    (p) => !p.code.startsWith("figma.string")
  );

  const isSelfClosing = dirName ? SELF_CLOSING_COMPONENTS.has(dirName) : false;

  if (textChild) {
    children.push(`{props.${textChild.codePropName}}`);
  } else if (!isSelfClosing) {
    const needsLabelPlaceholder =
      !childrenProp &&
      nonTextChildren.length === 0 &&
      (leadingProps.length > 0 ||
        trailingProps.length > 0 ||
        attrProps.length > 0 ||
        typesProps.includes("children"));

    if (needsLabelPlaceholder) {
      children.push("{/* label placeholder */}");
    }
  }

  // Non-text child props (standalone instances, etc.)
  for (const p of nonTextChildren) children.push(`{props.${p.codePropName}}`);

  // Trailing slots
  for (const p of trailingProps) children.push(`{props.${p.codePropName}}`);

  // figma.children("*")
  if (childrenProp) children.push(`{props.children}`);

  // Format
  const attrStr =
    attrs.length > 0 ? `\n        ${attrs.join("\n        ")}\n      ` : "";

  if (children.length === 0) {
    return `<${componentRef}${attrStr}/>`;
  }

  const childrenStr = children.map((c) => `        ${c}`).join("\n");
  return `<${componentRef}${attrStr}>\n${childrenStr}\n      </${componentRef}>`;
}

function generateConnectBlock(spec: ConnectSpec): string {
  const lines: string[] = [];

  if (spec.comment) lines.push(`// ${spec.comment}`);

  // Emit NOTE comments for skipped Figma props
  for (const fixme of spec.fixmes) {
    lines.push(`// NOTE: ${fixme}`);
  }

  lines.push(`figma.connect(`);
  lines.push(`  ${spec.codeComponent},`);
  lines.push(`  "${spec.figmaUrl}",`);
  lines.push(`  {`);

  if (spec.variant) {
    const entries = Object.entries(spec.variant)
      .map(([k, v]) => `${JSON.stringify(k)}: ${JSON.stringify(v)}`)
      .join(", ");
    lines.push(`    variant: { ${entries} },`);
  }

  if (spec.props.length > 0) {
    lines.push(generatePropsBlock(spec.props));
  }

  const hasProps = spec.props.length > 0;

  if (spec.exampleJsx) {
    // When using an overridden example, only add (props) if the JSX references props
    const examplePropsParam = spec.exampleJsx.includes("props.")
      ? "(props)"
      : "()";
    lines.push(`    example: ${examplePropsParam} => (`);
    lines.push(`      ${spec.exampleJsx}`);
    lines.push(`    ),`);
  } else {
    // Auto-generate example
    const propsParam = hasProps ? "(props)" : "()";
    const jsx = generateExampleJsx(
      spec.codeComponent,
      spec.props,
      spec.typesProps ?? [],
      spec.needsAriaLabel || false,
      spec.dirName
    );
    lines.push(`    example: ${propsParam} => (`);
    lines.push(`      ${jsx}`);
    lines.push(`    ),`);
  }

  lines.push(`  }`);
  lines.push(`);`);

  return lines.join("\n");
}

function generateFile(
  dirName: string,
  exportName: string,
  connects: ConnectSpec[],
  extraImports: string[] = [],
  extraConnectsCode?: string
): string {
  const lines: string[] = [];

  lines.push(`import figma from "@figma/code-connect/react";`);

  // Only add default component import if there are connect blocks that reference it
  // (skip when all entries are overridden and extraImports handle the imports)
  // Check if extraImports already import the same export name (exact word match)
  const importPattern = new RegExp(`\\b${exportName}\\b`);
  const hasExtraImportForExport = extraImports.some((imp) =>
    importPattern.test(imp)
  );
  if (connects.length > 0 && !hasExtraImportForExport) {
    lines.push(`import { ${exportName} } from "./${dirName}";`);
  }
  for (const imp of extraImports) lines.push(imp);
  lines.push("");

  for (let i = 0; i < connects.length; i++) {
    if (i > 0) lines.push("");
    lines.push(generateConnectBlock(connects[i]));
  }

  if (extraConnectsCode) {
    lines.push(extraConnectsCode);
  }

  lines.push("");
  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  if (!existsSync(DATA_FILE)) {
    console.error(`Data file not found: ${DATA_FILE}`);
    console.error("Run collect-figma-data.ts first.");
    process.exit(1);
  }

  const data: CodeConnectData = JSON.parse(readFileSync(DATA_FILE, "utf-8"));
  const filterComponent = process.argv[2] || null;

  // Group entries by dirName
  const byDir = new Map<string, CodeConnectEntry[]>();
  for (const entry of data.entries) {
    if (filterComponent && entry.dirName !== filterComponent) continue;
    if (!byDir.has(entry.dirName)) byDir.set(entry.dirName, []);
    byDir.get(entry.dirName)!.push(entry);
  }

  let filesWritten = 0;
  const warnings: string[] = [];

  for (const [dirName, entries] of byDir) {
    const exportName = entries[0].codeMetadata.exportName;
    const outputPath = join(ROOT, entries[0].codeMetadata.files.figmaOutput);
    const override = OVERRIDES[dirName];

    // Build connect specs for each entry
    const connects: ConnectSpec[] = [];

    for (const entry of entries) {
      const subComponent = entry.subComponent ?? "";
      const entryOverride = override?.entries?.[subComponent];

      // Skip entries marked for manual handling
      if (entryOverride?.skip) continue;

      const { props: classified, fixmes } = classifyProps(entry);
      const codeComponent = entry.subComponent
        ? `${exportName}.${entry.subComponent}`
        : exportName;

      const needsAriaLabel =
        dirName === "icon-button" || dirName === "icon-toggle-button";

      connects.push({
        comment:
          entries.length > 1
            ? `--- ${entry.figmaName} → ${codeComponent} ---`
            : undefined,
        codeComponent,
        figmaUrl: entry.figmaUrl,
        props: classified,
        fixmes,
        exampleJsx: entryOverride?.exampleJsx,
        needsAriaLabel,
        typesProps: entry.codeMetadata.typesProps,
        dirName: entry.dirName,
      });
    }

    // Generate extra connect code
    const extraConnectsCode = override?.extraConnects?.(entries);
    const extraImports = override?.extraImports ?? [];

    const content = generateFile(
      dirName,
      exportName,
      connects,
      extraImports,
      extraConnectsCode
    );

    // Write file
    writeFileSync(outputPath, content, "utf-8");

    // Format with prettier
    try {
      execSync(`pnpm exec prettier --write "${outputPath}"`, {
        stdio: "pipe",
        cwd: ROOT,
      });
    } catch {
      warnings.push(`  prettier failed for ${dirName}`);
    }

    filesWritten++;
    console.log(
      `  Generated: ${exportName} (${connects.length} connect${connects.length > 1 ? "s" : ""})`
    );
  }

  // Clean up data file
  try {
    execSync(`rm "${DATA_FILE}"`, { stdio: "pipe" });
    console.log("\nCleaned up code-connect-data.json");
  } catch {
    // ignore
  }

  console.log(`\n=== Summary ===`);
  console.log(`Files generated: ${filesWritten}`);
  if (warnings.length > 0) {
    console.log(`\nWarnings:`);
    for (const w of warnings) console.log(w);
  }
  console.log(`\nRun 'git diff' to review changes.`);
}

main();
