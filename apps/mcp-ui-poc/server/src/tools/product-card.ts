import { createUIResource } from "@mcp-ui/server";
import { escapeForJS } from "./shared-types.js";

export interface ProductCardArgs {
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

  // Use improved escaping for template literal safety
  const escapedName = escapeForJS(productName);
  const escapedPrice = escapeForJS(price);
  const escapedDescription = escapeForJS(description);
  const escapedImageUrl = imageUrl ? escapeForJS(imageUrl) : undefined;

  const remoteDomScript = `
    // Create container for alert and card
    const container = document.createElement('nimbus-stack');
    container.setAttribute('direction', 'column');
    container.setAttribute('gap', '400');
    container.setAttribute('width', 'fit-content');


    // Create Nimbus card structure
    const card = document.createElement('nimbus-card-root');
    card.setAttribute('elevation', 'elevated');
    card.setAttribute('width', 'fit-content');
    card.setAttribute('max-width', '432px');
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
    cardContent.appendChild(image);
    `
        : ""
    }

    const heading = document.createElement('nimbus-heading');
    heading.setAttribute('size', 'lg');
    heading.setAttribute('margin-bottom', '200');
    heading.textContent = '${escapedName}';

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

    const button = document.createElement('nimbus-button');
    button.setAttribute('variant', 'solid');
    button.setAttribute('color-palette', 'primary');
    button.setAttribute('width', 'full');
    ${!inStock ? "button.setAttribute('is-disabled', 'true');" : ""}
    button.textContent = 'Add to Cart';
    console.log('Button color-palette set to:', button.getAttribute('color-palette'));

    // Create success alert structure (will be added to DOM when needed)
    let alertContainer = null;

    function createAlert() {
      const alert = document.createElement('nimbus-alert-root');
      alert.setAttribute('tone', 'positive');
      alert.setAttribute('variant', 'subtle');

      const alertTitle = document.createElement('nimbus-alert-title');
      alertTitle.textContent = 'Added to Cart';

      const alertDescription = document.createElement('nimbus-alert-description');
      alertDescription.textContent = 'Added ${escapedName} to your cart!';

      const alertDismiss = document.createElement('nimbus-alert-dismiss-button');

      alertDismiss.onclick = function() {
        if (alertContainer && alertContainer.parentNode) {
          container.removeChild(alertContainer);
          alertContainer = null;
        }
      };

      alert.appendChild(alertTitle);
      alert.appendChild(alertDescription);
      alert.appendChild(alertDismiss);

      return alert;
    }

    // Add click handler to button
    button.onclick = function() {
      // Only create and show alert if it doesn't exist
      if (!alertContainer) {
        alertContainer = createAlert();
        container.insertBefore(alertContainer, card);
      }

      // If postUIActionResult is available, use it
      if (typeof window.postUIActionResult === 'function') {
        window.postUIActionResult({
          type: 'notify',
          payload: { message: 'Item added to cart' }
        });
      }
    };

    // Build structure
    cardHeader.appendChild(heading);
    stack.appendChild(priceText);
    stack.appendChild(badge);
    stack.appendChild(descriptionText);
    stack.appendChild(button);
    cardContent.appendChild(stack);
    card.appendChild(cardHeader);
    card.appendChild(cardContent);

    // Only add card initially (no alert)
    container.appendChild(card);
    root.appendChild(container);
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
