import { createUIResource } from "@mcp-ui/server";
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

export interface ProductCardArgs {
  productId?: string;
  productName: string;
  price: string;
  description?: string;
  imageUrl?: string;
  inStock?: boolean;
  buttonLabel: string;
  buttonIntent: {
    type: string;
    description: string;
    payload: Record<string, unknown>;
  };
}

export function createProductCard(args: ProductCardArgs) {
  const {
    productName,
    price,
    description = "",
    imageUrl,
    inStock = true,
    buttonLabel,
    buttonIntent,
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
        label: buttonLabel,
        variant: "outline",
        colorPalette: "primary",
        width: "full",
        type: "button",
        intent: buttonIntent,
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

  // Note: Dynamic alert behavior removed in Phase 1 (no state management)
  // This could be re-added in Phase 2 with full Remote DOM support

  return createUIResource({
    uri: `ui://product-card/${Date.now()}`,
    content: {
      type: "remoteDom",
      script: JSON.stringify({
        type: "structuredDom",
        element: card,
        framework: "react",
      }),
      framework: "react",
    },
    encoding: "text",
    metadata: {
      title: "Product Card",
      description: `Product card for ${productName}`,
      created: new Date().toISOString(),
    },
  });
}
