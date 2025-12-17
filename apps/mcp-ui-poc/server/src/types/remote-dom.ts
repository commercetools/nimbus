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
 * Structured DOM content - new approach using data instead of code
 */
export interface StructuredDomContent {
  type: "structuredDom";
  element: ElementDefinition;
  framework: "react";
}

/**
 * Remote DOM content - legacy approach using script strings
 * @deprecated Use StructuredDomContent instead for better type safety
 */
export interface RemoteDomContent {
  type: "remoteDom";
  script: string;
  framework: "react";
}

/**
 * Union type supporting both old and new approaches during migration
 */
export type DomContent = StructuredDomContent | RemoteDomContent;

export interface UIResourceMetadata {
  title?: string;
  description?: string;
  created?: string;
  [key: string]: unknown;
}
