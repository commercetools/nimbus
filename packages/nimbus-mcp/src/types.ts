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

/** Result returned by MCP tool handlers. */
export interface ToolResult {
  content: Array<{
    type: "text";
    text: string;
  }>;
}
