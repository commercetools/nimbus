import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { z } from "zod";
import {
  getRouteManifest,
  getRouteData,
  getTypeData,
  getDataDir,
} from "../data-loader.js";
import type {
  RouteManifestEntry,
  TypeData,
  FilteredProp,
  ComponentMetadata,
} from "../types.js";
import { stripMarkdown } from "../utils/markdown.js";
import { fuzzyResolveName } from "../utils/relevance.js";

// ---------------------------------------------------------------------------
// Section definitions
// ---------------------------------------------------------------------------

/** Canonical section keys accepted by the tool. */
const SECTION_KEYS = [
  "overview",
  "guidelines",
  "implementation",
  "accessibility",
  "props",
] as const;

/**
 * Maps our canonical section keys to the view keys used in the route JSON.
 * "props" and "recipe" are synthesised from type/recipe data, not from views.
 */
const VIEW_KEY_MAP: Record<string, string> = {
  overview: "overview",
  guidelines: "guidelines",
  implementation: "dev",
  accessibility: "a11y",
};

// ---------------------------------------------------------------------------
// Props filtering
// ---------------------------------------------------------------------------

/**
 * Parent type names that indicate low-level inherited props which should be
 * filtered out.  This matches the docs-site filter in nimbus-docs-build so
 * the MCP tool returns the same prop set as the API reference page.
 */
const INHERITED_PARENT_NAMES = new Set([
  // Low-level HTML / DOM
  "HTMLAttributes",
  "DOMAttributes",
  "ButtonHTMLAttributes",
  "GlobalDOMEvents",
  "GlobalDOMAttributes",
  "AriaAttributes",
  "HtmlProps",
  // Chakra system internals
  "SystemProperties",
  "Conditions",
]);

/** Props excluded by name (matches docs-site filter). */
const EXCLUDED_PROP_NAMES = new Set(["key"]);

/** Filters type data to match the docs-site API reference. */
function filterProps(typeData: TypeData): FilteredProp[] {
  return Object.values(typeData.props)
    .filter(
      (p) =>
        !EXCLUDED_PROP_NAMES.has(p.name) &&
        (!p.parent || !INHERITED_PARENT_NAMES.has(p.parent.name))
    )
    .map((p) => {
      const prop: FilteredProp = {
        name: p.name,
        type: p.type.name,
        required: p.required,
        description: p.description,
      };
      if (p.defaultValue) prop.defaultValue = p.defaultValue.value;
      return prop;
    });
}

// ---------------------------------------------------------------------------
// Module-level caches
// ---------------------------------------------------------------------------

/** Cached catalog for resolveComponent. */
let resolveCatalogCache: RouteManifestEntry[] | undefined;
/** Keyed against manifest.routes (stable lazy-loaded ref) for cache invalidation. */
let resolveCatalogRoutesRef: RouteManifestEntry[] | undefined;

/** Cached set of top-level export names for sub-component filtering. */
let topLevelNamesCache: Set<string> | undefined;
let topLevelNamesRoutesRef: RouteManifestEntry[] | undefined;

/**
 * For compound components (e.g. Drawer → DrawerRoot, DrawerContent, …),
 * the top-level type file has no props. This function finds all sub-component
 * type files matching `${exportName}*.json`, aggregates their filtered props,
 * and tags each prop with the sub-component name.
 */
