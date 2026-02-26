import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
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

/** Parent type names that indicate an inherited (non-component-specific) prop. */
const INHERITED_PARENT_NAMES = new Set([
  "PolymorphicProps",
  "JsxStyleProps",
  "UnstyledProp",
  "AriaBaseButtonProps",
  "AriaLabelingProps",
  "FocusableProps",
  "FocusableDOMProps",
  "FocusEvents",
  "KeyboardEvents",
  "PressEvents",
  "ButtonProps",
  "LinkButtonProps",
  "DOMProps",
  "AriaButtonElementTypeProps",
]);

interface FilteredProp {
  name: string;
  type: string;
  required: boolean;
  description: string;
  defaultValue?: string;
}

/** Filters type data to only component-specific props. */
function filterProps(typeData: TypeData): FilteredProp[] {
  return Object.values(typeData.props)
    .filter((p) => !p.parent || !INHERITED_PARENT_NAMES.has(p.parent.name))
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
// Recipe extraction
// ---------------------------------------------------------------------------

interface RecipeInfo {
  variants: Record<string, string[]>;
  defaultVariants?: Record<string, string>;
}

/**
 * Extracts variant and size values from a recipe file by reading the
 * built route data's MDX or falling back to type information.
 *
 * We parse variant keys from the component's type definitions since recipe
 * source files aren't available as JSON. The type data encodes variant
 * values in the prop type string (e.g. `ConditionalValue<"sm" | "md">`).
 */
function extractRecipeFromTypes(typeData: TypeData): RecipeInfo {
  const variants: Record<string, string[]> = {};
  const defaults: Record<string, string> = {};

  for (const prop of Object.values(typeData.props)) {
    // Only look at component-specific props that encode variant values
    if (prop.parent && INHERITED_PARENT_NAMES.has(prop.parent.name)) continue;

    const match = prop.type.name.match(
      /ConditionalValue<(.+)>|^"([^"]+)"(?:\s*\|\s*"([^"]+)")*$/
    );
    if (!match) continue;

    const raw = match[1] || match[0];
    const values = [...raw.matchAll(/"([^"]+)"/g)].map((m) => m[1]);
    if (values.length > 0) {
      variants[prop.name] = values;
      if (prop.defaultValue) {
        defaults[prop.name] = prop.defaultValue.value.replace(/"/g, "");
      }
    }
  }

  const result: RecipeInfo = { variants };
  if (Object.keys(defaults).length > 0) result.defaultVariants = defaults;
  return result;
}

// ---------------------------------------------------------------------------
// Route resolution helpers
// ---------------------------------------------------------------------------

/**
 * Resolves a component name (case-insensitive) to its manifest entry.
 * Matches against exportName first, then title, then the name portion of the id.
 */
async function resolveComponent(
  name: string
): Promise<RouteManifestEntry | undefined> {
  const manifest = await getRouteManifest();
  const needle = name.toLowerCase();

  return manifest.routes
    .filter((r) => r.category === "Components" && r.menu.length === 3)
    .find((r) => {
      if (r.exportName?.toLowerCase() === needle) return true;
      if (r.title.toLowerCase() === needle) return true;
      // Match against the name portion after "Components-"
      const idName = r.id.replace(/^Components-/, "");
      return idName.toLowerCase() === needle;
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

interface ComponentMetadata {
  id: string;
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
    id: entry.id,
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
        "Returns detailed information about a Nimbus component. " +
        "With name only: returns metadata and available sections. " +
        "With name + section: returns section content (overview, guidelines, implementation, accessibility, props, recipe).",
      inputSchema: {
        name: z
          .string()
          .describe(
            'Component name, e.g. "Button", "TextInput", "DataTable". Case-insensitive.'
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

        // Section: recipe
        if (section === "recipe") {
          const exportName = entry.exportName ?? entry.title;
          try {
            const typeData = await getTypeData(exportName);
            const recipe = extractRecipeFromTypes(typeData);
            return {
              content: [
                {
                  type: "text" as const,
                  text: JSON.stringify(
                    { component: exportName, ...recipe },
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
                  text: `Recipe data not available for "${exportName}".`,
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
