import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { RemoteDomElement } from "../types/remote-dom.js";
import { createRemoteDomResource } from "../utils/create-remote-dom-resource.js";
import { commonStyleSchema } from "../utils/common-schemas.js";

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

  // Create card root element
  const cardRoot = document.createElement(
    "nimbus-card-root"
  ) as RemoteDomElement;
  cardRoot.elevation = "elevated";
  cardRoot.styleProps = {
    maxWidth: imageUrl ? "432px" : undefined,
    width: imageUrl ? undefined : "fit-content",
  };

  // Create card header with product name
  const cardHeader = document.createElement(
    "nimbus-card-header"
  ) as RemoteDomElement;
  const heading = document.createElement("nimbus-heading") as RemoteDomElement;
  heading.size = "lg";
  heading.styleProps = { marginBottom: "200" };
  heading.textContent = productName;
  cardHeader.appendChild(heading);
  cardRoot.appendChild(cardHeader);

  // Create card content
  const cardContent = document.createElement(
    "nimbus-card-content"
  ) as RemoteDomElement;

  // Add image if provided
  if (imageUrl) {
    const image = document.createElement("nimbus-image") as RemoteDomElement;
    image.src = imageUrl;
    image.alt = productName;
    image.styleProps = {
      borderRadius: "200",
      marginBottom: "400",
    };
    cardContent.appendChild(image);
  }

  // Create content stack for price, badge, description, and button
  const contentStack = document.createElement(
    "nimbus-stack"
  ) as RemoteDomElement;
  contentStack.direction = "column";
  contentStack.styleProps = { gap: "200" };

  // Add price
  const priceText = document.createElement("nimbus-text") as RemoteDomElement;
  priceText.textContent = price;
  priceText.styleProps = {
    fontSize: "xl",
    fontWeight: "bold",
    color: "primary.11",
  };
  contentStack.appendChild(priceText);

  // Add stock badge
  const stockBadge = document.createElement("nimbus-badge") as RemoteDomElement;
  stockBadge.textContent = inStock ? "In Stock" : "Out of Stock";
  stockBadge.colorPalette = inStock ? "positive" : "critical";
  stockBadge.size = "2xs";
  stockBadge.styleProps = { width: "fit-content" };
  contentStack.appendChild(stockBadge);

  // Add description
  if (description) {
    const descText = document.createElement("nimbus-text") as RemoteDomElement;
    descText.textContent = description;
    contentStack.appendChild(descText);
  }

  // Add "Add to Cart" button
  const addButton = document.createElement("nimbus-button") as RemoteDomElement;
  addButton.textContent = "Add to Cart";
  addButton.variant = "solid";
  addButton.colorPalette = "primary";
  addButton.isDisabled = !inStock;
  addButton.type = "button";
  addButton.styleProps = { width: "full" };
  contentStack.appendChild(addButton);

  // Append content stack to card content
  cardContent.appendChild(contentStack);
  cardRoot.appendChild(cardContent);

  return createRemoteDomResource(cardRoot, {
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
        "Creates a product card UI component with name, price, description, image, and stock status using Nimbus design system components. Supports all Chakra UI style properties.",
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

        // All Chakra UI style properties
        ...commonStyleSchema,
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
