import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import Fuse from "fuse.js";
import { z } from "zod";
import { getIconCatalog, type IconCatalog } from "../data-loader.js";
import type { IconCatalogEntry } from "../types.js";

/** Maximum number of results to return. */
const MAX_RESULTS = 20;

/** Cached catalog + Fuse instance (created on first call). */
let cachedCatalog: IconCatalog | undefined;
let fuseInstance: Fuse<IconCatalogEntry> | undefined;

async function getCatalog(): Promise<IconCatalog> {
  if (!cachedCatalog) {
    cachedCatalog = await getIconCatalog();
  }
  return cachedCatalog;
}

async function getFuse(): Promise<Fuse<IconCatalogEntry>> {
  if (!fuseInstance) {
    const catalog = await getCatalog();
    fuseInstance = new Fuse(catalog.icons, {
      keys: [
        { name: "name", weight: 2 },
        { name: "keywords", weight: 1 },
      ],
      threshold: 0.4,
      ignoreLocation: true,
      includeScore: true,
      minMatchCharLength: 2,
    });
  }
  return fuseInstance;
}

/**
 * Two-pass search matching the list_components pattern:
 * Pass 1: Substring match — query contains a keyword or keyword contains query.
 * Pass 2: Fuse.js fuzzy fallback.
 */
async function searchIcons(query: string): Promise<IconCatalogEntry[]> {
  const catalog = await getCatalog();
  const needle = query.toLowerCase();

  // Pass 1: substring match on name and keywords
  const substringMatches = catalog.icons.filter((icon) => {
    const nameLower = icon.name.toLowerCase();
    if (nameLower.includes(needle) || needle.includes(nameLower)) return true;
    return icon.keywords.some(
      (kw) => kw.includes(needle) || needle.includes(kw)
    );
  });

  if (substringMatches.length > 0) {
    return substringMatches.slice(0, MAX_RESULTS);
  }

  // Pass 2: fuzzy fallback — filter out low-quality matches
  const fuse = await getFuse();
  return fuse
    .search(query, { limit: MAX_RESULTS })
    .filter((r) => (r.score ?? 1) < 0.35)
    .map((r) => r.item);
}

/**
 * Registers the `search_icons` tool on the given MCP server.
 *
 * Accepts a `query` param and performs a two-pass search (substring then
 * Fuse.js fuzzy) against icon names and keywords from the icon catalog.
 * Returns up to {@link MAX_RESULTS} matching icons with their import paths.
 */
export function registerSearchIcons(server: McpServer): void {
  server.registerTool(
    "search_icons",
    {
      title: "Search Icons",
      description:
        "Fuzzy-search Nimbus icons by name or keyword. " +
        "Returns matching icon names with import paths from @commercetools/nimbus-icons.",
      inputSchema: {
        query: z
          .string()
          .describe(
            'Search query to match against icon names and keywords, e.g. "checkmark", "arrow", "settings".'
          ),
      },
    },
    async ({ query }) => {
      try {
        const results = await searchIcons(query);

        return {
          content: [
            {
              type: "text" as const,
              text:
                results.length > 0
                  ? JSON.stringify(results, null, 2)
                  : `No icons found matching "${query}".`,
            },
          ],
        };
      } catch {
        return {
          content: [
            {
              type: "text" as const,
              text: "Icon catalog is not available in this environment.",
            },
          ],
          isError: true,
        };
      }
    }
  );
}