async function aggregateSubComponentProps(
  exportName: string
): Promise<FilteredProp[]> {
  const typesDir = resolve(getDataDir(), "docs/types");
  let files: string[];
  try {
    files = await readdir(typesDir);
  } catch {
    return [];
  }

  // Build (and cache) a set of top-level component export names so we can
  // exclude them from sub-component candidates (e.g. "Icon" should not pull
  // in "IconButton"). Cache is invalidated when the manifest routes reference
  // changes (e.g. hot-reload).
  const manifest = await getRouteManifest();
  if (!topLevelNamesCache || topLevelNamesRoutesRef !== manifest.routes) {
    topLevelNamesCache = new Set(
      manifest.routes
        .filter((r) => CATALOG_CATEGORIES.has(r.category))
        .map((r) => (r.exportName ?? r.title).toLowerCase())
    );
    topLevelNamesRoutesRef = manifest.routes;
  }
  const topLevelNames = topLevelNamesCache;

  const prefix = exportName.toLowerCase();
  const subFiles = files.filter((f) => {
    const base = f.replace(/\.json$/, "");
    const baseLower = base.toLowerCase();
    return (
      f.endsWith(".json") &&
      baseLower.startsWith(prefix) &&
      baseLower !== prefix && // exclude the top-level file itself
      !base.includes(".") && // exclude method exports (e.g. FieldErrors.getBuiltInMessage)
      !base.endsWith("Props") && // exclude type-only duplicates (e.g. StepsRootProps)
      !topLevelNames.has(baseLower) // exclude standalone top-level components
    );
  });

  const settled = await Promise.allSettled(
    subFiles.map(async (file) => {
      const subName = file.replace(/\.json$/, "");
      const typeData = await getTypeData(subName);
      return filterProps(typeData).map((p) => ({
        ...p,
        subComponent: subName,
      }));
    })
  );

  return settled
    .filter((r) => r.status === "fulfilled")
    .flatMap((r) => (r as PromiseFulfilledResult<FilteredProp[]>).value);
}

// ---------------------------------------------------------------------------
// Route resolution helpers
// ---------------------------------------------------------------------------

/** Categories that contain individual component/pattern pages. */
const CATALOG_CATEGORIES = new Set(["Components", "Patterns"]);

/**
 * Resolves a component or pattern name to its manifest entry.
 * Pass 1: exact match (case-insensitive) against exportName, title, or id.
 * Pass 2: fuzzy fallback with a tight threshold for typo tolerance.
 */
async function resolveComponent(
  name: string
): Promise<RouteManifestEntry | undefined> {
  const manifest = await getRouteManifest();
  const needle = name.toLowerCase();

  // Rebuild catalog only when the manifest reference changes (e.g. hot-reload).
  if (!resolveCatalogCache || resolveCatalogRoutesRef !== manifest.routes) {
    resolveCatalogCache = manifest.routes.filter(
      (r) => CATALOG_CATEGORIES.has(r.category) && r.menu.length === 3
    );
    resolveCatalogRoutesRef = manifest.routes;
  }
  const catalog = resolveCatalogCache;

  // Pass 1: exact match
  const exact = catalog.find((r) => {
    if (r.exportName?.toLowerCase() === needle) return true;
    if (r.title.toLowerCase() === needle) return true;
    const idName = r.id.replace(/^(Components|Patterns)-/, "");
    return idName.toLowerCase() === needle;
  });
  if (exact) return exact;

  // Pass 2: fuzzy fallback — find the closest component by Levenshtein
  // distance on title and exportName. This avoids false positives from
  // prefix matching (e.g. "NimbusButton" → "Nimbus i18n provider").
  return fuzzyResolveName(name, catalog, (r) => {
    const names = [r.title];
    if (r.exportName) names.push(r.exportName);
    return names;
  });
}

