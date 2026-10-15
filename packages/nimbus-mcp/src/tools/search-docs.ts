import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getSearchIndex, getRouteData } from "../data-loader.js";
import type {
  SearchIndexEntry,
  RouteData,
  DocSearchResult,
  ViewMatch,
  LoweredRelevanceFields,
  CachedViewContent,
  CachedRouteViews,
} from "../types.js";
import { fuzzyScorePreLowered, scorePreLowered } from "../utils/relevance.js";
import { stripMarkdown } from "../utils/markdown.js";
import {
  extractSnippet,
  findBestAnchor,
  SNIPPET_LENGTH,
} from "../utils/snippet.js";
import { routePathToSlug as routeToSlug } from "../utils/route.js";

/** Upper bound on results per call; the `limit` input cannot exceed it. */
const MAX_RESULTS = 10;
/** Results returned when the caller does not pass `limit`. */
const DEFAULT_RESULTS = 5;
/**
 * Hard cap on the serialized response. Snippets of lower-ranked results are
 * shortened, then dropped, then whole results are dropped, until it fits.
 */
const OUTPUT_BUDGET_CHARS = 4000;
/** Snippet size a lower-ranked result is cut to before losing it entirely. */
const BUDGET_SNIPPET_LENGTH = Math.floor(SNIPPET_LENGTH / 3);
/** Score bonus for a view containing every query token. */
const FULL_VIEW_MATCH_BONUS = 1000;
/** Score bonus scale for a view containing only some query tokens. */
const PARTIAL_VIEW_MATCH_BONUS = 500;

/** Maps a route to the most useful follow-up tool. */
function deriveToolHint(route: string): string {
  if (route.includes("design-tokens")) return "get_tokens";
  if (route.startsWith("components/") || route.startsWith("patterns/"))
    return "get_component";
  if (route.startsWith("icons")) return "search_icons";
  return "get_docs_page";
}

/** Pre-computed lowercased fields for each search index entry. */
let loweredFieldsCache:
  Map<SearchIndexEntry, LoweredRelevanceFields> | undefined;
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
        titleNoSpaces: title.replace(/\s+/g, ""),
        descriptionNoSpaces: description.replace(/\s+/g, ""),
        tagsNoSpaces: tags.replace(/\s+/g, ""),
        titleWords: title.split(/\s+/).filter(Boolean),
        descriptionWords: description.split(/\s+/).filter(Boolean),
        tagsWords: tags.split(/\s+/).filter(Boolean),
      });
    }
  }
  loweredFieldsCache = map;
  loweredFieldsIndexRef = index;
  return map;
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
 * Phase 1: metadata relevance from the lightweight index. Exact substring
 * scoring first; fuzzy (typo-tolerant) scoring only when exact finds nothing
 * for the entry, so it can never outrank a precise hit.
 */
function scoreMetadata(
  fields: LoweredRelevanceFields,
  tokens: string[]
): number {
  const exact = scorePreLowered(fields, tokens);
  return exact > 0 ? exact : fuzzyScorePreLowered(fields, tokens);
}

/**
 * Cache for per-route searchable views, keyed by slug.
 *
 * Lifecycle: holds every route for the life of the process (~7 MB for the
 * current corpus). This is safe because the MCP server runs as a short-lived
 * stdio process — one per editor session — so memory is reclaimed when the
 * process exits. If the server is ever adapted for SSE or other long-lived
 * transports, an LRU eviction policy should be added here.
 */
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
    const empty: CachedRouteViews = { views: [] };
    routeViewsCache.set(slug, empty);
    return empty;
  }

  const views: CachedRouteViews["views"] = [];
  if (routeData.views) {
    for (const [key, view] of Object.entries(routeData.views)) {
      if (view.mdx) {
        const { stripped, lower } = getCachedViewContent(view);
        views.push({ key, content: stripped, lower });
      }
    }
  } else if (routeData.mdx) {
    const { stripped, lower } = getCachedViewContent({ mdx: routeData.mdx });
    views.push({ key: "overview", content: stripped, lower });
  }

  // Shortest first, so ties between equally good views favour the tighter page.
  views.sort((a, b) => a.lower.length - b.lower.length);
  const result: CachedRouteViews = { views };
  routeViewsCache.set(slug, result);
  return result;
}

let warmAllPromise: Promise<void> | undefined;
let warmAllIndexRef: SearchIndexEntry[] | undefined;

/**
 * Loads every route's views into the cache once per index. Kicked off in the
 * background at registration so the first query rarely waits on disk; the
 * handler awaits the same promise so a query can never race the load.
 */
function warmAllRouteViews(index: SearchIndexEntry[]): Promise<void> {
  if (!warmAllPromise || warmAllIndexRef !== index) {
    warmAllIndexRef = index;
    warmAllPromise = Promise.all(index.map((e) => getRouteViews(e.route))).then(
      () => undefined
    );
  }
  return warmAllPromise;
}

/**
 * Phase 2: finds the best view of a route for the query. Views with the most
 * distinct token hits win; among equals, the view where the tokens co-occur
 * most tightly, then the shortest. Synchronous — the cache must be warm.
 */
