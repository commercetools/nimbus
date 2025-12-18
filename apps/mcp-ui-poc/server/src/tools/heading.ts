import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  buildHeadingElement,
  headingElementSchema,
  type HeadingElementArgs,
} from "../elements/heading.js";
import { createRemoteDomResource } from "../utils/create-remote-dom-resource.js";

function createHeading(args: HeadingElementArgs) {
  const element = buildHeadingElement(args);
  return createRemoteDomResource(element, {
    name: "heading",
    title: "Heading",
    description: `Heading: ${args.content}`,
  });
}

export function registerHeadingTool(server: McpServer) {
  server.registerTool(
    "createHeading",
    {
      title: "Create Heading",
      description: "Creates a heading UI component using Nimbus design system.",
      inputSchema: headingElementSchema.omit({ type: true }),
    },
    async (args) => {
      const uiResource = createHeading(args);
      return {
        content: [uiResource],
      };
    }
  );
}
