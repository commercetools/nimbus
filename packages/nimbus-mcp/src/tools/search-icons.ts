import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import Fuse from "fuse.js";
import { z } from "zod";
import { getIconCatalog } from "../data-loader.js";
import type { IconCatalogEntry } from "../types.js";

/** Number of results returned per page. */
const PAGE_SIZE = 10;

/** Minimum keyword length for substring matching to avoid single-char noise. */
const MIN_KEYWORD_LENGTH = 2;

/** Cached Fuse instance (created on first call). */
let fuseInstance: Fuse<IconCatalogEntry> | undefined;

async function getFuse(): Promise<Fuse<IconCatalogEntry>> {
  if (!fuseInstance) {
    const catalog = await getIconCatalog();
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
  const catalog = await getIconCatalog();
  const needle = query.toLowerCase();

  // Pass 1: substring match on name and keywords, name matches ranked first
  const nameMatches: IconCatalogEntry[] = [];
  const keywordMatches: IconCatalogEntry[] = [];

  for (const icon of catalog.icons) {
    const nameLower = icon.name.toLowerCase();
    if (nameLower.includes(needle) || needle.includes(nameLower)) {
      nameMatches.push(icon);
    } else if (
      icon.keywords.some(
        (kw) =>
          kw.length >= MIN_KEYWORD_LENGTH &&
          (kw.includes(needle) || needle.includes(kw))
      )
    ) {
      keywordMatches.push(icon);
    }
  }

  const substringMatches = [...nameMatches, ...keywordMatches];

  if (substringMatches.length > 0) {
    return substringMatches;
  }

  // Pass 2: fuzzy fallback — filter out low-quality matches
  const fuse = await getFuse();
  return fuse
    .search(query)
    .filter((r) => (r.score ?? 1) < 0.35)
    .map((r) => r.item);
}

/**
 * Registers the `search_icons` tool on the given MCP server.
 *
 * Accepts a `query` param and an optional `offset` for pagination.
 * Performs a two-pass search (substring then Fuse.js fuzzy) against icon names
 * and keywords from the icon catalog. Returns a page of {@link PAGE_SIZE}
 * results with metadata about total matches and how to fetch more.
 */
export function registerSearchIcons(server: McpServer): void {
  server.registerTool(
    "search_icons",
    {
      title: "Search Icons",
      description:
        "Fuzzy-search Nimbus icons by name or keyword. " +
        "Returns matching icon names with import paths from @commercetools/nimbus-icons. " +
        `Results are paginated (${PAGE_SIZE} per page). Use the offset parameter to retrieve additional results.`,
      inputSchema: {
        query: z
          .string()
          .describe(
            'Search query to match against icon names and keywords, e.g. "checkmark", "arrow", "settings".'
          ),
        offset: z
          .number()
          .int()
          .min(0)
          .default(0)
          .describe(
            "Starting index for paginated results. Omit or pass 0 for the first page."
          ),
      },
    },
    async ({ query, offset }) => {
      try {
        const allResults = await searchIcons(query);
        const page = allResults.slice(offset, offset + PAGE_SIZE);
        const hasMore = offset + PAGE_SIZE < allResults.length;

        if (allResults.length === 0) {
          return {
            content: [
              {
                type: "text" as const,
                text: JSON.stringify({
                  query,
                  importPath: "@commercetools/nimbus-icons",
                  totalResults: 0,
                  results: [],
                }),
              },
            ],
          };
        }

        const payload: Record<string, unknown> = {
          query,
          importPath: "@commercetools/nimbus-icons",
          totalResults: allResults.length,
          offset,
          pageSize: PAGE_SIZE,
          hasMore,
          results: page.map(({ name, category, keywords }) => ({
            name,
            category,
            keywords,
          })),
        };

        if (hasMore) {
          payload.hint =
            `Showing ${offset + 1}–${offset + page.length} of ${allResults.length} matches. ` +
            `Call search_icons again with offset: ${offset + PAGE_SIZE} to see more.`;
        }

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(payload),
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
