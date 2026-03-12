/**
 * Shared type definitions for the Nimbus MCP server.
 */

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
