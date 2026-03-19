import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import Fuse from "fuse.js";
import { z } from "zod";
import { getRouteManifest } from "../data-loader.js";
import type {
  RouteManifestEntry,
  ComponentSummary,
  RelevanceFields,
} from "../types.js";
import { filterAndRankByRelevance } from "../utils/relevance.js";

/** Normalises a route entry into a sparse ComponentSummary. */
function toSummary(route: RouteManifestEntry): ComponentSummary {
  const summary: ComponentSummary = {
    title: route.title,
    description: route.description,
    path: route.path,
  };

  if (route.exportName) summary.exportName = route.exportName;

  // menu[1] is the subcategory (e.g. "Inputs", "Buttons")
  const subcategory = route.menu[1];
  if (subcategory) summary.subcategory = subcategory;

  if (route.tags.length > 0) summary.tags = route.tags;

  return summary;
}

/**
 * Registers the `list_components` tool on the given MCP server.
 *
 * Supports optional `category` (subcategory filter) and `query` (Fuse.js
 * fuzzy search) params. Returns a JSON array of component summaries.
 * Omits null/empty fields (sparse responses).
 */
export function registerListComponents(server: McpServer): void {
  server.registerTool(
    "list_components",
    {
      title: "List Components",
      description:
        "Returns Nimbus components. Optionally filter by subcategory or fuzzy-search by name, description, or tags.",
      inputSchema: {
        category: z
          .string()
          .optional()
          .describe(
            'Filter by subcategory, e.g. "Inputs", "Buttons", "Navigation". Case-insensitive.'
          ),
        query: z
          .string()
          .optional()
          .describe(
            "Fuzzy search query over component name, description, and tags."
          ),
      },
    },
    async ({ category, query }) => {
      try {
        const manifest = await getRouteManifest();

        // Base filter: individual component pages only (menu.length === 3),
        // e.g. ["Components", "Inputs", "Select"]
        let routes = manifest.routes.filter(
          (r) => r.category === "Components" && r.menu.length === 3
        );

        // Category filter: match against subcategory (menu[1]), case-insensitive
        if (category) {
          const needle = category.toLowerCase();
          routes = routes.filter((r) => r.menu[1]?.toLowerCase() === needle);
        }

        // Two-pass search: exact substring first (ranked), fuzzy fallback.
        if (query) {
          const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);

          const getFields = (r: RouteManifestEntry): RelevanceFields => ({
            title: r.title,
            description: r.description,
            tags: [...r.tags, r.exportName ?? ""].join(" "),
          });

          // Pass 1: exact substring match, ranked by field-weighted relevance.
          const exactMatches = filterAndRankByRelevance(
            routes,
            tokens,
            getFields
          );

          if (exactMatches.length > 0) {
            routes = exactMatches;
          } else {
            // Pass 2: fuzzy fallback with a tighter threshold.
            const fuse = new Fuse(routes, {
              keys: ["title", "description", "tags", "exportName"],
              threshold: 0.4,
              ignoreLocation: true,
              minMatchCharLength: 3,
            });
            routes = fuse.search(query).map((r) => r.item);
          }
        }

        const summaries = routes.map(toSummary);

        return {
          content: [
            {
              type: "text" as const,
              text:
                summaries.length > 0
                  ? JSON.stringify(summaries)
                  : "No components found.",
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
