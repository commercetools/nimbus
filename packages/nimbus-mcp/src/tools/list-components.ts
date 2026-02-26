import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import Fuse from "fuse.js";
import { z } from "zod";
import { getRouteManifest, type RouteManifestEntry } from "../data-loader.js";

/** Shape returned for each component in the response array. */
interface ComponentSummary {
  id: string;
  title: string;
  description: string;
  path: string;
  exportName?: string;
  subcategory?: string;
  tags?: string[];
}

/** Normalises a route entry into a sparse ComponentSummary. */
function toSummary(route: RouteManifestEntry): ComponentSummary {
  const summary: ComponentSummary = {
    id: route.id,
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

        // Fuzzy search over title, description, and tags.
        // ignoreLocation allows matching anywhere in the string, not just prefix.
        if (query) {
          const fuse = new Fuse(routes, {
            keys: ["title", "description", "tags"],
            threshold: 0.6,
            ignoreLocation: true,
            minMatchCharLength: 3,
          });
          routes = fuse.search(query).map((r) => r.item);
        }

        const summaries = routes.map(toSummary);

        return {
          content: [
            {
              type: "text" as const,
              text:
                summaries.length > 0
                  ? JSON.stringify(summaries, null, 2)
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
