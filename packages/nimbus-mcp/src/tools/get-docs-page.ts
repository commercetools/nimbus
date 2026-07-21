import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getRouteData } from "../data-loader.js";
import type { DocsPageResult } from "../types.js";
import { stripMarkdown } from "../utils/markdown.js";
import { routePathToSlug } from "../utils/route.js";

const viewContentCache = new WeakMap<object, string>();

function getCachedStripped(viewObj: { mdx: string }): string {
  let cached = viewContentCache.get(viewObj);
  if (!cached) {
    cached = stripMarkdown(viewObj.mdx);
    viewContentCache.set(viewObj, cached);
  }
  return cached;
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

        const result: DocsPageResult = {
          title: meta.title,
          description: meta.description,
          path: meta.route,
          sections: availableSections,
          content,
        };
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
