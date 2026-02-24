import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

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

/** Path to route-manifest.json when running inside the monorepo. */
const MONOREPO_DATA_DIR = resolve(PACKAGE_ROOT, "../../apps/docs/src/data");

/** Path to bundled data shipped with the npm package. */
const BUNDLED_DATA_DIR = resolve(PACKAGE_ROOT, "data");

/** Marker file used to detect monorepo mode. */
const MONOREPO_MARKER = resolve(MONOREPO_DATA_DIR, "route-manifest.json");

// ---------------------------------------------------------------------------
// Mode detection
// ---------------------------------------------------------------------------

let _isMonorepo: boolean | null = null;

/** Returns `true` when running inside the Nimbus monorepo. */
export function isMonorepoMode(): boolean {
  if (_isMonorepo === null) {
    _isMonorepo = existsSync(MONOREPO_MARKER);
  }
  return _isMonorepo;
}

/** Returns the resolved data directory for the current mode. */
export function getDataDir(): string {
  return isMonorepoMode() ? MONOREPO_DATA_DIR : BUNDLED_DATA_DIR;
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

export interface RouteManifestEntry {
  path: string;
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  menu: string[];
  order: number;
  chunkName: string;
  tabs?: Array<{ key: string; title: string; order: number }>;
}

export interface RouteManifest {
  routes: RouteManifestEntry[];
}

export const getRouteManifest = lazyJson<RouteManifest>("route-manifest.json");

// ---------------------------------------------------------------------------
// Per-component route data
// ---------------------------------------------------------------------------

export interface RouteData {
  meta: {
    id: string;
    title: string;
    description: string;
    route: string;
    menu: string[];
    tags: string[];
    toc?: Array<{ id: string; title: string; depth: number }>;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

/**
 * Loads a per-component route JSON by slug.
 * Example: `getRouteData("components-inputs-button")`
 */
export async function getRouteData(slug: string): Promise<RouteData> {
  const fullPath = resolve(getDataDir(), "routes", `${slug}.json`);
  return readJson<RouteData>(fullPath);
}

// ---------------------------------------------------------------------------
// Per-component type data
// ---------------------------------------------------------------------------

export interface TypeData {
  displayName: string;
  description: string;
  filePath: string;
  props: Record<
    string,
    {
      name: string;
      description: string;
      required: boolean;
      type: { name: string };
      defaultValue?: { value: string };
    }
  >;
  methods: unknown[];
  tags: Record<string, string>;
}

/**
 * Loads a per-component type JSON by component name.
 * Example: `getTypeData("Button")`
 */
export async function getTypeData(componentName: string): Promise<TypeData> {
  const fullPath = resolve(getDataDir(), "types", `${componentName}.json`);
  return readJson<TypeData>(fullPath);
}

// ---------------------------------------------------------------------------
// Types index
// ---------------------------------------------------------------------------

export const getTypesIndex = lazyJson<TypeData[]>("types.json");

// ---------------------------------------------------------------------------
// Search index
// ---------------------------------------------------------------------------

export interface SearchIndexEntry {
  id: string;
  title: string;
  description: string;
  tags: string[];
  route: string;
  menu: string[];
  content: string;
}

export const getSearchIndex = lazyJson<SearchIndexEntry[]>("search-index.json");

// ---------------------------------------------------------------------------
// Docs (token / icon data is embedded in the docs.json manifest)
// ---------------------------------------------------------------------------

export interface DocEntry {
  meta: {
    id: string;
    title: string;
    description: string;
    route: string;
    menu: string[];
    tags: string[];
    [key: string]: unknown;
  };
  mdx: string;
}

export type DocsManifest = Record<string, DocEntry>;

export const getDocsManifest = lazyJson<DocsManifest>("docs.json");

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
