import { createUIResource } from "@mcp-ui/server";
import { buildBadgeElement, type BadgeElementArgs } from "../elements/badge.js";

export type CreateBadgeArgs = BadgeElementArgs;

export function createBadge(args: CreateBadgeArgs) {
  return createUIResource({
    uri: `ui://badge/${Date.now()}`,
    content: {
      type: "remoteDom",
      script: JSON.stringify({
        type: "structuredDom",
        element: buildBadgeElement(args),
        framework: "react",
      }),
      framework: "react",
    },
    encoding: "text",
    metadata: {
      title: "Badge",
      description: `Badge: ${args.label}`,
      created: new Date().toISOString(),
    },
  });
}
