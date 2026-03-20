import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getSearchIndex, getRouteData } from "../data-loader.js";
import type {
  SearchIndexEntry,
  RouteData,
  DocSearchResult,
  CandidateResult,
  ViewMatch,
  LoweredRelevanceFields,
} from "../types.js";
import { filterAndRankPreLowered } from "../utils/relevance.js";
import { stripMarkdown } from "../utils/markdown.js";

const MAX_RESULTS = 10;

/** Maps a route to the most useful follow-up tool, if any. */
function deriveToolHint(route: string): string | undefined {
  if (route.includes("design-tokens")) return "get_tokens";
  if (route.startsWith("components/") || route.startsWith("patterns/"))
    return "get_component";
  if (route.startsWith("icons")) return "search_icons";
  return undefined;
}
const SNIPPET_LENGTH = 200;
/** Characters of context shown before the matched token in a snippet. */
const SNIPPET_LEAD = 80;
/** Number of candidates passed to phase 2 (deep route-file search). */
const PHASE2_CANDIDATE_LIMIT = MAX_RESULTS;

/**
 * Minimum number of phase-1 candidates before we expand to all component pages.
 * If the lightweight index returns fewer than this, we broaden the candidate
 * pool so deep-content-only matches aren't missed.
 */
const MIN_CANDIDATES = 5;

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
    // Use pre-built lowered fields from prebuild step if available.
    if (entry._lower) {
      map.set(entry, entry._lower);
    } else {
      const title = entry.title.toLowerCase();
      const description = entry.description.toLowerCase();
      const tags = entry.tags.join(" ").toLowerCase();
      const content = entry.content?.toLowerCase() ?? "";
      map.set(entry, {
        title,
        description,
        tags,
        content,
        combined: title + " " + description + " " + tags + " " + content,
      });
    }
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

/** Cached stripped + lowered content per view object. */
interface CachedViewContent {
  stripped: string;
  lower: string;
}
const viewContentCache = new WeakMap<object, CachedViewContent>();

