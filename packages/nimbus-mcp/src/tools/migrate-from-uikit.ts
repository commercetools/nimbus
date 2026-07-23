import { readFile } from "node:fs/promises";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  getUiKitMigration,
  getUiKitCompoundMigrations,
  getAllUiKitMigrations,
} from "../data/uikit-migration.js";
import { getRouteManifest } from "../data-loader.js";
import type {
  MigrateComponentResult,
  MigrateCompoundResult,
  MigrateFileResult,
  MigrateSuggestionResult,
  UnmappedComponent,
  UnmappedSuggestion,
  LoweredRelevanceFields,
  RouteManifestEntry,
} from "../types.js";
import {
  filterAndRankPreLowered,
  fuzzyScorePreLowered,
  toLoweredRouteFields,
  WEIGHTS,
} from "../utils/relevance.js";

// ---------------------------------------------------------------------------
// Import extraction
// ---------------------------------------------------------------------------

/**
 * Regex to match `@commercetools-uikit/*` per-package imports.
 * Skips `import type` statements (type-only imports don't need runtime migration).
 *
 * Captures:
 * - Group 1: default import name (e.g. "FieldErrors", "TextInput")
 * - Group 2: named imports block (e.g. "PrimaryButton, SecondaryButton")
 * - Group 3: package scope suffix (e.g. "buttons", "text-input")
 *
 * Handles:
 * - `import Default from '...'`
 * - `import { Named } from '...'`
 * - `import Default, { Named } from '...'` (combined, possibly multiline)
 *
 * ReDoS safety: no nested quantifiers; the negative lookahead is fixed-length.
 * Uses [\s\S] inside braces to handle multiline named imports.
 */
const UIKIT_IMPORT_REGEX =
  /import\s+(?!type\s)(?:(\w+)(?:\s*,\s*\{([^}]*?)\})?\s+from\s+|\{([^}]*?)\}\s+from\s+)['"]@commercetools-uikit\/([^'"]+)['"]/gs;

/**
 * Regex to match the `@commercetools-frontend/ui-kit` barrel import.
 * Skips `import type` statements. Only named imports are used with this path.
 *
 * Captures:
 * - Group 1: named imports (e.g. "Spacings, Grid, Card, Text")
 *
 * ReDoS safety: no nested quantifiers; the negative lookahead is fixed-length.
 */
