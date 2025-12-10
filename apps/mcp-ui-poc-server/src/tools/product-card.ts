import { createUIResource } from "@mcp-ui/server";

export interface ProductCardArgs {
  productName: string;
  price: string;
  imageUrl?: string;
  inStock?: boolean;
}

export function createProductCard(args: ProductCardArgs) {
  const { productName, price, imageUrl, inStock = true } = args;

  // Escape strings for JavaScript
  const escapedName = productName.replace(/'/g, "\\'");
  const escapedPrice = price.replace(/'/g, "\\'");
  const escapedImageUrl = imageUrl?.replace(/'/g, "\\'");

  const remoteDomScript = `
    // Create Nimbus card structure
    const card = document.createElement('nimbus-card');
    card.setAttribute('variant', 'elevated');
    card.setAttribute('max-width', '400px');

    const cardBody = document.createElement('nimbus-card-body');

    ${
      imageUrl
        ? `
    const image = document.createElement('nimbus-image');
    image.setAttribute('src', '${escapedImageUrl}');
    image.setAttribute('alt', '${escapedName}');
    image.setAttribute('border-radius', '200');
    image.setAttribute('margin-bottom', '400');
    cardBody.appendChild(image);
    `
        : ""
    }

    const heading = document.createElement('nimbus-heading');
    heading.setAttribute('size', 'lg');
    heading.setAttribute('margin-bottom', '200');
    heading.textContent = '${escapedName}';

    const priceText = document.createElement('nimbus-text');
    priceText.setAttribute('font-size', 'xl');
    priceText.setAttribute('font-weight', 'bold');
    priceText.setAttribute('color', 'primary.11');
    priceText.setAttribute('margin-bottom', '300');
    priceText.textContent = '${escapedPrice}';

    const badge = document.createElement('nimbus-badge');
    badge.setAttribute('color-palette', '${inStock ? "positive" : "critical"}');
    badge.setAttribute('margin-bottom', '400');
    badge.textContent = '${inStock ? "In Stock" : "Out of Stock"}';

    const button = document.createElement('nimbus-button');
    button.setAttribute('variant', 'solid');
    button.setAttribute('color-palette', 'primary');
    button.setAttribute('width', 'full');
    ${!inStock ? "button.setAttribute('is-disabled', 'true');" : ""}
    button.textContent = 'Add to Cart';

    // Build structure
    cardBody.appendChild(heading);
    cardBody.appendChild(priceText);
    cardBody.appendChild(badge);
    cardBody.appendChild(button);
    card.appendChild(cardBody);
    root.appendChild(card);
  `;

  return createUIResource({
    uri: `ui://product-card/${Date.now()}`,
    content: {
      type: "remoteDom",
      script: remoteDomScript,
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
