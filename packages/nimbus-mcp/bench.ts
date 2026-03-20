import { performance } from "node:perf_hooks";

// Import data loaders and tool internals directly
import {
  getSearchIndex,
  getRouteManifest,
  getRouteData,
  getTypeData,
} from "./src/data-loader.js";
import { filterAndRankByRelevance } from "./src/utils/relevance.js";
import { stripMarkdown } from "./src/utils/markdown.js";
import Fuse from "fuse.js";
import type {
  SearchIndexEntry,
  RelevanceFields,
  RouteManifestEntry,
} from "./src/types.js";

interface BenchResult {
  name: string;
  avg: number;
  p50: number;
  p95: number;
  iterations: number;
}

async function bench(
  name: string,
  fn: () => Promise<unknown>,
  iterations = 100
): Promise<BenchResult> {
  // Warmup
  for (let i = 0; i < 10; i++) await fn();

  const times: number[] = [];
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    await fn();
    times.push(performance.now() - start);
  }
  times.sort((a, b) => a - b);
  const p50 = times[Math.floor(times.length * 0.5)];
  const p95 = times[Math.floor(times.length * 0.95)];
  const avg = times.reduce((a, b) => a + b, 0) / times.length;
  console.log(
    `BENCH: name=${name} avg=${avg.toFixed(2)} p50=${p50.toFixed(2)} p95=${p95.toFixed(2)}`
  );
  return { name, avg, p50, p95, iterations };
}

// ---- search_docs simulation ----
const MAX_RESULTS = 10;
const SNIPPET_LENGTH = 200;
const SNIPPET_LEAD = 80;
const PHASE2_CANDIDATE_LIMIT = MAX_RESULTS * 2;
const MIN_CANDIDATES = 5;

let fuseInstance: Fuse<SearchIndexEntry> | undefined;
let fuseIndexRef: SearchIndexEntry[] | undefined;

function entryFields(entry: SearchIndexEntry): RelevanceFields {
  return {
    title: entry.title,
    description: entry.description,
    tags: entry.tags.join(" "),
    content: entry.content,
  };
}

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

function routeToSlug(route: string): string {
  return route.replace(/\//g, "-");
}

function findCandidates(
  index: SearchIndexEntry[],
  query: string,
  tokens: string[]
) {
  const exactMatches = filterAndRankByRelevance(index, tokens, entryFields);
  if (exactMatches.length >= MIN_CANDIDATES) {
    return { matched: exactMatches, expanded: [] as SearchIndexEntry[] };
  }
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
  const seen = new Set(exactMatches.map((e) => e.id));
  const matched = [...exactMatches];
  for (const entry of fuzzyMatches) {
    if (!seen.has(entry.id)) {
      seen.add(entry.id);
      matched.push(entry);
    }
  }
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

async function searchRouteViews(route: string, tokens: string[]) {
  let routeData;
  try {
    routeData = await getRouteData(routeToSlug(route));
  } catch {
    return null;
  }
  const views: Array<{ key: string; content: string; lower: string }> = [];
  if (routeData.views) {
    for (const [key, view] of Object.entries(routeData.views)) {
      if (view.mdx) {
        const content = stripMarkdown(view.mdx);
        views.push({ key, content, lower: content.toLowerCase() });
      }
    }
  } else if (routeData.mdx) {
    const content = stripMarkdown(routeData.mdx);
    views.push({ key: "overview", content, lower: content.toLowerCase() });
  }
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

async function simulateSearchDocs(query: string) {
  const index = await getSearchIndex();
  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
  const { matched, expanded } = findCandidates(index, query, tokens);
  const matchedCapped = matched.slice(0, PHASE2_CANDIDATE_LIMIT);
  const expandedCapped = expanded.slice(
    0,
    Math.max(0, PHASE2_CANDIDATE_LIMIT - matchedCapped.length)
  );
  const allCandidates = [...matchedCapped, ...expandedCapped];
  const matchedIds = new Set(matched.map((e) => e.id));
  const loadPromises = allCandidates.map(async (entry) => {
    const viewMatch = await searchRouteViews(entry.route, tokens);
    return {
      entry,
      viewMatch,
      wasMatched: matchedIds.has(entry.id),
      phase1Score: 0,
    };
  });
  const loaded = await Promise.all(loadPromises);
  const relevant = loaded.filter(
    ({ viewMatch, wasMatched }) => wasMatched || viewMatch !== null
  );
  return relevant.slice(0, MAX_RESULTS);
}

// ---- get_component simulation ----
const CATALOG_CATEGORIES = new Set(["Components", "Patterns"]);
let resolveFuseInstance: Fuse<RouteManifestEntry> | undefined;
let resolveCatalogCache: RouteManifestEntry[] | undefined;
let resolveCatalogRoutesRef: RouteManifestEntry[] | undefined;

async function resolveComponent(name: string) {
  const manifest = await getRouteManifest();
  const needle = name.toLowerCase();
  if (!resolveCatalogCache || resolveCatalogRoutesRef !== manifest.routes) {
    resolveCatalogCache = manifest.routes.filter(
      (r) => CATALOG_CATEGORIES.has(r.category) && r.menu.length === 3
    );
    resolveFuseInstance = new Fuse(resolveCatalogCache, {
      keys: ["title", "exportName"],
      threshold: 0.3,
      ignoreLocation: true,
    });
    resolveCatalogRoutesRef = manifest.routes;
  }
  const catalog = resolveCatalogCache;
  const exact = catalog.find((r) => {
    if (r.exportName?.toLowerCase() === needle) return true;
    if (r.title.toLowerCase() === needle) return true;
    const idName = r.id.replace(/^(Components|Patterns)-/, "");
    return idName.toLowerCase() === needle;
  });
  if (exact) return exact;
  const fuzzyResults = resolveFuseInstance!.search(name);
  return fuzzyResults[0]?.item;
}

async function simulateGetComponent(name: string) {
  const entry = await resolveComponent(name);
  if (!entry) return null;
  const slug = entry.path.replace(/^\//, "").replace(/\//g, "-");
  const routeData = await getRouteData(slug);
  return { entry, routeData };
}

// ---- list_components simulation ----
async function simulateListComponents() {
  const manifest = await getRouteManifest();
  return manifest.routes.filter(
    (r) => r.category === "Components" && r.menu.length === 3
  );
}

// ---- main ----
async function main() {
  // Measure startup (first data load)
  const startupStart = performance.now();
  await getSearchIndex();
  await getRouteManifest();
  const startupMs = performance.now() - startupStart;
  console.log(
    `BENCH: name=startup avg=${startupMs.toFixed(2)} p50=0.00 p95=0.00`
  );

  // Search queries covering different patterns
  const searchQueries = [
    "button",
    "form validation",
    "color tokens",
    "accessibility",
    "onChange",
    "Select",
    "spacing",
  ];

  for (const q of searchQueries) {
    await bench(`search-${q}`, () => simulateSearchDocs(q));
  }

  // Aggregate search benchmark
  await bench(
    "search-all",
    async () => {
      for (const q of searchQueries) {
        await simulateSearchDocs(q);
      }
    },
    50
  );

  // get_component
  await bench("get-component-Button", () => simulateGetComponent("Button"));
  await bench("get-component-Select", () => simulateGetComponent("Select"));
  await bench("get-component-DatePicker", () =>
    simulateGetComponent("DatePicker")
  );

  // list_components
  await bench("list-components", () => simulateListComponents());
}

main().catch(console.error);
