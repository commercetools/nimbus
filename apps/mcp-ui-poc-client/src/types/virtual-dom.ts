/**
 * Type definitions for MCP-UI client
 */

export interface UIResource {
  uri: string;
  content: {
    type: "remoteDom";
    script: string;
    framework: "react";
  };
  encoding: "text";
  metadata?: {
    title?: string;
    description?: string;
    created?: string;
    [key: string]: unknown;
  };
}

export interface Message {
  role: "user" | "assistant";
  content?: string;
  uiResources?: UIResource[];
}