const UIKIT_BARREL_IMPORT_REGEX =
  /import\s+(?!type\s)\{([^}]+)\}\s+from\s+['"]@commercetools-frontend\/ui-kit['"]/g;

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
  "localized-multiline-text-input": "LocalizedMultilineTextInput",
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
  text: "Text",
  label: "Label",
  tag: "Tag",
  stamp: "Stamp",
  link: "Link",
  card: "Card",
  grid: "Grid",
  avatar: "Avatar",
  tooltip: "Tooltip",
  pagination: "Pagination",
  spacings: "Spacings",
  constraints: "Constraints",
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
    // Groups: (1) default import, (2) named imports (combined with default),
    //         (3) named-only imports, (4) package name
    const defaultImport = match[1];
    const namedImports = match[2] || match[3];
    const packageName = match[4];

    // Process default import
    if (defaultImport) {
      const mapped = PACKAGE_TO_COMPONENT[packageName];
      if (mapped) {
        components.add(mapped);
      } else {
        components.add(defaultImport);
      }
    }

    // Process named imports, skipping type-only names (e.g. "type TFieldErrors")
    if (namedImports) {
      for (const name of namedImports.split(",")) {
        const trimmed = name
          .trim()
          .split(/\s+as\s+/)[0]
          .trim();
        if (trimmed && !trimmed.startsWith("type ")) components.add(trimmed);
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
// Case-insensitive lookup (pre-built for O(1) access)
// ---------------------------------------------------------------------------

/** Lazily built lowercase name → original uiKitName map. */
let _caseInsensitiveMap: Map<string, string> | undefined;

function getCaseInsensitiveMap(): Map<string, string> {
  if (!_caseInsensitiveMap) {
    _caseInsensitiveMap = new Map(
      getAllUiKitMigrations().map((e) => [
        e.uiKitName.toLowerCase(),
        e.uiKitName,
      ])
    );
  }
  return _caseInsensitiveMap;
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
  nimbusEquivalent: string | null,
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
  if (importPath === "@commercetools/nimbus" && nimbusEquivalent) {
    return `Use the get_component tool to see full API docs (e.g. get_component(name: "${nimbusEquivalent}"))`;
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

  if (entry.propMappings) result.propMappings = entry.propMappings;
  if (entry.iconWrapper) result.iconWrapper = entry.iconWrapper;

  const hint = deriveToolHint(
    uiKitName,
    entry.nimbusEquivalent,
    entry.importPath,
    entry.notes
  );
  if (hint) result.hint = hint;

  return result;
}

// ---------------------------------------------------------------------------
// Nimbus catalog suggestion for unmapped components
// ---------------------------------------------------------------------------

const GENERIC_UI_WORDS = new Set([
  "input",
  "field",
  "text",
  "button",
  "component",
  "panel",
  "container",
  "label",
  "control",
  "item",
  "group",
  "list",
  "wrapper",
  "provider",
  "manager",
]);

function splitPascalCase(name: string): string[] {
  return name.replace(/([a-z])([A-Z])/g, "$1 $2").split(/\s+/);
}

// Module-level cache for the component catalog and pre-lowered fields.
let _componentRoutes: RouteManifestEntry[] | undefined;
let _componentLowered:
  Map<RouteManifestEntry, LoweredRelevanceFields> | undefined;

async function getComponentCatalog(): Promise<{
  routes: RouteManifestEntry[];
  lowered: Map<RouteManifestEntry, LoweredRelevanceFields>;
}> {
  if (!_componentRoutes || !_componentLowered) {
    const manifest = await getRouteManifest();
    _componentRoutes = manifest.routes.filter(
      (r) => r.category === "Components" && r.menu.length === 3
    );
    _componentLowered = new Map();
    for (const r of _componentRoutes) {
      _componentLowered.set(r, toLoweredRouteFields(r));
    }
  }
  return { routes: _componentRoutes, lowered: _componentLowered };
}

/**
 * Returns the candidate with the highest word-overlap ratio against the
 * query words, or null if no candidate has any overlap (prevents confidently
 * wrong matches when only generic UI words are in play).
 */
function pickClosestByWordOverlap(
  candidates: RouteManifestEntry[],
  uiKitWords: string[]
): RouteManifestEntry | null {
  const wordSet = new Set(uiKitWords);
  let best: RouteManifestEntry | null = null;
  let bestRatio = 0;

  for (const c of candidates) {
    const exportWords = splitPascalCase(c.exportName ?? c.title).map((w) =>
      w.toLowerCase()
    );
    const overlap = exportWords.filter((w) => wordSet.has(w)).length;
    const ratio = overlap / exportWords.length;
    if (ratio > bestRatio) {
      bestRatio = ratio;
      best = c;
    }
  }

  return best;
}

async function findNimbusSuggestion(
  uiKitName: string
): Promise<UnmappedSuggestion | null> {
  const { routes, lowered } = await getComponentCatalog();

  const allWords = splitPascalCase(uiKitName).map((w) => w.toLowerCase());
  if (allWords.length === 0) return null;

  const distinctive = allWords.filter((w) => !GENERIC_UI_WORDS.has(w));
  const usingGenericFallback = distinctive.length === 0;
  const tokens = usingGenericFallback ? allWords : distinctive;

  const exactMatches = filterAndRankPreLowered(routes, tokens, (r) =>
    lowered.get(r)!
  );

  if (exactMatches.length > 0) {
    const best = pickClosestByWordOverlap(exactMatches, allWords);
    if (!best) return null;
    return {
      name: best.exportName ?? best.title,
      confidence: usingGenericFallback ? "medium" : "high",
    };
  }

  const minFuzzyScore = tokens.length * (WEIGHTS.title / 2);
  const fuzzyScored: Array<{ route: RouteManifestEntry; score: number }> = [];
  for (const r of routes) {
    const score = fuzzyScorePreLowered(lowered.get(r)!, tokens);
    if (score > 0) {
      fuzzyScored.push({ route: r, score });
    }
  }
  fuzzyScored.sort((a, b) => b.score - a.score);

  if (fuzzyScored.length > 0) {
    const best = fuzzyScored[0];
    if (best.score >= minFuzzyScore) {
      return {
        name: best.route.exportName ?? best.route.title,
        confidence: "medium",
      };
    }
  }

  return null;
}

async function buildUnmappedComponent(
  name: string
): Promise<UnmappedComponent> {
  const suggestion = await findNimbusSuggestion(name);
  const result: UnmappedComponent = { name };
  if (suggestion) result.suggestion = suggestion;
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
          const response: MigrateCompoundResult = {
            compoundRoot: componentName,
            note: `"${componentName}" is used as a namespace (e.g. ${compoundEntries.map((e) => e.uiKitName).join(", ")}). Each sub-component has its own mapping.`,
            mappings: compoundEntries.map((e) =>
              buildComponentResult(e.uiKitName)!
            ),
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

        // Try case-insensitive fallback via pre-built lowercase map.
        const fuzzy = getCaseInsensitiveMap().get(componentName.toLowerCase());
        if (fuzzy) {
          return {
            content: [
              {
                type: "text" as const,
                text: JSON.stringify(buildComponentResult(fuzzy)),
              },
            ],
          };
        }

        // Try suggesting a Nimbus component from the catalog
        const suggestion = await findNimbusSuggestion(componentName);
        if (suggestion) {
          const response: MigrateSuggestionResult = {
            uiKitName: componentName,
            suggestion,
          };
          response.hint = `Use the get_component tool to see full API docs (e.g. get_component(name: "${suggestion.name}"))`;
          return {
            content: [
              {
                type: "text" as const,
                text: JSON.stringify(response),
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
        const emptyResponse: MigrateFileResult = {
          filePath: filePath!,
          mappings: [],
          unmapped: [],
        };
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(emptyResponse),
            },
          ],
        };
      }

      const mappings: MigrateComponentResult[] = [];
      const unmappedNames: string[] = [];

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
          // use dynamic access or destructuring that the string search misses).
          const toInclude = used.length > 0 ? used : compoundEntries;
          for (const entry of toInclude) {
            mappings.push(buildComponentResult(entry.uiKitName)!);
          }
          continue;
        }
        unmappedNames.push(name);
      }

      const unmapped: UnmappedComponent[] = await Promise.all(
        unmappedNames.map(buildUnmappedComponent)
      );

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
