import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  getRouteData,
  getRouteManifest,
  getStylePropsSummary,
  getTypeData,
} from "../data-loader.js";
import type { DocsPageResult } from "../types.js";
import { stripMarkdown } from "../utils/markdown.js";
import { routePathToSlug } from "../utils/route.js";

// ---------------------------------------------------------------------------
// Style props constants
// ---------------------------------------------------------------------------

const STYLE_PROPS_HINT =
  'Also accepts Chakra style props. Use get_docs_page(path: "home/style-props") for full reference.';

/** Route prefix that identifies component documentation pages. */
const COMPONENT_ROUTE_PREFIX = "components/";

const viewContentCache = new WeakMap<object, string>();

function getCachedStripped(viewObj: { mdx: string }): string {
  let cached = viewContentCache.get(viewObj);
  if (!cached) {
    cached = stripMarkdown(viewObj.mdx);
    viewContentCache.set(viewObj, cached);
  }
  return cached;
}

// ---------------------------------------------------------------------------
// Style props helpers
// ---------------------------------------------------------------------------

/**
 * Enriches the style-props landing page content with a compact prop index
 * from the pre-built summary. The original landing page is very short (~184
 * chars); this makes it useful as a reference by appending all categories
 * with their prop names and drill-down paths.
 */
async function enrichStylePropsLanding(content: string): Promise<string> {
  try {
    const summary = await getStylePropsSummary();
    const lines = summary.categories.map(
      (c) => `${c.name} (${c.path}): ${c.props.join(", ")}`
    );
    return (
      content +
      "\n\n--- Style Props Index ---\n" +
      lines.join("\n") +
      `\n\n${summary.hint}`
    );
  } catch {
    return content;
  }
}

/**
 * Resolves a component route to its exportName from the route manifest.
 * Returns undefined for non-component routes.
 */
async function resolveExportName(route: string): Promise<string | undefined> {
  if (!route.startsWith(COMPONENT_ROUTE_PREFIX)) return undefined;
  try {
    const manifest = await getRouteManifest();
    const entry = manifest.routes.find((r) => r.path === `/${route}`);
    return entry?.exportName ?? entry?.title;
  } catch {
    return undefined;
  }
}

/**
 * Adds the styleProps hint to a DocsPageResult if the component at the given
 * route supports Chakra style props.
 */
async function maybeAddStylePropsHint(
  result: DocsPageResult,
  route: string
): Promise<void> {
  const exportName = await resolveExportName(route);
  if (!exportName) return;

  try {
    const typeData = await getTypeData(exportName);
    if (typeData.supportsStyleProps) {
      result.styleProps = STYLE_PROPS_HINT;
    }
  } catch {
    // Type data unavailable — skip styleProps hint
  }
}

export function registerGetDocsPage(server: McpServer): void {
  server.registerTool(
    "get_docs_page",
    {
      title: "Get Docs Page",
      description:
        "Returns the full content of a Nimbus documentation page by its route path (as returned by search_docs). " +
        "For tabbed pages, optionally specify a section to retrieve a single view. " +
        "Use search_docs first to find the page path.",
      inputSchema: {
        path: z
          .string()
          .describe(
            'Route path from search_docs results, e.g. "home/getting-started/installation".'
          ),
        section: z
          .string()
          .optional()
          .describe(
            'For tabbed pages, which view to return (e.g. "overview", "dev", "guidelines", "a11y"). Omit to get all views concatenated.'
          ),
      },
    },
    async ({ path, section }) => {
      try {
        const slug = routePathToSlug(path);

        let routeData;
        try {
          routeData = await getRouteData(slug);
        } catch {
          return {
            content: [
              {
                type: "text" as const,
                text: `Page not found for path "${path}". Use search_docs to find valid page paths.`,
              },
            ],
            isError: true,
          };
        }

        const { meta } = routeData;
        const availableSections = Object.keys(routeData.views ?? {});

        const normalizedSection = section?.toLowerCase();
        if (normalizedSection) {
          const view = routeData.views?.[normalizedSection];
          if (!view) {
            return {
              content: [
                {
                  type: "text" as const,
                  text: `Section "${section}" not found for "${meta.title}". Available sections: ${availableSections.join(", ") || "none (single-page content)"}`,
                },
              ],
              isError: true,
            };
          }

          const result: DocsPageResult = {
            title: meta.title,
            description: meta.description,
            path: meta.route,
            sections: availableSections,
            content: getCachedStripped(view),
          };

          // Add styleProps hint for component pages
          await maybeAddStylePropsHint(result, meta.route);

          return {
            content: [{ type: "text" as const, text: JSON.stringify(result) }],
          };
        }

        let content: string;
        if (availableSections.length > 0 && routeData.views) {
          content = Object.entries(routeData.views)
            .map(([key, view]) => `--- ${key} ---\n${getCachedStripped(view)}`)
            .join("\n\n");
        } else if (routeData.mdx) {
          content = stripMarkdown(routeData.mdx);
        } else {
          content = meta.description;
        }

        // Enrich the style-props landing page with a compact prop index
        if (meta.route === "home/style-props") {
          content = await enrichStylePropsLanding(content);
        }

        const result: DocsPageResult = {
          title: meta.title,
          description: meta.description,
          path: meta.route,
          sections: availableSections,
          content,
        };

        // Add styleProps hint for component pages
        await maybeAddStylePropsHint(result, meta.route);

        return {
          content: [{ type: "text" as const, text: JSON.stringify(result) }],
        };
      } catch {
        return {
          content: [
            {
              type: "text" as const,
              text: "Docs data is not available in this environment.",
            },
          ],
          isError: true,
        };
      }
    }
  );
}
