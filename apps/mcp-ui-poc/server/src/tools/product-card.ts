import { createUIResource } from "@mcp-ui/server";
import { escapeForJS } from "../utils/escape-for-js.js";
import { createIntentAction } from "../utils/create-intent-action.js";

export interface ProductCardArgs {
  productId: string;
  productName: string;
  price: string;
  description?: string;
  imageUrl?: string;
  inStock?: boolean;
}

export function createProductCard(args: ProductCardArgs) {
  const {
    productId,
    productName,
    price,
    description = "",
    imageUrl,
    inStock = true,
  } = args;

  // Use improved escaping for template literal safety
  const escapedName = escapeForJS(productName);
  const escapedPrice = escapeForJS(price);
  const escapedDescription = escapeForJS(description);
  const escapedImageUrl = imageUrl ? escapeForJS(imageUrl) : undefined;

  // Create intent action with description that Claude can interpret directly
  const viewDetailsIntent = createIntentAction({
    type: "view_details",
    description: `User wants to see detailed information about the product. Please provide comprehensive details including specifications, availability, pricing breakdown, and any related products.`,
    payload: {
      productId,
      productName,
      price,
      inStock,
    },
  });

  // Escape the JSON for embedding in JavaScript string
  const escapedIntent = escapeForJS(viewDetailsIntent);

  const remoteDomScript = `
    // Create container for alert and card
    const container = document.createElement('nimbus-stack');
    container.setAttribute('direction', 'column');
    container.setAttribute('gap', '400');
    container.setAttribute('width', 'fit-content');


    // Create Nimbus card structure
    const card = document.createElement('nimbus-card-root');
    card.setAttribute('elevation', 'elevated');
    ${imageUrl ? "" : "card.setAttribute('width', 'fit-content');"}
    ${imageUrl ? "card.setAttribute('max-width', '432px');" : ""}
    card.setAttribute('border-style', 'outlined');

    const cardHeader = document.createElement('nimbus-card-header');

    const cardContent = document.createElement('nimbus-card-content');

    ${
      imageUrl
        ? `
    const image = document.createElement('nimbus-image');
    image.setAttribute('src', '${escapedImageUrl}');
    image.setAttribute('alt', '${escapedName}');
    image.setAttribute('border-radius', '200');
    image.setAttribute('margin-bottom', '400');
    image.style.width = '100%';
    image.style.display = 'block';
    cardContent.appendChild(image);
    `
        : ""
    }

    const heading = document.createElement('nimbus-heading');
    heading.setAttribute('size', 'lg');
    heading.setAttribute('margin-bottom', '200');
    heading.textContent = '${escapedName}';
    heading.style.wordWrap = 'break-word';
    heading.style.overflowWrap = 'break-word';

    const stack = document.createElement('nimbus-stack');

    const priceText = document.createElement('nimbus-text');
    priceText.setAttribute('font-size', 'xl');
    priceText.setAttribute('font-weight', 'bold');
    priceText.setAttribute('color', 'primary.11');
    priceText.textContent = '${escapedPrice}';

    const badge = document.createElement('nimbus-badge');
    badge.setAttribute('color-palette', '${inStock ? "positive" : "critical"}');
    badge.setAttribute('size', '2xs');
    badge.setAttribute('width', 'fit-content');
    badge.textContent = '${inStock ? "In Stock" : "Out of Stock"}';
    console.log('Badge color-palette set to:', badge.getAttribute('color-palette'));
    console.log('Badge size set to:', badge.getAttribute('size'));

    const descriptionText = document.createElement('nimbus-text');
    descriptionText.textContent = '${escapedDescription}';
    descriptionText.style.wordWrap = 'break-word';
    descriptionText.style.overflowWrap = 'break-word';

    const button = document.createElement('nimbus-button');
    button.setAttribute('variant', 'outline');
    button.setAttribute('color-palette', 'primary');
    button.setAttribute('width', 'full');
    button.textContent = 'View Details';

    // Store the complete intent action as a single data attribute
    // The client will emit this directly without interpretation
    button.setAttribute('data-intent-action', '${escapedIntent}');

    // Build structure
    cardHeader.appendChild(heading);
    stack.appendChild(priceText);
    stack.appendChild(badge);
    stack.appendChild(descriptionText);
    stack.appendChild(button);
    cardContent.appendChild(stack);
    card.appendChild(cardHeader);
    card.appendChild(cardContent);

    container.appendChild(card);
    root.appendChild(container);
  `;

  return createUIResource({
    uri: `ui://product-card/${productId}-${Date.now()}`,
    content: {
      type: "remoteDom",
      script: remoteDomScript,
      framework: "react",
    },
    encoding: "text",
    metadata: {
      title: `Product Card: ${productName}`,
      description: `Product card for ${productName} with view details intent`,
      created: new Date().toISOString(),
    },
  });
}
