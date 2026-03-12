import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import Fuse from "fuse.js";
import { z } from "zod";
import {
  getSearchIndex,
  getRouteData,
  type SearchIndexEntry,
  type RouteData,
} from "../data-loader.js";
import type { DocSearchResult } from "../types.js";

const MAX_RESULTS = 10;
const SNIPPET_LENGTH = 200;

/**
 * Minimum number of phase-1 candidates before we expand to all component pages.
 * If the lightweight index returns fewer than this, we broaden the candidate
 * pool so deep-content-only matches aren't missed.
 */
const MIN_CANDIDATES = 5;

/** Strip markdown formatting from text for plain-text search and snippets. */
function stripMarkdown(text: string): string {
  return text
    .replace(/#{1,6}\s/g, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "")
    .trim();
}

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

/** Convert a route slug to the file name format (route slashes → dashes). */
function routeToSlug(route: string): string {
  return route.replace(/\//g, "-");
}

interface CandidateResult {
  /** Entries that matched in phase 1 (exact or fuzzy on metadata). */
  matched: SearchIndexEntry[];
  /** Additional entries added as fallback candidates for deep search. */
  expanded: SearchIndexEntry[];
}

/**
 * Phase 1: Lightweight search against the in-memory search index.
 * Returns matched entries and fallback expansion candidates separately
 * so the caller can distinguish real metadata matches from speculative ones.
 */
function findCandidates(
  index: SearchIndexEntry[],
  query: string
): CandidateResult {
  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);

  // Exact substring match — entry matches if every token appears in its fields.
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

  if (exactMatches.length >= MIN_CANDIDATES) {
    return { matched: exactMatches, expanded: [] };
  }

  // Fuzzy fallback — broaden the candidate pool.
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
  const fuzzyMatches = fuse.search(query).map((r) => r.item);

  // Merge exact + fuzzy, deduplicated, keeping exact matches first.
  const seen = new Set(exactMatches.map((e) => e.id));
  const matched = [...exactMatches];
  for (const entry of fuzzyMatches) {
    if (!seen.has(entry.id)) {
      seen.add(entry.id);
      matched.push(entry);
    }
  }

  // If still too few, expand to all component-tagged pages as fallback.
  const expanded: SearchIndexEntry[] = [];
  if (matched.length < MIN_CANDIDATES) {
    for (const entry of index) {
      if (!seen.has(entry.id) && entry.tags.includes("component")) {
        seen.add(entry.id);
        expanded.push(entry);
      }
    }
  }

  return { matched, expanded };
}

interface ViewMatch {
  viewKey: string;
  content: string;
}

/**
 * Phase 2: Load the full route data for a candidate and search across all
 * views for the query. Returns the best matching view, or null if no view
 * contains the query tokens.
 */
async function searchRouteViews(
  route: string,
  query: string
): Promise<ViewMatch | null> {
  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);

  let routeData: RouteData;
  try {
    routeData = await getRouteData(routeToSlug(route));
  } catch {
    return null;
  }

  // Collect all searchable views.
  const views: Array<{ key: string; content: string }> = [];

  if (routeData.views) {
    for (const [key, view] of Object.entries(routeData.views)) {
      if (view.mdx) {
        views.push({ key, content: stripMarkdown(view.mdx) });
      }
    }
  } else if (routeData.mdx) {
    views.push({ key: "overview", content: stripMarkdown(routeData.mdx) });
  }

  // Find the first view where every query token appears.
  for (const view of views) {
    const lower = view.content.toLowerCase();
    if (tokens.every((t) => lower.includes(t))) {
      return { viewKey: view.key, content: view.content };
    }
  }

  // Partial match: find the view with the most token hits.
  let bestView: (typeof views)[number] | null = null;
  let bestHits = 0;
  for (const view of views) {
    const lower = view.content.toLowerCase();
    const hits = tokens.filter((t) => lower.includes(t)).length;
    if (hits > bestHits) {
      bestHits = hits;
      bestView = view;
    }
  }

  if (bestView && bestHits > 0) {
    return { viewKey: bestView.key, content: bestView.content };
  }

  return null;
}

/**
 * Registers the `search_docs` tool on the given MCP server.
 *
 * Uses a two-phase search:
 * - Phase 1: Lightweight search against the in-memory index (title, description,
 *   tags, truncated content) to identify candidate pages.
 * - Phase 2: Lazy-loads full route data for candidates and searches across all
 *   views (overview, dev, guidelines, a11y) to find deep content matches.
 */
export function registerSearchDocs(server: McpServer): void {
  server.registerTool(
    "search_docs",
    {
      title: "Search Docs",
      description:
        "Searches across all Nimbus documentation (components, patterns, guides, tokens) " +
        "including implementation details, props, guidelines, and accessibility views. " +
        "Returns the top matching pages with content snippets from the matched section.",
      inputSchema: {
        query: z
          .string()
          .describe(
            'Search query to find relevant documentation pages. e.g. "form validation", "color tokens", "accessibility", "onChange".'
          ),
      },
    },
    async ({ query }) => {
      try {
        const index = await getSearchIndex();

        // Phase 1: Find candidates from lightweight index.
        const { matched, expanded } = findCandidates(index, query);
        const allCandidates = [...matched, ...expanded];
        const matchedIds = new Set(matched.map((e) => e.id));

        // Phase 2: Load full route data for candidates and search all views.
        const loadPromises = allCandidates.slice(0, 20).map(async (entry) => {
          const viewMatch = await searchRouteViews(entry.route, query);
          return { entry, viewMatch, wasMatched: matchedIds.has(entry.id) };
        });

        const loaded = await Promise.all(loadPromises);

        // Keep entries that either matched in phase 1 OR found a deep match
        // in phase 2. This filters out expanded fallback entries that had
        // no content match (e.g. nonsense queries).
        const relevant = loaded.filter(
          ({ viewMatch, wasMatched }) => wasMatched || viewMatch !== null
        );

        // Sort: entries with a deep view match rank higher, then by original order.
        relevant.sort((a, b) => {
          const aMatch = a.viewMatch ? 1 : 0;
          const bMatch = b.viewMatch ? 1 : 0;
          return bMatch - aMatch;
        });

        const output: DocSearchResult[] = relevant
          .slice(0, MAX_RESULTS)
          .map(({ entry, viewMatch }) => ({
            title: entry.title,
            description: entry.description,
            path: entry.route,
            ...(viewMatch && viewMatch.viewKey !== "overview"
              ? { matchedView: viewMatch.viewKey }
              : {}),
            snippet: viewMatch
              ? extractSnippet(viewMatch.content, query)
              : extractSnippet(entry.content, query),
          }));

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
