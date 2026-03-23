import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getFlatTokenData, reverseLookup } from "../data-loader.js";
import type {
  FlatToken,
  FlatTokenData,
  PaletteEntry,
  PaletteGroupResponse,
  TokenCategorySummary,
  TokenCategoryResponse,
  TokenReverseLookupResponse,
} from "../types.js";

/** Threshold above which a category is considered "large". */
const LARGE_CATEGORY_THRESHOLD = 55;

/** Default page size for large categories when no limit is specified. */
const DEFAULT_PAGE_SIZE = 20;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Categories ordered by likely usage frequency.
 * Most-requested categories appear first so the LLM sees
 * the most relevant options without scanning the full list.
 */
const CATEGORY_PRIORITY: string[] = [
  "color",
  "spacing",
  "fontSize",
  "fontWeight",
  "lineHeight",
  "borderRadius",
  "shadow",
  "size",
  "borderWidth",
  "border",
  "zIndex",
  "opacity",
  "textStyle",
];

/** Lists all token categories with their counts, prioritized by usage. */
function listCategories(data: FlatTokenData): TokenCategorySummary[] {
  const priorityIndex = new Map(CATEGORY_PRIORITY.map((c, i) => [c, i]));
  return Object.entries(data.byCategory)
    .map(([category, tokens]) => ({ category, count: tokens.length }))
    .sort((a, b) => {
      const pa = priorityIndex.get(a.category) ?? CATEGORY_PRIORITY.length;
      const pb = priorityIndex.get(b.category) ?? CATEGORY_PRIORITY.length;
      if (pa !== pb) return pa - pb;
      return a.category.localeCompare(b.category);
    });
}

/**
 * Case-insensitive lookup for a token category key.
 * Returns the canonical key or undefined if not found.
 */
function findCategoryKey(
  data: FlatTokenData,
  category: string
): string | undefined {
  const needle = category.toLowerCase();
  return Object.keys(data.byCategory).find((k) => k.toLowerCase() === needle);
}

/** Group ordering for color palettes: semantic first, then brand, system, blacks-and-whites. */
const PALETTE_GROUP_ORDER: Array<keyof PaletteGroupResponse> = [
  "semantic-palettes",
  "brand-palettes",
  "system-palettes",
  "blacks-and-whites",
];

/**
 * Returns true if the token is an Alpha palette variant that should be excluded.
 * Alpha palettes (e.g. amberAlpha) are excluded from results due to sparse
 * usage/documentation, except for blacks-and-whites which are commonly used.
 */
function isExcludedAlphaPalette(token: FlatToken): boolean {
  return (
    token.path[2]?.endsWith("Alpha") === true &&
    token.path[1] !== "blacks-and-whites"
  );
}

/**
 * Extracts palette summaries from color tokens grouped by palette type,
 * each with the step 9 (solid) value so the LLM can distinguish palettes.
 * Palettes are sorted alphabetically within each group.
 */
function extractPalettes(tokens: FlatToken[]): PaletteGroupResponse {
  const groups: Record<string, Map<string, PaletteEntry>> = {};

  for (const token of tokens) {
    const group = token.path[1];
    const palette = token.path[2];
    const step = token.path[3];
    if (!group || !palette || step !== "9" || isExcludedAlphaPalette(token))
      continue;

    if (!groups[group]) groups[group] = new Map();
    groups[group].set(palette, { name: palette, solid: token.value });
  }

  const toSorted = (group: string): PaletteEntry[] =>
    [...(groups[group]?.values() ?? [])].sort((a, b) =>
      a.name.localeCompare(b.name)
    );

  return Object.fromEntries(
    PALETTE_GROUP_ORDER.map((group) => [group, toSorted(group)])
  ) as PaletteGroupResponse;
}

/**
 * Cached palette result — computed once since token data is immutable at runtime.
 * Token data is loaded from a static JSON file generated at build time and never
 * changes during the lifetime of the MCP server process, so no invalidation is needed.
 */
let cachedPalettes: PaletteGroupResponse | undefined;

/** Returns cached palette groups, computing on first call. */
function getCachedPalettes(colorTokens: FlatToken[]): PaletteGroupResponse {
  if (!cachedPalettes) {
    cachedPalettes = extractPalettes(colorTokens);
  }
  return cachedPalettes;
}

/** Strips redundant `category` and `path` fields from tokens for the response. */
function toResponseTokens(
  tokens: FlatToken[]
): Array<{ name: string; value: string }> {
  return tokens.map(({ name, value }) => ({ name, value }));
}

/**
 * Builds a paginated category response using offset-based pagination
 * matching the search_icons pattern.
 */
