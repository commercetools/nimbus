/**
 * Button Remote DOM Custom Element
 */

import { createRemoteElement } from "@remote-dom/core/elements";

/**
 * Nimbus Button custom element for Remote DOM
 * Tracks variant, size, colorPalette, and style properties
 */
export const NimbusButton = createRemoteElement({
  properties: {
    styleProps: true, // Chakra UI style props as object
    variant: true,
    size: true,
    colorPalette: true,
    isDisabled: true,
    isLoading: true,
    type: true,
    id: true, // For event handling and action configuration
    onPress: { event: true },
  },
});

// Self-register on import
if (
  typeof customElements !== "undefined" &&
  !customElements.get("nimbus-button")
) {
  customElements.define("nimbus-button", NimbusButton);
}
