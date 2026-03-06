import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import Fuse from "fuse.js";
import { z } from "zod";
import {
  getRouteManifest,
  getRouteData,
  getTypeData,
  type RouteManifestEntry,
  type TypeData,
} from "../data-loader.js";

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
  "recipe",
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

interface FilteredProp {
  name: string;
  type: string;
  required: boolean;
  description: string;
  defaultValue?: string;
}

/** Props excluded by name (matches docs-site filter). */
const EXCLUDED_PROP_NAMES = new Set(["key", "recipe"]);

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

  const catalog = manifest.routes.filter(
    (r) => CATALOG_CATEGORIES.has(r.category) && r.menu.length === 3
  );

  // Pass 1: exact match
  const exact = catalog.find((r) => {
    if (r.exportName?.toLowerCase() === needle) return true;
    if (r.title.toLowerCase() === needle) return true;
    const idName = r.id.replace(/^(Components|Patterns)-/, "");
    return idName.toLowerCase() === needle;
  });
  if (exact) return exact;

  // Pass 2: fuzzy fallback for typo tolerance
  const fuse = new Fuse(catalog, {
    keys: ["title", "exportName"],
    threshold: 0.3,
    ignoreLocation: true,
  });
  const fuzzyResults = fuse.search(name);
  return fuzzyResults[0]?.item;
}

/** Derives the route data slug from a manifest entry's path. */
function pathToSlug(path: string): string {
  // "/components/buttons/button" → "components-buttons-button"
  return path.replace(/^\//, "").replace(/\//g, "-");
}

// ---------------------------------------------------------------------------
// Response builders
// ---------------------------------------------------------------------------

interface ComponentMetadata {
  name: string;
  exportName?: string;
  description: string;
  path: string;
  subcategory?: string;
  tags?: string[];
  sections: string[];
}

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
 *   - `recipe`: variant/size values extracted from type data
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
        "With name + section: returns section content (overview, guidelines, implementation, accessibility, props, recipe).",
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
        const availableSections = [
          ...viewSections,
          "props",
          "recipe",
        ] as string[];

        // No section requested — return metadata + section list
        if (!section) {
          const metadata = buildMetadataResponse(entry, availableSections);
          return {
            content: [
              {
                type: "text" as const,
                text: JSON.stringify(metadata, null, 2),
              },
            ],
          };
        }

        // Section: props
        if (section === "props") {
          const exportName = entry.exportName ?? entry.title;
          try {
            const typeData = await getTypeData(exportName);
            const filtered = filterProps(typeData);
            return {
              content: [
                {
                  type: "text" as const,
                  text: JSON.stringify(
                    {
                      component: exportName,
                      propCount: filtered.length,
                      props: filtered,
                    },
                    null,
                    2
                  ),
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
              text: view.mdx,
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
