/**
 * Remote DOM type definitions for MCP-UI server
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