function buildCategoryResponse(
  matchKey: string,
  tokens: FlatToken[],
  offset: number,
  limit: number | undefined
): TokenCategoryResponse {
  const isLarge = tokens.length > LARGE_CATEGORY_THRESHOLD;
  const pageSize = limit ?? (isLarge ? DEFAULT_PAGE_SIZE : undefined);

  const page = pageSize
    ? tokens.slice(offset, offset + pageSize)
    : tokens.slice(offset);

  const response: TokenCategoryResponse = {
    category: matchKey,
    total: tokens.length,
    showing: page.length,
    tokens: toResponseTokens(page),
  };

  const nextOffset = offset + page.length;
  if (nextOffset < tokens.length) {
    response.hint = `Use \`offset: ${nextOffset}\` to retrieve more, or \`limit: ${tokens.length}\` to retrieve all`;
  }

  return response;
}

// ---------------------------------------------------------------------------
// Registration
// ---------------------------------------------------------------------------

/**
 * Registers the `get_tokens` tool on the given MCP server.
 *
 * - No params: returns all token categories with counts
 * - `category` param: returns tokens in that category (paginated for large categories)
 * - `value` param: reverse-lookup to find which tokens resolve to that value
 */
export function registerGetTokens(server: McpServer): void {
  server.registerTool(
    "get_tokens",
    {
      title: "Get Tokens",
      description:
        "Returns Nimbus design tokens. " +
        "No params: lists all categories with counts. " +
        "With category: returns tokens in that category (large categories are paginated by default). " +
        'With value: reverse-lookup to find which tokens resolve to that value (e.g. "16px" → spacing.400).',
      inputSchema: {
        category: z
          .string()
          .optional()
          .describe(
            'Token category to retrieve, e.g. "spacing", "color", "fontSize". Use "colorPalettes" to list available palette names for the colorPalette prop. Case-insensitive.'
          ),
        value: z
          .string()
          .optional()
          .describe(
            'Reverse-lookup: find tokens whose resolved value matches this string, e.g. "16px" or "#0969DA". Case-insensitive.'
          ),
        offset: z
          .number()
          .int()
          .min(0)
          .default(0)
          .describe(
            "Starting index for paginated results. Only applies when category is provided. Omit or pass 0 for the first page."
          ),
        limit: z
          .number()
          .int()
          .positive()
          .optional()
          .describe(
            `Maximum number of tokens to return per page. Only applies when category is provided. Defaults to all for small categories, ${DEFAULT_PAGE_SIZE} for large categories (> ${LARGE_CATEGORY_THRESHOLD} tokens).`
          ),
      },
    },
    async ({ category, value, offset, limit }) => {
      try {
        const data = await getFlatTokenData();

        // value param: reverse-lookup
        if (value !== undefined) {
          const matches = reverseLookup(data, value);

          if (matches.length === 0) {
            return {
              content: [
                {
                  type: "text" as const,
                  text: `No tokens found for value "${value}".`,
                },
              ],
            };
          }

          const payload: TokenReverseLookupResponse = {
            value,
            tokens: matches,
          };
          return {
            content: [{ type: "text" as const, text: JSON.stringify(payload) }],
          };
        }

        // Virtual category: colorPalettes — lists available palette names
        if (
          category !== undefined &&
          category.toLowerCase() === "colorpalettes"
        ) {
          const colorTokens = data.byCategory["color"];
          if (!colorTokens) {
            return {
              content: [
                {
                  type: "text" as const,
                  text: "No color tokens available.",
                },
              ],
              isError: true,
            };
          }
          const palettes = getCachedPalettes(colorTokens);
          return {
            content: [
              { type: "text" as const, text: JSON.stringify(palettes) },
            ],
          };
        }

        // category param: list tokens in that category
        if (category !== undefined) {
          const matchKey = findCategoryKey(data, category);

          if (!matchKey) {
            const available = Object.keys(data.byCategory).sort().join(", ");
            return {
              content: [
                {
                  type: "text" as const,
                  text: `Category "${category}" not found. Available categories: ${available}`,
                },
              ],
              isError: true,
            };
          }

          let tokens = data.byCategory[matchKey];

          if (matchKey === "color") {
            tokens = tokens.filter((t) => !isExcludedAlphaPalette(t));
          }

          const payload = buildCategoryResponse(
            matchKey,
            tokens,
            offset,
            limit
          );
          return {
            content: [{ type: "text" as const, text: JSON.stringify(payload) }],
          };
        }

        // No params: list all categories with counts
        const payload = listCategories(data);
        return {
          content: [{ type: "text" as const, text: JSON.stringify(payload) }],
        };
      } catch {
        return {
          content: [
            {
              type: "text" as const,
              text: "Token data is not available in this environment.",
            },
          ],
          isError: true,
        };
      }
    }
  );
}
