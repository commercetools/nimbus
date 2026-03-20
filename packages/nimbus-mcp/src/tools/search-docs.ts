import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import Fuse from "fuse.js";
import { z } from "zod";
import { getSearchIndex, getRouteData } from "../data-loader.js";
import type {
  SearchIndexEntry,
  RouteData,
  DocSearchResult,
  CandidateResult,
  ViewMatch,
  RelevanceFields,
  LoweredRelevanceFields,
} from "../types.js";
import {
  scoreRelevance,
  filterAndRankByRelevance,
  filterAndRankPreLowered,
  scorePreLowered,
} from "../utils/relevance.js";
import { stripMarkdown } from "../utils/markdown.js";

const MAX_RESULTS = 10;
const SNIPPET_LENGTH = 200;
/** Characters of context shown before the matched token in a snippet. */
const SNIPPET_LEAD = 80;
/** Number of candidates passed to phase 2 (deep route-file search). */
const PHASE2_CANDIDATE_LIMIT = MAX_RESULTS * 2;

/**
 * Minimum number of phase-1 candidates before we expand to all component pages.
 * If the lightweight index returns fewer than this, we broaden the candidate
 * pool so deep-content-only matches aren't missed.
 */
const MIN_CANDIDATES = 5;

/** Cached Fuse instance + the index reference it was built from. */
let fuseInstance: Fuse<SearchIndexEntry> | undefined;
let fuseIndexRef: SearchIndexEntry[] | undefined;

/** Pre-computed lowercased fields for each search index entry. */
let loweredFieldsCache:
  | Map<SearchIndexEntry, LoweredRelevanceFields>
  | undefined;
let loweredFieldsIndexRef: SearchIndexEntry[] | undefined;

function getLoweredFields(
  index: SearchIndexEntry[]
): Map<SearchIndexEntry, LoweredRelevanceFields> {
  if (loweredFieldsCache && loweredFieldsIndexRef === index)
    return loweredFieldsCache;
  const map = new Map<SearchIndexEntry, LoweredRelevanceFields>();
  for (const entry of index) {
    map.set(entry, {
      title: entry.title.toLowerCase(),
      description: entry.description.toLowerCase(),
      tags: entry.tags.join(" ").toLowerCase(),
      content: entry.content?.toLowerCase() ?? "",
    });
  }
  loweredFieldsCache = map;
  loweredFieldsIndexRef = index;
  return map;
}

/**
 * Extracts a content snippet anchored to the earliest occurrence of any query
 * token so the excerpt is as close to the start of the document as possible.
 */
