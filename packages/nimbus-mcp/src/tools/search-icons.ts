import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getIconCatalog } from "../data-loader.js";
import type {
  IconCatalogEntry,
  LoweredRelevanceFields,
  SearchIconsResponse,
} from "../types.js";
import {
  filterAndRankPreLowered,
  fuzzyScorePreLowered,
} from "../utils/relevance.js";

/** Number of results returned per page. */
const PAGE_SIZE = 10;

/**
 * Minimum keyword length for substring matching to avoid single-char noise.
 */
const MIN_KEYWORD_LENGTH = 2;

/** Minimum candidates before triggering fuzzy fallback. */
const MIN_CANDIDATES = 10;

/** Cached pre-lowered fields for the icon catalog. */
let loweredCache: Map<IconCatalogEntry, LoweredRelevanceFields> | undefined;
let loweredCacheIcons: IconCatalogEntry[] | undefined;

async function getLoweredIconFields(): Promise<{
  icons: IconCatalogEntry[];
  loweredMap: Map<IconCatalogEntry, LoweredRelevanceFields>;
}> {
  const catalog = await getIconCatalog();
  if (loweredCache && loweredCacheIcons === catalog.icons) {
    return { icons: catalog.icons, loweredMap: loweredCache };
  }
  const map = new Map<IconCatalogEntry, LoweredRelevanceFields>();
  for (const icon of catalog.icons) {
    const title = icon.name.toLowerCase();
    const tags = icon.keywords
      .filter((kw) => kw.length >= MIN_KEYWORD_LENGTH)
      .join(" ")
      .toLowerCase();
    map.set(icon, {
      title,
      description: "",
      tags,
      content: "",
      combined: title + " " + tags,
    });
  }
  loweredCache = map;
  loweredCacheIcons = catalog.icons;
  return { icons: catalog.icons, loweredMap: map };
}

/**
 * Two-pass search:
 * Pass 1: Substring match + rank via shared filterAndRankPreLowered.
 * Pass 2: Fuzzy fallback via shared fuzzyScorePreLowered.
 */
async function searchIcons(query: string): Promise<IconCatalogEntry[]> {
  const { icons, loweredMap } = await getLoweredIconFields();
  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);

  // Pass 1: exact substring match using shared utility.
  const exactMatches = filterAndRankPreLowered(
    icons,
    tokens,
    (icon) => loweredMap.get(icon)!
  );

  if (exactMatches.length >= MIN_CANDIDATES) {
    return exactMatches;
  }

  // Pass 2: fuzzy fallback using shared bounded Levenshtein.
  const seen = new Set(exactMatches.map((e) => e.name));
  const fuzzyScored: Array<{ icon: IconCatalogEntry; score: number }> = [];

  for (const icon of icons) {
    if (seen.has(icon.name)) continue;
    const fields = loweredMap.get(icon)!;
    const score = fuzzyScorePreLowered(fields, tokens);
    if (score > 0) {
      fuzzyScored.push({ icon, score });
    }
  }

  fuzzyScored.sort((a, b) => b.score - a.score);
  return [...exactMatches, ...fuzzyScored.map(({ icon }) => icon)];
}

/**
 * Registers the `search_icons` tool on the given MCP server.
 *
 * Accepts a `query` param and an optional `offset` for pagination.
 * Performs a two-pass search (substring then fuzzy) against icon names
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