/** Derives the route data slug from a manifest entry's path. */
function pathToSlug(path: string): string {
  // "/components/buttons/button" → "components-buttons-button"
  return path.replace(/^\//, "").replace(/\//g, "-");
}

// ---------------------------------------------------------------------------
// Response builders
// ---------------------------------------------------------------------------

function buildMetadataResponse(
  entry: RouteManifestEntry,
  availableSections: string[]
): ComponentMetadata {
  const meta: ComponentMetadata = {
    name: entry.title,
    description: entry.description,
    path: entry.path,
    sections: availableSections,
  };

  if (entry.exportName) meta.exportName = entry.exportName;

  const subcategory = entry.menu[1];
  if (subcategory) meta.subcategory = subcategory;
  if (entry.tags.length > 0) meta.tags = entry.tags;

  return meta;
}

// ---------------------------------------------------------------------------
// Tool registration
// ---------------------------------------------------------------------------

/**
 * Registers the `get_component` tool on the given MCP server.
 *
 * - `name` only: returns component metadata + list of available sections
 * - `name` + `section`: returns the requested section content
 *   - `props`: filtered JSON (component-specific only)
 *   - `overview` / `guidelines` / `implementation` / `accessibility`: MDX markdown
 */
export function registerGetComponent(server: McpServer): void {
  server.registerTool(
    "get_component",
    {
      title: "Get Component",
      description:
        "Returns detailed information about a Nimbus component or pattern. " +
        "With name only: returns metadata and available sections. " +
        "With name + section: returns section content (overview, guidelines, implementation, accessibility, props).",
      inputSchema: {
        name: z
          .string()
          .describe(
            'Component or pattern name, e.g. "Button", "TextInput", "MoneyInputField". Case-insensitive.'
          ),
        section: z
          .enum(SECTION_KEYS)
          .optional()
          .describe(
            "Section to retrieve. Omit to get metadata + section list."
          ),
      },
    },
    async ({ name, section }) => {
      try {
        // Resolve component from manifest
        const entry = await resolveComponent(name);
        if (!entry) {
          return {
            content: [
              {
                type: "text" as const,
                text: `Component "${name}" not found. Use list_components to see available components.`,
              },
            ],
            isError: true,
          };
        }

        const slug = pathToSlug(entry.path);

        // Determine available sections
        const routeData = await getRouteData(slug);
        const viewSections = Object.keys(routeData.views ?? {}).map((key) => {
          // Reverse-map view keys to our canonical section names
          const canonical = Object.entries(VIEW_KEY_MAP).find(
            ([, v]) => v === key
          );
          return canonical ? canonical[0] : key;
        });
        const availableSections = [...viewSections, "props"] as string[];

        // No section requested — return metadata + section list
        if (!section) {
          const metadata = buildMetadataResponse(entry, availableSections);
          return {
            content: [
              {
                type: "text" as const,
                text: JSON.stringify(metadata),
              },
            ],
          };
        }

        // Section: props
        if (section === "props") {
          const exportName = entry.exportName ?? entry.title;
          try {
            const typeData = await getTypeData(exportName);
            let filtered = filterProps(typeData);

            // Compound components have no props on the top-level export.
            // Aggregate from sub-component type files (e.g. DrawerRoot, DrawerContent).
            if (filtered.length === 0) {
              filtered = await aggregateSubComponentProps(exportName);
            }

            return {
              content: [
                {
                  type: "text" as const,
                  text: JSON.stringify({
                    component: exportName,
                    propCount: filtered.length,
                    props: filtered,
                  }),
                },
              ],
            };
          } catch {
            return {
              content: [
                {
                  type: "text" as const,
                  text: `Type data not available for "${exportName}".`,
                },
              ],
              isError: true,
            };
          }
        }

        // Section: overview, guidelines, implementation, accessibility
        const viewKey = VIEW_KEY_MAP[section];
        if (!viewKey) {
          return {
            content: [
              {
                type: "text" as const,
                text: `Unknown section "${section}". Available: ${availableSections.join(", ")}`,
              },
            ],
            isError: true,
          };
        }

        const view = routeData.views?.[viewKey];
        if (!view) {
          return {
            content: [
              {
                type: "text" as const,
                text: `Section "${section}" is not available for "${entry.title}". Available: ${availableSections.join(", ")}`,
              },
            ],
            isError: true,
          };
        }

        return {
          content: [
            {
              type: "text" as const,
              text: stripMarkdown(view.mdx),
            },
          ],
        };
      } catch {
        return {
          content: [
            {
              type: "text" as const,
              text: "Component data is not available in this environment.",
            },
          ],
          isError: true,
        };
      }
    }
  );
}
