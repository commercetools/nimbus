import { readFile } from "node:fs/promises";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  getUiKitMigration,
  getUiKitCompoundMigrations,
  getAllUiKitMigrations,
} from "../data/uikit-migration.js";
import type { MigrateComponentResult, MigrateFileResult } from "../types.js";

// ---------------------------------------------------------------------------
// Import extraction
// ---------------------------------------------------------------------------

/**
 * Regex to match `@commercetools-uikit/*` per-package imports.
 *
 * Captures:
 * - Group 1: named imports (e.g. "PrimaryButton, SecondaryButton")
 * - Group 2: default import name
 * - Group 3: package scope suffix (e.g. "buttons", "text-input")
 *
 * Handles both `import { X } from '...'` and `import X from '...'` forms.
 */
const UIKIT_IMPORT_REGEX =
  /import\s+(?:\{([^}]+)\}|(\w+))\s+from\s+['"]@commercetools-uikit\/([^'"]+)['"]/g;

/**
 * Regex to match the `@commercetools-frontend/ui-kit` barrel import.
 * Only named imports are used with this path.
 *
 * Captures:
 * - Group 1: named imports (e.g. "Spacings, Grid, Card, Text")
 */
const UIKIT_BARREL_IMPORT_REGEX =
  /import\s+\{([^}]+)\}\s+from\s+['"]@commercetools-frontend\/ui-kit['"]/g;

/**
 * Maps common UI Kit package names to the component names used in the
 * migration database. Package names use kebab-case; migration data uses
 * PascalCase component names.
 */
const PACKAGE_TO_COMPONENT: Record<string, string> = {
  // Packages whose name differs from the exported component
  buttons: "PrimaryButton", // multi-export; we'll use named imports instead
  "flat-button": "FlatButton",
  "link-button": "LinkButton",
  "primary-button": "PrimaryButton",
  "secondary-button": "SecondaryButton",
  "icon-button": "IconButton",
  "text-input": "TextInput",
  "number-input": "NumberInput",
  "money-input": "MoneyInput",
  "password-input": "PasswordInput",
  "multiline-text-input": "MultilineTextInput",
  "rich-text-input": "RichTextInput",
  "date-input": "DateInput",
  "date-time-input": "DateTimeInput",
  "date-range-input": "DateRangeInput",
  "time-input": "TimeInput",
  "search-text-input": "SearchTextInput",
  "checkbox-input": "CheckboxInput",
  "radio-input": "RadioInput",
  "toggle-input": "ToggleInput",
  "localized-text-input": "LocalizedTextInput",
  "localized-multiline-text-input": "LocalizedMultilineTextField",
  "localized-rich-text-input": "LocalizedRichTextInput",
  "loading-spinner": "LoadingSpinner",
  "progress-bar": "ProgressBar",
  "data-table": "DataTable",
  "data-table-manager": "DataTableManager",
  "dropdown-menu": "DropdownMenu",
  "content-notification": "ContentNotification",
  "accessible-button": "AccessibleButton",
  "accessible-hidden": "AccessibleHidden",
  "hidden-input": "HiddenInput",
  "collapsible-panel": "CollapsiblePanel",
  "collapsible-motion": "CollapsibleMotion",
  "field-errors": "FieldErrors",
  text: "Text.Body",
  label: "Label",
  tag: "Tag",
  stamp: "Stamp",
  link: "Link",
  card: "Card",
  grid: "Grid",
  avatar: "Avatar",
  tooltip: "Tooltip",
  pagination: "Pagination",
  spacings: "Spacings.Stack",
  constraints: "Constraints.Horizontal",
  icons: "Icon Library",
  "inline-svg": "InlineSvg",
};

/**
 * Extracts UI Kit component names from file content.
 * Returns deduplicated component names suitable for migration lookup.
 */
function extractUiKitComponents(fileContent: string): string[] {
  const components = new Set<string>();

  let match: RegExpExecArray | null;
  // Reset lastIndex since we reuse the regex
  UIKIT_IMPORT_REGEX.lastIndex = 0;

  while ((match = UIKIT_IMPORT_REGEX.exec(fileContent)) !== null) {
    const namedImports = match[1];
    const defaultImport = match[2];
    const packageName = match[3];

    if (namedImports) {
      // Named imports: `import { PrimaryButton, SecondaryButton } from '...'`
      for (const name of namedImports.split(",")) {
        const trimmed = name
          .trim()
          .split(/\s+as\s+/)[0]
          .trim();
        if (trimmed) components.add(trimmed);
      }
    } else if (defaultImport) {
      // Default import: `import TextInput from '@commercetools-uikit/text-input'`
      // Try the package-to-component map first, then use the import name
      const mapped = PACKAGE_TO_COMPONENT[packageName];
      if (mapped) {
        components.add(mapped);
      } else {
        components.add(defaultImport);
      }
    }
  }

  // Barrel imports: `import { Spacings, Grid, Card } from '@commercetools-frontend/ui-kit'`
  UIKIT_BARREL_IMPORT_REGEX.lastIndex = 0;
  while ((match = UIKIT_BARREL_IMPORT_REGEX.exec(fileContent)) !== null) {
    for (const name of match[1].split(",")) {
      const trimmed = name
        .trim()
        .split(/\s+as\s+/)[0]
        .trim();
      if (trimmed) components.add(trimmed);
    }
  }

  return [...components];
}

// ---------------------------------------------------------------------------
// Result builders
// ---------------------------------------------------------------------------

/**
 * Derives a hint suggesting which MCP tool to use for further assistance.
 * Returns undefined if no specific tool is more useful than general docs.
 */
function deriveToolHint(
  uiKitName: string,
  importPath: string | null,
  notes: string
): string | undefined {
  // Icon search — components that map to icons, not icon *buttons*
  if (importPath === "@commercetools/nimbus-icons") {
    return 'Use the search_icons tool to find Nimbus icons by name (e.g. search_icons(query: "arrow"))';
  }
  if (
    uiKitName === "CustomIcon" ||
    uiKitName === "LeadingIcon" ||
    uiKitName === "InlineSvg"
  ) {
    return 'Use the search_icons tool to find the Nimbus equivalent icon (e.g. search_icons(query: "checkmark"))';
  }

  // Token lookup — entries that map to design tokens or reference token values
  if (importPath === "@commercetools/nimbus-tokens") {
    return 'Use the get_tokens tool to browse available design tokens (e.g. get_tokens(category: "spacing"))';
  }
  if (notes.includes("spacing token") || notes.includes("design token")) {
    return 'Use the get_tokens tool to find the correct token values (e.g. get_tokens(category: "spacing"))';
  }

  // Component lookup — entries that map to a specific Nimbus component
  if (importPath === "@commercetools/nimbus") {
    return 'Use the get_component tool to see full API docs for the Nimbus equivalent (e.g. get_component(name: "Button"))';
  }

  return undefined;
}

function buildComponentResult(
  uiKitName: string
): MigrateComponentResult | null {
  const entry = getUiKitMigration(uiKitName);
  if (!entry) return null;

  const result: MigrateComponentResult = {
    uiKitName: entry.uiKitName,
    nimbusEquivalent: entry.nimbusEquivalent,
    importPath: entry.importPath,
    mappingType: entry.mappingType,
    notes: entry.notes,
    breakingChanges: entry.breakingChanges,
  };

  const hint = deriveToolHint(uiKitName, entry.importPath, entry.notes);
  if (hint) result.hint = hint;

  return result;
}

// ---------------------------------------------------------------------------
// Tool registration
// ---------------------------------------------------------------------------

/**
 * Registers the `migrate_from_uikit` tool on the given MCP server.
 *
 * Two modes:
 * - `componentName`: look up a single UI Kit component's Nimbus equivalent
 * - `filePath`: read a file, extract all `@commercetools-uikit/*` imports,
 *   and return migration mappings for each
 */
export function registerMigrateFromUiKit(server: McpServer): void {
  server.registerTool(
    "migrate_from_uikit",
    {
      title: "Migrate from UI Kit",
      description:
        "Returns migration mapping data for UI Kit components to their Nimbus equivalents. " +
        "Use componentName for a single lookup, or filePath to extract all UI Kit imports from a file " +
        "and get mappings for each. The MCP provides data; the LLM does the actual code rewriting.",
      inputSchema: {
        componentName: z
          .string()
          .optional()
          .describe(
            'UI Kit component name to look up, e.g. "PrimaryButton", "TextInput", "CollapsiblePanel".'
          ),
        filePath: z
          .string()
          .optional()
          .describe(
            "Absolute path to a source file. Extracts @commercetools-uikit/* imports and returns mappings for all found components."
          ),
      },
    },
    async ({ componentName, filePath }) => {
      // Validate: at least one param required
      if (!componentName && !filePath) {
        return {
          content: [
            {
              type: "text" as const,
              text: 'Either "componentName" or "filePath" must be provided.',
            },
          ],
          isError: true,
        };
      }

      // Mode 1: Single component lookup
      if (componentName) {
        const result = buildComponentResult(componentName);
        if (result) {
          return {
            content: [
              {
                type: "text" as const,
                text: JSON.stringify(result),
              },
            ],
          };
        }

        // Check if this is a compound root (e.g. "Spacings" → Spacings.Stack, Spacings.Inline, ...)
        const compoundEntries = getUiKitCompoundMigrations(componentName);
        if (compoundEntries) {
          return {
            content: [
              {
                type: "text" as const,
                text: JSON.stringify({
                  compoundRoot: componentName,
                  note: `"${componentName}" is used as a namespace (e.g. ${compoundEntries.map((e) => e.uiKitName).join(", ")}). Each sub-component has its own mapping.`,
                  mappings: compoundEntries.map((e) =>
                    buildComponentResult(e.uiKitName)
                  ),
                }),
              },
            ],
          };
        }

        // Try case-insensitive search across all migrations
        const all = getAllUiKitMigrations();
        const needle = componentName.toLowerCase();
        const fuzzy = all.find((e) => e.uiKitName.toLowerCase() === needle);
        if (fuzzy) {
          return {
            content: [
              {
                type: "text" as const,
                text: JSON.stringify(buildComponentResult(fuzzy.uiKitName)),
              },
            ],
          };
        }

        return {
          content: [
            {
              type: "text" as const,
              text: `No migration mapping found for "${componentName}". Use a UI Kit component name like "PrimaryButton", "TextInput", etc.`,
            },
          ],
          isError: true,
        };
      }

      // Mode 2: File import extraction
      let fileContent: string;
      try {
        fileContent = await readFile(filePath!, "utf-8");
      } catch {
        return {
          content: [
            {
              type: "text" as const,
              text: `Could not read file "${filePath}".`,
            },
          ],
          isError: true,
        };
      }

      const componentNames = extractUiKitComponents(fileContent);

      if (componentNames.length === 0) {
        return {
          content: [
            {
              type: "text" as const,
              text: `No @commercetools-uikit imports found in "${filePath}".`,
            },
          ],
        };
      }

      const mappings: MigrateComponentResult[] = [];
      const unmapped: string[] = [];

      for (const name of componentNames) {
        const result = buildComponentResult(name);
        if (result) {
          mappings.push(result);
          continue;
        }
        // Expand compound roots, filtered to only sub-components actually
        // used in the file (e.g. "Spacings" → only Spacings.Stack if that's
        // the only usage found).
        const compoundEntries = getUiKitCompoundMigrations(name);
        if (compoundEntries) {
          const used = compoundEntries.filter((entry) =>
            fileContent.includes(entry.uiKitName)
          );
          // If no specific sub-components detected, return all (the file may
          // use dynamic access or the regex may not catch every pattern).
          const toInclude = used.length > 0 ? used : compoundEntries;
          for (const entry of toInclude) {
            mappings.push(buildComponentResult(entry.uiKitName)!);
          }
          continue;
        }
        unmapped.push(name);
      }

      const response: MigrateFileResult = {
        filePath: filePath!,
        mappings,
        unmapped,
      };

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response),
          },
        ],
      };
    }
  );
}
