/**
 * Type definitions for MCP-UI client
 */

export interface UIResourceContent {
  uri: string;
  text: string;
  mimeType: string;
  _meta?: {
    title?: string;
    description?: string;
    created?: string;
    [key: string]: unknown;
  };
}

export interface UIResource {
  type: "resource";
  resource: UIResourceContent;
}

export interface Message {
  role: "user" | "assistant";
  content?: string;
  uiResources?: UIResource[];
}