/** Get cached stripped and lowered content for a view object. */
function getCachedViewContent(viewObj: { mdx: string }): CachedViewContent {
  let cached = viewContentCache.get(viewObj);
  if (!cached) {
    const stripped = stripMarkdown(viewObj.mdx);
    cached = { stripped, lower: stripped.toLowerCase() };
    viewContentCache.set(viewObj, cached);
  }
  return cached;
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

  // Partial-match fallback: score entries by how many tokens match in any field.
  // Much faster than Fuse.js while still providing relevant results.
  const seen = new Set(exactMatches.map((e) => e.id));
  const partialScored: Array<{ entry: SearchIndexEntry; score: number }> = [];

  for (const entry of index) {
    if (seen.has(entry.id)) continue;
    const fields = loweredMap.get(entry)!;
    let score = 0;
    for (const t of tokens) {
      if (fields.combined.includes(t)) {
        if (fields.title.includes(t)) score += 8;
        if (fields.description.includes(t)) score += 4;
        if (fields.tags.includes(t)) score += 4;
        if (fields.content.includes(t)) score += 1;
      }
    }
    if (score > 0) {
      partialScored.push({ entry, score });
    }
  }

  partialScored.sort((a, b) => b.score - a.score);
  const matched = [...exactMatches];
  for (const { entry } of partialScored) {
    seen.add(entry.id);
    matched.push(entry);
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

/** Cached route view data with pre-computed combined lowered content. */
interface CachedRouteViews {
  views: Array<{
    key: string;
    content: string;
    lower: string;
    /** Truncated lower for matching (4KB cap). */
    matchLower: string;
  }>;
  /** All view content concatenated and lowered — for fast negative filtering. */
  combinedLower: string;
}
const routeViewsCache = new Map<string, CachedRouteViews>();

/**
 * Collects and caches the searchable views for a route. Returns cached
 * result on subsequent calls for the same slug.
 */
async function getRouteViews(route: string): Promise<CachedRouteViews> {
  const slug = routeToSlug(route);
  const cached = routeViewsCache.get(slug);
  if (cached) return cached;

  let routeData: RouteData;
  try {
    routeData = await getRouteData(slug);
  } catch {
    const empty: CachedRouteViews = { views: [], combinedLower: "" };
    routeViewsCache.set(slug, empty);
    return empty;
  }

  const MATCH_LIMIT = 2048;
  const rawViews: Array<{
    key: string;
    content: string;
    lower: string;
    matchLower: string;
  }> = [];
  if (routeData.views) {
    for (const [key, view] of Object.entries(routeData.views)) {
      if (view.mdx) {
        const { stripped, lower } = getCachedViewContent(view);
        rawViews.push({
          key,
          content: stripped,
          lower,
          matchLower:
            lower.length > MATCH_LIMIT ? lower.slice(0, MATCH_LIMIT) : lower,
        });
      }
    }
  } else if (routeData.mdx) {
    const { stripped, lower } = getCachedViewContent(
      routeData as unknown as { mdx: string }
    );
    rawViews.push({
      key: "overview",
      content: stripped,
      lower,
      matchLower:
        lower.length > MATCH_LIMIT ? lower.slice(0, MATCH_LIMIT) : lower,
    });
  }

  // Sort by content length (shortest first) for faster early-exit on full matches.
  rawViews.sort((a, b) => a.matchLower.length - b.matchLower.length);
  const views = rawViews;
  const result: CachedRouteViews = {
    views,
    combinedLower: views.map((v) => v.lower.slice(0, MATCH_LIMIT)).join(" "),
  };
  routeViewsCache.set(slug, result);
  return result;
}

/**
 * Phase 2: Search across all views for a candidate route.
 * Synchronous when views are cached, async only on first load.
 */
function searchRouteViewsSync(
  route: string,
  tokens: string[]
): ViewMatch | null {
  const slug = routeToSlug(route);
  const cached = routeViewsCache.get(slug);
  if (!cached) return null; // Will be loaded async and retried
  const { views } = cached;
  if (views.length === 0) return null;

  const tokenCount = tokens.length;
  let bestView: (typeof views)[number] | null = null;
  let bestHits = 0;

  for (const view of views) {
    let hits = 0;
    for (let i = 0; i < tokenCount; i++) {
      if (view.matchLower.includes(tokens[i])) hits++;
    }
    if (hits === tokenCount) {
      return { viewKey: view.key, content: view.content };
    }
    if (hits > bestHits) {
      bestHits = hits;
      bestView = view;
    }
  }

  return bestView && bestHits > 0
    ? { viewKey: bestView.key, content: bestView.content }
    : null;
}

/**
 * Eagerly loads all route views for candidates, then searches synchronously.
 */
async function warmAndSearchViews(
  candidates: SearchIndexEntry[],
  tokens: string[]
): Promise<Map<string, ViewMatch | null>> {
  // Warm the cache for all candidates in parallel.
  await Promise.all(candidates.map((e) => getRouteViews(e.route)));

  // Now search synchronously from cache.
  const results = new Map<string, ViewMatch | null>();
  for (const entry of candidates) {
    results.set(entry.id, searchRouteViewsSync(entry.route, tokens));
  }
  return results;
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
        "Results include a toolHint field indicating which tool to call for deeper info (e.g. get_component, get_tokens, search_icons).",
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

        // Pre-compute phase-1 scores synchronously.
        const phase1Scores = new Map<string, number>();
        for (const entry of allCandidates) {
          const f = loweredMap.get(entry)!;
          let s = 0;
          for (const t of tokens) {
            if (f.title.includes(t)) s += 8;
            if (f.description.includes(t)) s += 4;
            if (f.tags.includes(t)) s += 4;
            if (f.content.includes(t)) s += 1;
          }
          phase1Scores.set(entry.id, s);
        }

        // Phase 2: Warm route view caches, then search synchronously.
        const viewResults = await warmAndSearchViews(allCandidates, tokens);
        const loaded = allCandidates.map((entry) => ({
          entry,
          viewMatch: viewResults.get(entry.id) ?? null,
          wasMatched: matchedIds.has(entry.id),
          phase1Score: phase1Scores.get(entry.id)!,
        }));

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
            const toolHint = deriveToolHint(entry.route);
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
              ...(toolHint ? { toolHint } : {}),
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
