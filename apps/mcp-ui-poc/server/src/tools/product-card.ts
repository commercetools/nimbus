import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { ElementDefinition } from "../types/remote-dom.js";
import {
  buildStackElement,
  buildHeadingElement,
  buildTextElement,
  buildBadgeElement,
  buildButtonElement,
  buildImageElement,
  buildCardElement,
  buildCardHeaderElement,
  buildCardContentElement,
} from "../elements/index.js";
import { createRemoteDomResource } from "../utils/create-remote-dom-resource.js";

export interface ProductCardArgs {
  productId?: string;
  productName: string;
  price: string;
  description?: string;
  imageUrl?: string;
  inStock?: boolean;
}

export function createProductCard(args: ProductCardArgs) {
  const {
    productName,
    price,
    description = "",
    imageUrl,
    inStock = true,
  } = args;

  // ✅ Build structured product card using element builders
  const cardChildren: ElementDefinition[] = [];

  // Add image if provided
  if (imageUrl) {
    cardChildren.push(
      buildImageElement({
        src: imageUrl,
        alt: productName,
        borderRadius: "200",
        marginBottom: "400",
      })
    );
  }

  // Add product heading
  cardChildren.push(
    buildHeadingElement({
      content: productName,
      size: "lg",
      marginBottom: "200",
    })
  );

  // Build content stack: price, stock badge, description, button
  const contentStack = buildStackElement({
    direction: "column",
    gap: "200",
    children: [
      buildTextElement({
        content: price,
        fontSize: "xl",
        fontWeight: "bold",
        color: "primary.11",
      }),
      buildBadgeElement({
        label: inStock ? "In Stock" : "Out of Stock",
        colorPalette: inStock ? "positive" : "critical",
        size: "2xs",
        width: "fit-content",
      }),
      buildTextElement({
        content: description,
      }),
      buildButtonElement({
        label: "Add to Cart",
        variant: "solid",
        colorPalette: "primary",
        width: "full",
        isDisabled: !inStock,
        type: "button",
      }),
    ],
  });

  cardChildren.push(contentStack);

  // Build card with nested structure (header + content)
  const contentChildren: ElementDefinition[] = [];
  if (imageUrl) contentChildren.push(cardChildren[0]); // image
  contentChildren.push(cardChildren[2]); // content stack

  const card = buildCardElement({
    elevation: "elevated",
    borderStyle: "outlined",
    maxWidth: imageUrl ? "432px" : undefined,
    width: imageUrl ? undefined : "fit-content",
    children: [
      buildCardHeaderElement({
        children: [cardChildren[1]], // heading
      }),
      buildCardContentElement({
        children: contentChildren,
      }),
    ],
  });

  // Note: Now using Remote DOM Phase 2 with full type preservation

  return createRemoteDomResource(card, {
    name: "product-card",
    title: "Product Card",
    description: `Card for ${productName}`,
  });
}

export function registerProductCardTool(server: McpServer) {
  server.registerTool(
    "createProductCard",
    {
      title: "Create Product Card",
      description:
        "Creates a product card UI component with name, price, description, image, and stock status using Nimbus design system components.",
      inputSchema: z.object({
        productId: z
          .string()
          .optional()
          .describe(
            "Optional unique product ID (auto-generated if not provided)"
          ),
        productName: z.string().describe("The name of the product"),
        price: z.string().describe("The price of the product (e.g., '$999')"),
        description: z
          .string()
          .optional()
          .describe("Optional product description"),
        imageUrl: z
          .string()
          .optional()
          .describe("Optional URL to product image"),
        inStock: z
          .boolean()
          .optional()
          .describe("Whether the product is in stock (default: true)"),
      }),
    },
    async (args) => {
      const uiResource = createProductCard(args);
      return {
        content: [uiResource],
      };
    }
  );
}
