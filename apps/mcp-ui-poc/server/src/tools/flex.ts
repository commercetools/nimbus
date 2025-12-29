import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { RemoteDomElement } from "../types/remote-dom.js";
import { createRemoteDomResource } from "../utils/create-remote-dom-resource.js";
import {
  commonStyleSchema,
  extractStyleProps,
} from "../utils/common-schemas.js";
import { createElementFromDefinition } from "../utils/create-element-from-definition.js";

/**
 * Register the createFlex tool with the MCP server
 */
export function registerFlexTool(server: McpServer) {
  server.registerTool(
    "createFlex",
    {
      title: "Create Flex",
      description:
        "Creates a flex layout container UI component using Nimbus design system. Can contain child elements for composition. Can be rendered as an HTML <form> element for native form submission. Supports all Chakra UI style properties.",
      inputSchema: z.object({
        // Content and children
        content: z.string().optional().describe("Flex content text"),
        children: z
          .array(z.record(z.string(), z.any()))
          .optional()
          .describe(
            "Child elements to render inside flex (element definition objects)"
          ),

        // Component-specific props
        direction: z
          .enum(["row", "column", "row-reverse", "column-reverse"])
          .optional()
          .describe("Flex direction"),
        wrap: z
          .enum(["wrap", "nowrap"])
          .optional()
          .describe("Flex wrap behavior"),
        alignItems: z
          .string()
          .optional()
          .describe("Align items (e.g., 'center', 'flex-start')"),
        justifyContent: z
          .string()
          .optional()
          .describe("Justify content (e.g., 'center', 'space-between')"),

        // Form rendering (if as='form')
        as: z
          .enum(["div", "form"])
          .optional()
          .describe("HTML element to render as"),
        action: z
          .string()
          .optional()
          .describe("Form action URL (when as='form')"),
        method: z
          .enum(["get", "post"])
          .optional()
          .describe("Form HTTP method (when as='form')"),
        enctype: z
          .enum([
            "application/x-www-form-urlencoded",
            "multipart/form-data",
            "text/plain",
          ])
          .optional()
          .describe("Form encoding type (when as='form')"),

        // All Chakra UI style properties
        ...commonStyleSchema,
      }),
    },
    async (args) => {
      // Create flex element directly using Remote DOM custom element
      const flex = document.createElement("nimbus-flex") as RemoteDomElement;

      // Set component-specific props
      if (args.direction) flex.direction = args.direction;
      if (args.wrap) flex.wrap = args.wrap;
      if (args.alignItems) flex.alignItems = args.alignItems;
      if (args.justifyContent) flex.justifyContent = args.justifyContent;
      if (args.as) flex.as = args.as;
      if (args.action) flex.action = args.action;
      if (args.method) flex.method = args.method;
      if (args.enctype) flex.enctype = args.enctype;

      // Extract and set style props as object
      const styleProps = extractStyleProps(args);
      if (Object.keys(styleProps).length > 0) {
        flex.styleProps = styleProps;
      }

      // Handle children and content
      if (args.content) {
        flex.appendChild(document.createTextNode(args.content));
      }
      if (args.children) {
        args.children.forEach((childDef: Record<string, unknown>) => {
          if (typeof childDef === "string") {
            flex.appendChild(document.createTextNode(childDef));
          } else {
            // Recursively create child elements using the definition directly
            const childElement = createElementFromDefinition(childDef);
            flex.appendChild(childElement);
          }
        });
      }

      // Return resource (createRemoteDomResource handles appending to root)
      return {
        content: [
          createRemoteDomResource(flex, {
            name: "flex",
            title: "Flex",
            description: "A flex layout component",
          }),
        ],
      };
    }
  );
}
