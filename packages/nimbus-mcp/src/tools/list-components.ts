import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getRouteManifest } from "../data-loader.js";

/**
 * Registers the `list_components` tool on the given MCP server.
 *
 * Returns a list of all Nimbus component names and descriptions from the
 * route manifest. This is a lightweight discovery tool — use
 * `get_component_docs` to fetch full documentation for a specific component.
 */
export function registerListComponents(server: McpServer): void {
  server.registerTool(
    "list_components",
    {
      title: "List Components",
      description:
        "Returns the names and descriptions of all available Nimbus components.",
      inputSchema: {},
    },
    async () => {
      try {
        const manifest = await getRouteManifest();
        const components = manifest.routes
          .filter((route) => route.category === "components")
          .map((route) => `${route.title}: ${route.description}`)
          .join("\n");

        return {
          content: [
            {
              type: "text" as const,
              text: components || "No components found.",
            },
          ],
        };
      } catch {
        return {
          content: [
            {
              type: "text" as const,
              text: "Component data is not available in this environment.",
            },
          ],
          isError: true,
        };
      }
    }
  );
}
