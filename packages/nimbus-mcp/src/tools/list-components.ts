import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getRouteManifest } from "../data-loader.js";
import type {
  RouteManifestEntry,
  ComponentSummary,
  LoweredRelevanceFields,
} from "../types.js";
import {
  filterAndRankPreLowered,
  fuzzyScorePreLowered,
} from "../utils/relevance.js";

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

/** Build pre-lowered fields for a route entry. */
function toLowered(r: RouteManifestEntry): LoweredRelevanceFields {
  const title = r.title.toLowerCase();
  const description = r.description.toLowerCase();
  const tags = [...r.tags, r.exportName ?? ""].join(" ").toLowerCase();
  return {
    title,
    description,
    tags,
    content: "",
    combined: title + " " + description + " " + tags,
  };
}

/**
 * Registers the `list_components` tool on the given MCP server.
 *
 * Supports optional `category` (subcategory filter) and `query` (fuzzy
 * search) params. Returns a JSON array of component summaries.
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

          // Build lowered fields for the filtered route set.
          const loweredMap = new Map<
            RouteManifestEntry,
            LoweredRelevanceFields
          >();
          for (const r of routes) {
            loweredMap.set(r, toLowered(r));
          }

          // Pass 1: exact substring match, ranked by field-weighted relevance.
          const exactMatches = filterAndRankPreLowered(
            routes,
            tokens,
            (r) => loweredMap.get(r)!
          );

          if (exactMatches.length > 0) {
            routes = exactMatches;
          } else {
            // Pass 2: fuzzy fallback using bounded Levenshtein.
            const fuzzyScored: Array<{
              route: RouteManifestEntry;
              score: number;
            }> = [];
            for (const r of routes) {
              const score = fuzzyScorePreLowered(loweredMap.get(r)!, tokens);
              if (score > 0) {
                fuzzyScored.push({ route: r, score });
              }
            }
            fuzzyScored.sort((a, b) => b.score - a.score);
            routes = fuzzyScored.map(({ route }) => route);
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
