import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerListComponents } from "./tools/list-components.js";

/**
 * Creates and configures the Nimbus MCP server.
 *
 * Each tool lives in `src/tools/` and exports a `register*` function that
 * receives the server instance and calls `server.registerTool(...)`. This
 * file collects all registrations in one place.
 */
export function createServer(): McpServer {
  const server = new McpServer(
    {
      name: "nimbus-mcp",
      version: "0.1.0",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // Register all tools
  registerListComponents(server);

  return server;
}
