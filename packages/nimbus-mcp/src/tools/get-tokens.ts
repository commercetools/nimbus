import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getFlatTokenData, reverseLookup } from "../data-loader.js";

/** Threshold above which a category is considered "large". */
const LARGE_CATEGORY_THRESHOLD = 50;

/** Default number of tokens to show for large categories when no limit is specified. */
const LARGE_CATEGORY_DEFAULT_LIMIT = 20;

/**
 * Registers the `get_tokens` tool on the given MCP server.
 *
 * - No params: returns all token categories with counts
 * - `category` param: returns tokens in that category (summarised for large categories)
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
        "With category: returns tokens in that category (large categories like color are summarised by default). " +
        'With value: reverse-lookup to find which tokens resolve to that value (e.g. "16px" → spacing.400).',
      inputSchema: {
        category: z
          .string()
          .optional()
          .describe(
            'Token category to retrieve, e.g. "spacing", "color", "fontSize". Case-insensitive.'
          ),
        value: z
          .string()
          .optional()
          .describe(
            'Reverse-lookup: find tokens whose resolved value matches this string, e.g. "16px" or "#0969DA". Case-insensitive.'
          ),
        limit: z
          .number()
          .int()
          .positive()
          .optional()
          .describe(
            "Maximum number of tokens to return for a category. Defaults to all tokens for small categories, and 20 for large categories (> 50 tokens)."
          ),
      },
    },
    async ({ category, value, limit }) => {
      try {
        const data = await getFlatTokenData();

        // value param: reverse-lookup
        if (value !== undefined) {
          const matches = reverseLookup(data, value);
          return {
            content: [
              {
                type: "text" as const,
                text:
                  matches.length > 0
                    ? JSON.stringify({ value, tokens: matches }, null, 2)
                    : `No tokens found for value "${value}".`,
              },
            ],
          };
        }

        // category param: list tokens in that category
        if (category !== undefined) {
          const needle = category.toLowerCase();
          const matchKey = Object.keys(data.byCategory).find(
            (k) => k.toLowerCase() === needle
          );

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

          const tokens = data.byCategory[matchKey];
          const isLarge = tokens.length > LARGE_CATEGORY_THRESHOLD;
          const effectiveLimit =
            limit ?? (isLarge ? LARGE_CATEGORY_DEFAULT_LIMIT : undefined);
          const displayed = effectiveLimit
            ? tokens.slice(0, effectiveLimit)
            : tokens;

          const response: Record<string, unknown> = {
            category: matchKey,
            total: tokens.length,
            showing: displayed.length,
            tokens: displayed,
          };

          if (displayed.length < tokens.length) {
            response.note = `Showing ${displayed.length} of ${tokens.length} tokens. Use the limit param to retrieve more.`;
          }

          return {
            content: [
              {
                type: "text" as const,
                text: JSON.stringify(response, null, 2),
              },
            ],
          };
        }

        // No params: list all categories with counts
        const categories = Object.entries(data.byCategory)
          .map(([cat, tokens]) => ({ category: cat, count: tokens.length }))
          .sort((a, b) => a.category.localeCompare(b.category));

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(categories, null, 2),
            },
          ],
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
