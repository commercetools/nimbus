import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type {
  RouteManifest,
  RouteData,
  TypeData,
  SearchIndexEntry,
  DocEntry,
  DocsManifest,
  IconCatalog,
  FlatTokenData,
} from "./types.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Resolves the package root by walking up from the current file's directory
 * until we find the package.json for nimbus-mcp.
 */
function findPackageRoot(): string {
  let dir = __dirname;
  while (dir !== dirname(dir)) {
    if (existsSync(resolve(dir, "package.json"))) {
      return dir;
    }
    dir = dirname(dir);
  }
  return __dirname;
}

const PACKAGE_ROOT = findPackageRoot();

/**
 * Root data directory. Prebuild steps populate subdirectories here:
 * - data/docs/  — docs data (copy-docs-data.mjs)
 * - data/...    — future data sources
 */
const DATA_DIR = resolve(PACKAGE_ROOT, "data");

/** Returns the root data directory. */
export function getDataDir(): string {
  return DATA_DIR;
}

// ---------------------------------------------------------------------------
// Generic helpers
// ---------------------------------------------------------------------------

async function readJson<T>(filePath: string): Promise<T> {
  const raw = await readFile(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

/**
 * Creates a lazy accessor that reads and caches a JSON file on first call.
 */
function lazyJson<T>(relativePath: string): () => Promise<T> {
  let cached: T | undefined;
  return async () => {
    if (cached === undefined) {
      const fullPath = resolve(getDataDir(), relativePath);
      cached = await readJson<T>(fullPath);
    }
    return cached;
  };
}

// ---------------------------------------------------------------------------
// Route manifest
// ---------------------------------------------------------------------------

export const getRouteManifest = lazyJson<RouteManifest>(
  "docs/route-manifest.json"
);

// ---------------------------------------------------------------------------
// Per-component route data
// ---------------------------------------------------------------------------

/**
 * Cache for per-component route data, keyed by slug.
 *
 * Lifecycle: grows without eviction. This is safe because the MCP server runs
 * as a short-lived stdio process — one per editor session — so memory is
 * reclaimed when the process exits. If the server is ever adapted for SSE or
 * other long-lived transports, an LRU eviction policy should be added here.
 */
const routeDataCache = new Map<string, RouteData>();

/**
 * Loads a per-component route JSON by slug.
 * Example: `getRouteData("components-inputs-button")`
 */
export async function getRouteData(slug: string): Promise<RouteData> {
  const cached = routeDataCache.get(slug);
  if (cached) return cached;
  const fullPath = resolve(getDataDir(), "docs/routes", `${slug}.json`);
  const data = await readJson<RouteData>(fullPath);
  routeDataCache.set(slug, data);
  return data;
}

// ---------------------------------------------------------------------------
// Per-component type data
// ---------------------------------------------------------------------------

/**
 * Loads a per-component type JSON by component name.
 * Example: `getTypeData("Button")`
 */
export async function getTypeData(componentName: string): Promise<TypeData> {
  const fullPath = resolve(getDataDir(), "docs/types", `${componentName}.json`);
  return readJson<TypeData>(fullPath);
}

// ---------------------------------------------------------------------------
// Types index
// ---------------------------------------------------------------------------

export const getTypesIndex = lazyJson<TypeData[]>("docs/types.json");

// ---------------------------------------------------------------------------
// Search index
// ---------------------------------------------------------------------------

export const getSearchIndex = lazyJson<SearchIndexEntry[]>(
  "docs/search-index.json"
);

// ---------------------------------------------------------------------------
// Docs (token / icon data is embedded in the docs.json manifest)
// ---------------------------------------------------------------------------

export const getDocsManifest = lazyJson<DocsManifest>("docs/docs.json");

// ---------------------------------------------------------------------------
// Convenience: token data
// ---------------------------------------------------------------------------

/**
 * Returns docs entries whose route starts with `home/design-tokens`.
 */
export async function getTokenData(): Promise<DocEntry[]> {
  const docs = await getDocsManifest();
  return Object.values(docs).filter((entry) =>
    entry.meta.route.startsWith("design-tokens")
  );
}

// ---------------------------------------------------------------------------
// Convenience: icon data
// ---------------------------------------------------------------------------

/**
 * Returns the Icons docs entry from the docs manifest.
 */
export async function getIconData(): Promise<DocEntry | undefined> {
  const docs = await getDocsManifest();
  return Object.values(docs).find(
    (entry) => entry.meta.id === "Icons" || entry.meta.route.includes("icons")
  );
}

// ---------------------------------------------------------------------------
// Icon catalog (generated by scripts/build-icon-catalog.ts)
// ---------------------------------------------------------------------------

/** Returns the full icon catalog. */
export const getIconCatalog = lazyJson<IconCatalog>("icons.json");

// ---------------------------------------------------------------------------
// Flattened token data
// ---------------------------------------------------------------------------

export { reverseLookup } from "./processors/flatten-tokens.js";

/**
 * Loads the pre-built flattened token data from `data/tokens.json`.
 */
export const getFlatTokenData = lazyJson<FlatTokenData>("tokens.json");
