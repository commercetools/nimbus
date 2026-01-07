/**
 * MCP Resources for Nimbus Design System
 * Provides comprehensive documentation accessible via MCP resource protocol
 *
 * Current URI scheme: nimbus://{resource-name}
 * Future optimization: Could use hierarchical URIs for better organization
 *   - nimbus://tokens/design (design tokens)
 *   - nimbus://tokens/semantic (semantic tokens)
 *   - nimbus://docs/style-system (style system guide)
 *   - nimbus://docs/components (component patterns)
 *   - nimbus://docs/accessibility (a11y guidelines)
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerComponentTagsResource } from "./component-tags.js";
import { registerDesignTokensResource } from "./design-tokens.js";
import { registerStyleSystemResource } from "./style-system.js";

export function registerResources(server: McpServer) {
  registerComponentTagsResource(server);
  registerDesignTokensResource(server);
  registerStyleSystemResource(server);
}
