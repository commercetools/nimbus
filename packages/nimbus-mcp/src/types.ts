/**
 * Shared type definitions for the Nimbus MCP server.
 */

// ---------------------------------------------------------------------------
// Core types
// ---------------------------------------------------------------------------

/** Metadata about a Nimbus component. */
export interface ComponentMeta {
  /** Component name in PascalCase (e.g. "Button", "DatePicker"). */
  name: string;
  /** Brief description of the component's purpose. */
  description: string;
  /** Filesystem path to the component directory. */
  path: string;
}

/** A single design token entry. */
export interface DesignToken {
  /** Token name (e.g. "color.primary.500"). */
  name: string;
  /** Resolved token value. */
  value: string;
  /** Category the token belongs to (e.g. "color", "spacing"). */
  category: string;
}

/** A single result from the search_docs tool. */
export interface DocSearchResult {
  /** Page title. */
  title: string;
  /** Short page description. */
  description: string;
  /** Route path to the documentation page. */
  path: string;
  /**
   * Top-level category of the page (e.g. "Components", "Guides", "Tokens").
   * Equivalent to `category` on RouteManifestEntry — derived from menu[0].
   * Omitted when the page has no menu hierarchy.
   */
  category?: string;
  /** Which view the match was found in (e.g. "overview", "dev", "guidelines", "a11y"). */
  matchedView?: string;
  /** Content snippet highlighting the match. */
  snippet: string;
}

/** Result returned by MCP tool handlers. */
export interface ToolResult {
  content: Array<{
    type: "text";
    text: string;
  }>;
}

/** A single entry in the icon catalog. */
export interface IconCatalogEntry {
  /** Exported name used in import statements (e.g. "SvgAccountCircle"). */
  name: string;
  /** npm import path (always "@commercetools/nimbus-icons"). */
  importPath: string;
  /** Whether this is a Material Design icon or a custom commercetools icon. */
  category: "material" | "custom";
  /** Searchable keywords derived from the icon name and synonyms. */
  keywords: string[];
}

// ---------------------------------------------------------------------------
// Route / docs types (used by data-loader and tools)
// ---------------------------------------------------------------------------

/** Route manifest entry for a documentation page. */
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
  exportName?: string;
  tabs?: Array<{ key: string; title: string; order: number }>;
}

/** Full route manifest. */
export interface RouteManifest {
  routes: RouteManifestEntry[];
}

/** A single view within route data. */
export interface RouteDataView {
  mdx: string;
  toc: Array<{ value: string; href: string; depth: number }>;
}

/** Per-component route data. */
export interface RouteData {
  meta: {
    id: string;
    title: string;
    description: string;
    route: string;
    menu: string[];
    tags: string[];
    tabs?: Array<{ key: string; title: string; order: number }>;
    toc?: Array<{ id: string; title: string; depth: number }>;
    [key: string]: unknown;
  };
  mdx?: string;
  views?: Record<string, RouteDataView>;
  [key: string]: unknown;
}

/** Type metadata for a component. */
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
      parent?: { fileName: string; name: string };
    }
  >;
  methods: unknown[];
  tags: Record<string, string>;
}

/** An entry in the search index. */
export interface SearchIndexEntry {
  id: string;
  title: string;
  description: string;
  tags: string[];
  route: string;
  menu: string[];
  content: string;
}

/** A documentation entry (from docs manifest). */
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

/** Docs manifest — collection of all docs entries. */
export type DocsManifest = Record<string, DocEntry>;

/** Icon catalog metadata. */
export interface IconCatalog {
  /** Total number of icons in the catalog. */
  count: number;
  /** All icon entries. */
  icons: IconCatalogEntry[];
}

// ---------------------------------------------------------------------------
// Token types (used by processors/flatten-tokens and data-loader)
// ---------------------------------------------------------------------------

/** A single flattened design token. */
export interface FlatToken {
  /** Dot-separated token name (e.g. "spacing.400"). */
  name: string;
  /** Resolved token value (e.g. "16px"). */
  value: string;
  /** Top-level category (e.g. "spacing", "color", "fontSize"). */
  category: string;
  /** Path segments from root to this token. */
  path: string[];
}

/** Complete output of the token flattener. */
export interface FlatTokenData {
  /** All tokens in a flat list. */
  tokens: FlatToken[];
  /** Tokens grouped by category. */
  byCategory: Record<string, FlatToken[]>;
  /** Reverse-lookup: value → list of token names that resolve to it. */
  reverseLookup: Record<string, string[]>;
}

// ---------------------------------------------------------------------------
// Component tool types (used by tools/get-component and tools/list-components)
// ---------------------------------------------------------------------------

/** Filtered prop definition for component API reference. */
export interface FilteredProp {
  name: string;
  type: string;
  required: boolean;
  description: string;
  defaultValue?: string;
  subComponent?: string;
}

/** Component metadata response from the get_component tool. */
export interface ComponentMetadata {
  name: string;
  exportName?: string;
  description: string;
  path: string;
  subcategory?: string;
  tags?: string[];
  sections: string[];
}

/** Shape returned for each component in the list_components response. */
export interface ComponentSummary {
  title: string;
  description: string;
  path: string;
  exportName?: string;
  subcategory?: string;
  tags?: string[];
}

// ---------------------------------------------------------------------------
// Search tool types (used by tools/search-docs)
// ---------------------------------------------------------------------------

/** Result of phase-1 candidate filtering in search_docs. */
export interface CandidateResult {
  /** Entries that matched in phase 1 (exact or fuzzy on metadata). */
  matched: SearchIndexEntry[];
  /** Additional entries added as fallback candidates for deep search. */
  expanded: SearchIndexEntry[];
}

/** A view match with content from route data. */
export interface ViewMatch {
  viewKey: string;
  content: string;
}

// ---------------------------------------------------------------------------
// Relevance scoring (used by utils/relevance and tools)
// ---------------------------------------------------------------------------

/** Fields used for relevance scoring. Tags should be pre-joined into a string. */
export interface RelevanceFields {
  title: string;
  description: string;
  tags: string;
  content?: string;
}

/** Pre-lowercased relevance fields to avoid repeated toLowerCase() calls. */
export interface LoweredRelevanceFields {
  title: string;
  description: string;
  tags: string;
  content: string;
}
