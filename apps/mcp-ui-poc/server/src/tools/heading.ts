import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { RemoteDomElement } from "../types/remote-dom.js";
import { createRemoteDomResource } from "../utils/create-remote-dom-resource.js";
import {
  commonStyleSchema,
  extractStyleProps,
} from "../utils/common-schemas.js";
import { validateRequiredText } from "../utils/security.js";

/**
 * Register the createHeading tool with the MCP server
 */
export function registerHeadingTool(server: McpServer) {
  server.registerTool(
    "createHeading",
    {
      title: "Create Heading",
      description:
        "Creates a heading UI component using Nimbus design system. Supports all Chakra UI style properties.",
      inputSchema: z.object({
        // Content
        content: z.string().describe("Heading text"),

        // Component-specific props
        size: z
          .enum(["xs", "sm", "md", "lg", "xl", "2xl"])
          .optional()
          .describe("Heading size"),
        as: z
          .enum(["h1", "h2", "h3", "h4", "h5", "h6"])
          .optional()
          .describe("HTML heading level"),

        // All Chakra UI style properties
        ...commonStyleSchema,
      }),
    },
    async (args) => {
      // Validate and sanitize text content
      const sanitizedContent = validateRequiredText(args.content, "content");

      // Create heading element directly using Remote DOM custom element
      const heading = document.createElement(
        "nimbus-heading"
      ) as RemoteDomElement;

      // Set component-specific props
      if (args.size) heading.size = args.size;
      if (args.as) heading.as = args.as;

      // Extract and set style props as object
      const styleProps = extractStyleProps(args);
      if (Object.keys(styleProps).length > 0) {
        heading.styleProps = styleProps;
      }

      // Set text content with sanitized value
      heading.textContent = sanitizedContent;

      // Return resource (createRemoteDomResource handles appending to root)
      return {
        content: [
          createRemoteDomResource(heading, {
            name: "heading",
            title: "Heading",
            description: `Heading: ${args.content}`,
          }),
        ],
      };
    }
  );
}
