import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { RemoteDomElement } from "../types/remote-dom.js";
import { createRemoteDomResource } from "../utils/create-remote-dom-resource.js";
import {
  commonStyleSchema,
  extractStyleProps,
  childrenSchema,
} from "../utils/common-schemas.js";
import { createElementFromDefinition } from "../utils/create-element-from-definition.js";
import {
  validateOptionalText,
  sanitizeTextContent,
} from "../utils/security.js";

/**
 * Register the createStack tool with the MCP server
 */
export function registerStackTool(server: McpServer) {
  server.registerTool(
    "createStack",
    {
      title: "Create Stack",
      description:
        "Creates a stack layout container UI component using Nimbus design system. Can contain child elements for composition. Can be rendered as an HTML <form> element for native form submission. Supports all Chakra UI style properties.\n\nIMPORTANT: Read the nimbus://component-tags resource for valid child element tag names before creating nested elements.",
      inputSchema: z.object({
        // Content and children
        content: z.string().optional().describe("Stack content text"),
        children: childrenSchema,

        // Component-specific props
        direction: z
          .enum(["row", "column", "row-reverse", "column-reverse"])
          .optional()
          .describe("Stack direction"),
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

        // Form rendering
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
      // Create stack element directly using Remote DOM custom element
      const stack = document.createElement("nimbus-stack") as RemoteDomElement;

      // Set component-specific props
      if (args.direction) stack.direction = args.direction;
      if (args.wrap) stack.wrap = args.wrap;
      if (args.alignItems) stack.alignItems = args.alignItems;
      if (args.justifyContent) stack.justifyContent = args.justifyContent;
      if (args.as) stack.as = args.as;
      if (args.action) stack.action = args.action;
      if (args.method) stack.method = args.method;
      if (args.enctype) stack.enctype = args.enctype;

      // Extract and set style props as object
      const styleProps = extractStyleProps(args);
      if (Object.keys(styleProps).length > 0) {
        stack.styleProps = styleProps;
      }

      // Handle children and content
      if (args.content) {
        const sanitizedContent = validateOptionalText(args.content);
        if (sanitizedContent) {
          stack.appendChild(document.createTextNode(sanitizedContent));
        }
      }
      if (args.children) {
        args.children.forEach((childDef: Record<string, unknown>) => {
          if (typeof childDef === "string") {
            const sanitizedText = sanitizeTextContent(childDef);
            if (sanitizedText) {
              stack.appendChild(document.createTextNode(sanitizedText));
            }
          } else {
            // Recursively create child elements using the definition directly
            const childElement = createElementFromDefinition(childDef);
            stack.appendChild(childElement);
          }
        });
      }

      // Return resource (createRemoteDomResource handles appending to root)
      return {
        content: [
          createRemoteDomResource(stack, {
            name: "stack",
            title: "Stack",
            description: "A stack layout component",
          }),
        ],
      };
    }
  );
}
