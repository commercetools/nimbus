import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import Fuse from "fuse.js";
import { z } from "zod";
import { getSearchIndex, type SearchIndexEntry } from "../data-loader.js";
import type { DocSearchResult } from "../types.js";

const MAX_RESULTS = 10;
const SNIPPET_LENGTH = 200;

/** Extracts a content snippet around the first match of any query token. */
function extractSnippet(content: string, query: string): string {
  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
  const lower = content.toLowerCase();

  let bestIndex = -1;
  for (const token of tokens) {
    const idx = lower.indexOf(token);
    if (idx !== -1) {
      bestIndex = idx;
      break;
    }
  }

  if (bestIndex === -1) {
    // No exact token match found; return the beginning of content
    return (
      content.slice(0, SNIPPET_LENGTH).trim() +
      (content.length > SNIPPET_LENGTH ? "…" : "")
    );
  }

  const start = Math.max(0, bestIndex - 80);
  const end = Math.min(content.length, start + SNIPPET_LENGTH);
  let snippet = content.slice(start, end).trim();

  if (start > 0) snippet = "…" + snippet;
  if (end < content.length) snippet = snippet + "…";

  return snippet;
}

/** Converts a search index entry into a search result with snippet. */
function toResult(entry: SearchIndexEntry, query: string): DocSearchResult {
  return {
    title: entry.title,
    description: entry.description,
    path: entry.route,
    snippet: extractSnippet(entry.content, query),
  };
}

/**
 * Registers the `search_docs` tool on the given MCP server.
 *
 * Performs Fuse.js fuzzy search across all docs content using the pre-built
 * search index. Returns top 10 matches with title, description, snippet,
 * and page path.
 */
export function registerSearchDocs(server: McpServer): void {
  server.registerTool(
    "search_docs",
    {
      title: "Search Docs",
      description:
        "Fuzzy-searches across all Nimbus documentation (components, patterns, guides, tokens) and returns the top matching pages with content snippets.",
      inputSchema: {
        query: z
          .string()
          .describe(
            'Search query to find relevant documentation pages. e.g. "form validation", "color tokens", "accessibility".'
          ),
      },
    },
    async ({ query }) => {
      try {
        const index = await getSearchIndex();

        // Two-pass search: exact substring first, fuzzy fallback.
        const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);

        // Pass 1: exact substring match — an entry matches if every token
        // appears in at least one of its searchable fields.
        const exactMatches = index.filter((entry) => {
          const haystack = [
            entry.title,
            entry.description,
            entry.content,
            ...entry.tags,
          ]
            .join(" ")
            .toLowerCase();
          return tokens.every((t) => haystack.includes(t));
        });

        let results: SearchIndexEntry[];

        if (exactMatches.length > 0) {
          results = exactMatches.slice(0, MAX_RESULTS);
        } else {
          // Pass 2: fuzzy fallback
          const fuse = new Fuse(index, {
            keys: [
              { name: "title", weight: 3 },
              { name: "description", weight: 2 },
              { name: "tags", weight: 2 },
              { name: "content", weight: 1 },
            ],
            threshold: 0.4,
            ignoreLocation: true,
            minMatchCharLength: 3,
          });
          results = fuse
            .search(query, { limit: MAX_RESULTS })
            .map((r) => r.item);
        }

        const output = results.map((entry) => toResult(entry, query));

        return {
          content: [
            {
              type: "text" as const,
              text:
                output.length > 0
                  ? JSON.stringify(output, null, 2)
                  : "No matching documentation found.",
            },
          ],
        };
      } catch {
        return {
          content: [
            {
              type: "text" as const,
              text: "Search index is not available in this environment.",
            },
          ],
          isError: true,
        };
      }
    }
  );
}
