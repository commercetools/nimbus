/**
 * Remote DOM type definitions for MCP-UI server
 */

/**
 * Structured element definition for type-safe UI serialization
 */
export interface ElementDefinition {
  /** HTML tag name (e.g., 'nimbus-button', 'nimbus-text') */
  tagName: string;
  /** Element attributes as key-value pairs (undefined values are ignored by React) */
  attributes?: Record<string, string | boolean | number | undefined>;
  /** Child elements (can be nested ElementDefinitions or text nodes) */
  children?: (ElementDefinition | string)[];
}

// Re-export from index for convenience
export type { ElementDefinition as ElementDef };

/**
 * Remote DOM content - uses mutation observer for live incremental updates
 * The script field contains the serialized DOM tree as a JSON string
 */
export interface RemoteDomContent {
  type: "remoteDom";
  script: string;
  framework: "react";
}

export interface UIResourceMetadata {
  title?: string;
  description?: string;
  created?: string;
  [key: string]: unknown;
}
