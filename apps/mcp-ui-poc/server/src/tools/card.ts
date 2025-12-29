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
 * Register the createCard tool with the MCP server
 */
export function registerCardTool(server: McpServer) {
  server.registerTool(
    "createCard",
    {
      title: "Create Card",
      description:
        "Creates a card UI component using Nimbus design system. Can contain child elements for composition. Supports all Chakra UI style properties.",
      inputSchema: z.object({
        // Content and children
        content: z.string().optional().describe("Card content text"),
        children: childrenSchema,

        // Component-specific props
        elevation: z
          .enum(["flat", "elevated", "inset"])
          .optional()
          .describe("Card elevation style"),
        cardBorderStyle: z
          .enum(["none", "outlined", "elevated"])
          .optional()
          .describe(
            "Card border style (renamed to avoid conflict with CSS borderStyle)"
          ),
        cardPadding: z
          .string()
          .optional()
          .describe("Card padding (e.g., '400', '600')"),

        // All Chakra UI style properties
        ...commonStyleSchema,
      }),
    },
    async (args) => {
      // Create card root element directly using Remote DOM custom element
      const cardRoot = document.createElement(
        "nimbus-card-root"
      ) as RemoteDomElement;

      // Set component-specific props
      if (args.elevation) cardRoot.elevation = args.elevation;
      if (args.cardBorderStyle) cardRoot.borderStyle = args.cardBorderStyle;
      if (args.cardPadding) cardRoot.cardPadding = args.cardPadding;

      // Extract and set style props as object
      const styleProps = extractStyleProps(args);
      if (Object.keys(styleProps).length > 0) {
        cardRoot.styleProps = styleProps;
      }

      // Create card content wrapper
      const cardContent = document.createElement(
        "nimbus-card-content"
      ) as RemoteDomElement;

      // Handle children and content
      if (args.content) {
        const sanitizedContent = validateOptionalText(args.content);
        if (sanitizedContent) {
          cardContent.appendChild(document.createTextNode(sanitizedContent));
        }
      }
      if (args.children) {
        args.children.forEach((childDef: Record<string, unknown>) => {
          if (typeof childDef === "string") {
            const sanitizedText = sanitizeTextContent(childDef);
            if (sanitizedText) {
              cardContent.appendChild(document.createTextNode(sanitizedText));
            }
          } else {
            // Recursively create child elements using the definition directly
            const childElement = createElementFromDefinition(childDef);
            cardContent.appendChild(childElement);
          }
        });
      }

      // Append content to root
      cardRoot.appendChild(cardContent);

      // Return resource (createRemoteDomResource handles appending to root)
      return {
        content: [
          createRemoteDomResource(cardRoot, {
            name: "card",
            title: "Card",
            description: "A card component",
          }),
        ],
      };
    }
  );
}
