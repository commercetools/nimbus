import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  buildTextElement,
  textElementSchema,
  type TextElementArgs,
} from "../elements/text.js";
import { createRemoteDomResource } from "../utils/create-remote-dom-resource.js";

function createText(args: TextElementArgs) {
  const element = buildTextElement(args);
  return createRemoteDomResource(element, {
    name: "text",
    title: "Text",
    description: `Text: ${args.content}`,
  });
}

export function registerTextTool(server: McpServer) {
  server.registerTool(
    "createText",
    {
      title: "Create Text",
      description: "Creates a text UI component using Nimbus design system.",
      inputSchema: textElementSchema.omit({ type: true }),
    },
    async (args) => {
      const uiResource = createText(args);
      return {
        content: [uiResource],
      };
    }
  );
}
