import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import Fuse from "fuse.js";
import { z } from "zod";
import { getIconCatalog } from "../data-loader.js";
import type {
  FuseCache,
  IconCatalogEntry,
  RelevanceFields,
  SearchIconsResponse,
} from "../types.js";
import { rankByRelevance } from "../utils/relevance.js";

/** Number of results returned per page. */
const PAGE_SIZE = 10;

/**
 * Minimum keyword length for substring matching to avoid single-char noise.
 * Also used as Fuse.js minMatchCharLength so both passes share the same threshold.
 */
const MIN_KEYWORD_LENGTH = 2;

let fuseCache: FuseCache | undefined;

async function getFuse(): Promise<FuseCache> {
  if (!fuseCache) {
    const catalog = await getIconCatalog();
    fuseCache = {
      icons: catalog.icons,
      fuse: new Fuse(catalog.icons, {
        keys: [
          { name: "name", weight: 2 },
          { name: "keywords", weight: 1 },
        ],
        // Fuse surfaces candidates up to this threshold; the post-filter
        // (score < 0.35) is intentionally tighter to discard borderline matches.
        threshold: 0.4,
        ignoreLocation: true,
        includeScore: true,
        minMatchCharLength: MIN_KEYWORD_LENGTH,
      }),
    };
  }
  return fuseCache;
}

/** Maps an icon entry to RelevanceFields for ranking. */
function toRelevanceFields(icon: IconCatalogEntry): RelevanceFields {
  return {
    title: icon.name,
    description: "",
    tags: icon.keywords.join(" "),
  };
}

/**
 * Two-pass search matching the list_components pattern:
 * Pass 1: Substring match — icon name/keyword contains the query.
 * Pass 2: Fuse.js fuzzy fallback.
 */
async function searchIcons(query: string): Promise<IconCatalogEntry[]> {
  const { fuse, icons } = await getFuse();
  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
  const needle = tokens.join(" ");

  // Pass 1: substring match on name and keywords.
  // Only checks if the icon name/keyword contains the needle — not the reverse —
  // to avoid short icon names matching inside long or nonsense query strings.
  const substringMatches: IconCatalogEntry[] = [];

  for (const icon of icons) {
    const nameLower = icon.name.toLowerCase();
    if (nameLower.includes(needle)) {
      substringMatches.push(icon);
    } else if (
      icon.keywords.some(
        (kw) =>
          kw.length >= MIN_KEYWORD_LENGTH && kw.toLowerCase().includes(needle)
      )
    ) {
      substringMatches.push(icon);
    }
  }

  if (substringMatches.length > 0) {
    return rankByRelevance(substringMatches, tokens, toRelevanceFields);
  }

  // Pass 2: fuzzy fallback — post-filter is tighter than Fuse threshold
  // (0.35 vs 0.4) to discard borderline matches that Fuse surfaces.
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
          .min(1)
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

        const payload: SearchIconsResponse = {
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
          payload.hint = `Use \`offset: ${offset + PAGE_SIZE}\` for more results (${allResults.length} total).`;
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
