import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { RemoteDomElement } from "../types/remote-dom.js";
import { createRemoteDomResource } from "../utils/create-remote-dom-resource.js";
import {
  commonStyleSchema,
  extractStyleProps,
} from "../utils/common-schemas.js";

/**
 * Register the createText tool with the MCP server
 */
export function registerTextTool(server: McpServer) {
  server.registerTool(
    "createText",
    {
      title: "Create Text",
      description:
        "Creates a text UI component using Nimbus design system. Supports all Chakra UI style properties.",
      inputSchema: z.object({
        // Content
        content: z.string().describe("Text content"),

        // Component-specific props
        as: z
          .enum(["p", "span", "div", "label"])
          .optional()
          .describe("HTML element to render as"),

        // All Chakra UI style properties
        ...commonStyleSchema,
      }),
    },
    async (args) => {
      // Create text element directly using Remote DOM custom element
      const text = document.createElement("nimbus-text") as RemoteDomElement;

      // Set component-specific props
      if (args.as) text.as = args.as;

      // Extract and set style props as object
      const styleProps = extractStyleProps(args);
      if (Object.keys(styleProps).length > 0) {
        text.styleProps = styleProps;
      }

      // Set text content
      text.textContent = args.content;

      // Return resource (createRemoteDomResource handles appending to root)
      return {
        content: [
          createRemoteDomResource(text, {
            name: "text",
            title: "Text",
            description: `Text: ${args.content}`,
          }),
        ],
      };
    }
  );
}