function searchRouteViewsSync(
  route: string,
  tokens: string[]
): ViewMatch | null {
  const cached = routeViewsCache.get(routeToSlug(route));
  if (!cached || cached.views.length === 0) return null;

  let best: ViewMatch | null = null;
  let bestCooccurrence = 0;
  for (const view of cached.views) {
    let hits = 0;
    for (const token of tokens) {
      if (view.lower.includes(token)) hits++;
    }
    if (hits === 0 || (best && hits < best.hits)) continue;

    // Only break ties on co-occurrence for multi-token queries; for a single
    // token every hit co-occurs trivially and the shortest view already wins.
    const cooccurrence =
      tokens.length > 1 ? findBestAnchor(view.lower, tokens).count : 1;
    if (!best || hits > best.hits || cooccurrence > bestCooccurrence) {
      best = { viewKey: view.key, content: view.content, hits };
      bestCooccurrence = cooccurrence;
    }
  }
  return best;
}

/**
 * Shrinks the response until it fits OUTPUT_BUDGET_CHARS. Works from the
 * lowest-ranked result upward and never touches the top result's snippet:
 * first shorten snippets, then drop them, then drop whole results.
 */
function enforceOutputBudget(output: DocSearchResult[]): void {
  const over = () => JSON.stringify(output).length > OUTPUT_BUDGET_CHARS;

  for (let i = output.length - 1; i > 0 && over(); i--) {
    const snippet = output[i].snippet;
    if (snippet && snippet.length > BUDGET_SNIPPET_LENGTH) {
      output[i].snippet =
        snippet.slice(0, BUDGET_SNIPPET_LENGTH).trimEnd() + "…";
    }
  }
  for (let i = output.length - 1; i > 0 && over(); i--) {
    delete output[i].snippet;
  }
  while (output.length > 1 && over()) {
    output.pop();
  }
}

/**
 * Registers the `search_docs` tool on the given MCP server.
 *
 * Two signals are combined for every page in the index:
 * - Metadata relevance (title, description, tags, index excerpt) from the
 *   lightweight search index.
 * - Deep content: every view (overview, dev, guidelines, a11y) of every route
 *   is searched in full, so a prop name mentioned once in a dev view is found.
 *
 * A page is returned if either signal fires; a snippet is emitted only when a
 * view actually matched, anchored where the query tokens co-occur.
 */
export function registerSearchDocs(server: McpServer): void {
  // Start loading route views now so the first query rarely pays for it.
  getSearchIndex()
    .then((index) => warmAllRouteViews(index))
    .catch(() => {
      // Data unavailable — the handler reports this per call.
    });

  server.registerTool(
    "search_docs",
    {
      title: "Search Docs",
      description:
        "Search all Nimbus docs (components, patterns, hooks, icons, tokens) including implementation, guidelines and accessibility views. " +
        "Returns matching pages; results whose content matched include a snippet anchored on the query terms. " +
        "Props are not searchable here — use get_component with section='props' for prop details. " +
        "Results include a toolHint field indicating which tool to call for deeper info (e.g. get_component, get_tokens, search_icons, get_docs_page).",
      inputSchema: {
        query: z
          .string()
          .describe(
            'Search query to find relevant documentation pages. e.g. "form validation", "color tokens", "accessibility", "onChange".'
          ),
        limit: z
          .number()
          .int()
          .min(1)
          .max(MAX_RESULTS)
          .optional()
          .describe(`Max results (default ${DEFAULT_RESULTS}).`),
      },
    },
    async ({ query, limit }) => {
      try {
        const index = await getSearchIndex();

        // Tokenise once; pass pre-parsed tokens to all downstream functions.
        const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
        const tokenCount = tokens.length;
        if (tokenCount === 0) {
          return {
            content: [
              {
                type: "text" as const,
                text: "No matching documentation found.",
              },
            ],
          };
        }

        const loweredMap = getLoweredFields(index);
        await warmAllRouteViews(index);

        const scored: Array<{
          entry: SearchIndexEntry;
          viewMatch: ViewMatch | null;
          score: number;
        }> = [];
        for (const entry of index) {
          const metadataScore = scoreMetadata(loweredMap.get(entry)!, tokens);
          const viewMatch = searchRouteViewsSync(entry.route, tokens);
          if (metadataScore === 0 && !viewMatch) continue;

          // Deep content is the primary signal; metadata breaks ties.
          const viewScore = !viewMatch
            ? 0
            : viewMatch.hits === tokenCount
              ? FULL_VIEW_MATCH_BONUS
              : (PARTIAL_VIEW_MATCH_BONUS * viewMatch.hits) / tokenCount;
          scored.push({ entry, viewMatch, score: viewScore + metadataScore });
        }
        scored.sort((a, b) => b.score - a.score);

        const output: DocSearchResult[] = scored
          .slice(0, limit ?? DEFAULT_RESULTS)
          .map(({ entry, viewMatch }) => {
            const result: DocSearchResult = {
              title: entry.title,
              description: entry.description,
              path: entry.route,
              toolHint: deriveToolHint(entry.route),
            };
            if (viewMatch) {
              if (viewMatch.viewKey !== "overview") {
                result.matchedView = viewMatch.viewKey;
              }
              result.snippet = extractSnippet(viewMatch.content, tokens);
            }
            return result;
          });
        enforceOutputBudget(output);

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
