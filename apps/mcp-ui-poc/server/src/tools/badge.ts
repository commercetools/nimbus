import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  buildBadgeElement,
  badgeElementSchema,
  type BadgeElementArgs,
} from "../elements/badge.js";
import { createRemoteDomResource } from "../utils/create-remote-dom-resource.js";

function createBadge(args: BadgeElementArgs) {
  const element = buildBadgeElement(args);
  return createRemoteDomResource(element, {
    name: "badge",
    title: "Badge",
    description: `Badge: ${args.label}`,
  });
}

export function registerBadgeTool(server: McpServer) {
  server.registerTool(
    "createBadge",
    {
      title: "Create Badge",
      description: "Creates a badge UI component using Nimbus design system.",
      inputSchema: badgeElementSchema.omit({ type: true }),
    },
    async (args) => {
      const uiResource = createBadge(args);
      return {
        content: [uiResource],
      };
    }
  );
}
