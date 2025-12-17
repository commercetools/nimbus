/**
 * Remote DOM type definitions for MCP-UI server
 */

/**
 * Intent structure for user actions that bubble up from components.
 * The description field is human-readable text that Claude interprets directly.
 */
export interface Intent {
  /** Intent type identifier (e.g., "view_details", "add_to_cart") */
  type: string;
  /**
   * Human-readable description of what the user wants to do.
   * This is what Claude will see and interpret.
   * Should be written as if the user is speaking to Claude.
   */
  description: string;
  /**
   * Structured payload with intent-specific data.
   * Claude can use this for tool calls or additional context.
   */
  payload: Record<string, unknown>;
}

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
  /** Event handlers for user interactions */
  events?: {
    /** Press event (for buttons) - emits an intent */
    onPress?: Intent;
  };
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
