import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerGetComponent } from "./tools/get-component.js";
import { registerGetTokens } from "./tools/get-tokens.js";
import { registerListComponents } from "./tools/list-components.js";
import { registerSearchDocs } from "./tools/search-docs.js";
import { registerSearchIcons } from "./tools/search-icons.js";
import { registerMigrateFromUiKit } from "./tools/migrate-from-uikit.js";

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
  registerGetComponent(server);
  registerGetTokens(server);
  registerListComponents(server);
  registerSearchDocs(server);
  registerSearchIcons(server);
  registerMigrateFromUiKit(server);

  return server;
}
