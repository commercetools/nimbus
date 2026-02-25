#!/usr/bin/env node

/**
 * Nimbus MCP Server — stdio entry point.
 *
 * Connects the MCP server to stdin/stdout so it can be used with any MCP
 * client (e.g. Claude Desktop, Claude Code) via the stdio transport.
 *
 * Usage:
 *   node dist/index.js
 *   # or via package bin:
 *   nimbus-mcp
 */

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createServer } from "./server.js";

async function main(): Promise<void> {
  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error: unknown) => {
  console.error("Nimbus MCP server error:", error);
  process.exit(1);
});

export type { ComponentMeta, DesignToken, ToolResult } from "./types.js";
