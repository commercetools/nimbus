import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { RemoteDomElement } from "../types/remote-dom.js";
import { createRemoteDomResource } from "../utils/create-remote-dom-resource.js";
import {
  commonStyleSchema,
  extractStyleProps,
} from "../utils/common-schemas.js";

/**
 * Register the createBadge tool with the MCP server
 */
export function registerBadgeTool(server: McpServer) {
  server.registerTool(
    "createBadge",
    {
      title: "Create Badge",
      description:
        "Creates a badge UI component using Nimbus design system. Supports all Chakra UI style properties.",
      inputSchema: z.object({
        // Content
        label: z.string().describe("Badge label text"),

        // Component-specific props
        variant: z
          .enum(["solid", "subtle", "outline"])
          .optional()
          .describe("Badge variant"),
        colorPalette: z
          .string()
          .optional()
          .describe("Color palette (e.g., 'primary', 'critical')"),
        size: z
          .enum(["2xs", "xs", "sm", "md", "lg"])
          .optional()
          .describe("Badge size"),

        // All Chakra UI style properties
        ...commonStyleSchema,
      }),
    },
    async (args) => {
      // Create badge element directly using Remote DOM custom element
      const badge = document.createElement("nimbus-badge") as RemoteDomElement;

      // Set component-specific props
      if (args.variant) badge.variant = args.variant;
      if (args.colorPalette) badge.colorPalette = args.colorPalette;
      if (args.size) badge.size = args.size;

      // Extract and set style props as object
      const styleProps = extractStyleProps(args);
      if (Object.keys(styleProps).length > 0) {
        badge.styleProps = styleProps;
      }

      // Set text content
      badge.textContent = args.label;

      // Return resource (createRemoteDomResource handles appending to root)
      return {
        content: [
          createRemoteDomResource(badge, {
            name: "badge",
            title: "Badge",
            description: `Badge: ${args.label}`,
          }),
        ],
      };
    }
  );
}