function extractSnippet(content: string, tokens: string[]): string {
  const lower = content.toLowerCase();

  let bestIndex = -1;
  for (const token of tokens) {
    const idx = lower.indexOf(token);
    if (idx !== -1 && (bestIndex === -1 || idx < bestIndex)) {
      bestIndex = idx;
    }
  }

  if (bestIndex === -1) {
    return (
      content.slice(0, SNIPPET_LENGTH).trim() +
      (content.length > SNIPPET_LENGTH ? "…" : "")
    );
  }

  const start = Math.max(0, bestIndex - SNIPPET_LEAD);
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

/** Cache for stripped markdown content, keyed by the raw mdx string reference. */
const strippedCache = new WeakMap<object, string>();

/** Strip markdown with caching. Uses the RouteDataView object as cache key. */
function cachedStripMarkdown(viewObj: { mdx: string }): string {
  let stripped = strippedCache.get(viewObj);
  if (stripped === undefined) {
    stripped = stripMarkdown(viewObj.mdx);
    strippedCache.set(viewObj, stripped);
  }
  return stripped;
}

/** Maps a SearchIndexEntry to RelevanceFields for scoring. */
function entryFields(entry: SearchIndexEntry): RelevanceFields {
  return {
    title: entry.title,
    description: entry.description,
    tags: entry.tags.join(" "),
    content: entry.content,
  };
}

/**
 * Phase 1: Lightweight search against the in-memory search index.
 * Accepts pre-parsed tokens to avoid redundant tokenisation.
 * Returns matched entries and fallback expansion candidates separately
 * so the caller can distinguish real metadata matches from speculative ones.
 */
function findCandidates(
  index: SearchIndexEntry[],
  query: string,
  tokens: string[],
  loweredMap: Map<SearchIndexEntry, LoweredRelevanceFields>
): CandidateResult {
  // Exact substring match — single-pass filter + rank using pre-lowered fields.
  const exactMatches = filterAndRankPreLowered(
    index,
    tokens,
    (entry) => loweredMap.get(entry)!
  );

  if (exactMatches.length >= MIN_CANDIDATES) {
    return { matched: exactMatches, expanded: [] };
  }

  // Fuzzy fallback — broaden the candidate pool.
  // Invalidate cache when the index reference changes (e.g. hot-reload).
  if (!fuseInstance || fuseIndexRef !== index) {
    fuseInstance = new Fuse(index, {
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
    fuseIndexRef = index;
  }
  const fuzzyMatches = fuseInstance.search(query).map((r) => r.item);

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

/**
 * Phase 2: Load the full route data for a candidate and search across all
 * views for the query. Accepts pre-parsed tokens to avoid redundant
 * tokenisation. Returns the best matching view, or null if no view
 * contains the query tokens.
 */
async function searchRouteViews(
  route: string,
  tokens: string[]
): Promise<ViewMatch | null> {
  let routeData: RouteData;
  try {
    routeData = await getRouteData(routeToSlug(route));
  } catch {
    return null;
  }

  // Collect all searchable views. Store lowercased content once to avoid
  // repeated toLowerCase() calls inside the search loop below.
  const views: Array<{ key: string; content: string; lower: string }> = [];

  if (routeData.views) {
    for (const [key, view] of Object.entries(routeData.views)) {
      if (view.mdx) {
        const content = cachedStripMarkdown(view);
        views.push({ key, content, lower: content.toLowerCase() });
      }
    }
  } else if (routeData.mdx) {
    const content = cachedStripMarkdown(
      routeData as unknown as { mdx: string }
    );
    views.push({ key: "overview", content, lower: content.toLowerCase() });
  }

  // Single pass: return the first full match; track best partial as fallback.
  let bestPartial: (typeof views)[number] | null = null;
  let bestHits = 0;

  for (const view of views) {
    const hits = tokens.filter((t) => view.lower.includes(t)).length;
    if (hits === tokens.length) {
      return { viewKey: view.key, content: view.content };
    }
    if (hits > bestHits) {
      bestHits = hits;
      bestPartial = view;
    }
  }

  if (bestPartial && bestHits > 0) {
    return { viewKey: bestPartial.key, content: bestPartial.content };
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
        "Search all Nimbus docs (components, patterns, hooks, icons, tokens) including guidelines and accessibility views. " +
        "Returns matching pages with content snippets. Props are not searchable here — use get_component with section='props' for prop details. " +
        "Each result has a category — follow up with: get_component ('Components', 'Patterns'), " +
        "get_tokens ('Tokens'), search_icons ('Icons'). For other categories the snippet is the primary content.",
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

        // Tokenise once; pass pre-parsed tokens to all downstream functions.
        const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);

        // Pre-compute lowered fields once per index.
        const loweredMap = getLoweredFields(index);

        // Phase 1: Find candidates from lightweight index.
        const { matched, expanded } = findCandidates(
          index,
          query,
          tokens,
          loweredMap
        );

        // Cap expansion so genuine matches always consume their share of the
        // phase-2 I/O budget before fallback pages fill the remainder.
        const matchedCapped = matched.slice(0, PHASE2_CANDIDATE_LIMIT);
        const expandedCapped = expanded.slice(
          0,
          Math.max(0, PHASE2_CANDIDATE_LIMIT - matchedCapped.length)
        );
        const allCandidates = [...matchedCapped, ...expandedCapped];
        const matchedIds = new Set(matched.map((e) => e.id));

        // Phase 2: Load full route data for candidates and search all views.
        // Compute phase-1 score so the phase-2 sort can use it as a tiebreaker.
        const loadPromises = allCandidates.map(async (entry) => {
          const viewMatch = await searchRouteViews(entry.route, tokens);
          return {
            entry,
            viewMatch,
            wasMatched: matchedIds.has(entry.id),
            phase1Score: scorePreLowered(loweredMap.get(entry)!, tokens),
          };
        });

        const loaded = await Promise.all(loadPromises);

        // Keep entries that either matched in phase 1 OR found a deep match
        // in phase 2. This filters out expanded fallback entries that had
        // no content match (e.g. nonsense queries).
        const relevant = loaded.filter(
          ({ viewMatch, wasMatched }) => wasMatched || viewMatch !== null
        );

        // Sort: viewMatch presence is the primary signal (gets a large bonus),
        // phase-1 relevance score breaks ties within each group.
        relevant.sort((a, b) => {
          const aScore = (a.viewMatch ? 1000 : 0) + a.phase1Score;
          const bScore = (b.viewMatch ? 1000 : 0) + b.phase1Score;
          return bScore - aScore;
        });

        const output: DocSearchResult[] = relevant
          .slice(0, MAX_RESULTS)
          .map(({ entry, viewMatch }) => {
            const category = entry.menu[0];
            return {
              title: entry.title,
              description: entry.description,
              path: entry.route,
              ...(category ? { category } : {}),
              ...(viewMatch && viewMatch.viewKey !== "overview"
                ? { matchedView: viewMatch.viewKey }
                : {}),
              snippet: viewMatch
                ? extractSnippet(viewMatch.content, tokens)
                : extractSnippet(stripMarkdown(entry.content), tokens),
            };
          });

        return {
          content: [
            {
              type: "text" as const,
              text:
                output.length > 0
                  ? JSON.stringify(output)
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
