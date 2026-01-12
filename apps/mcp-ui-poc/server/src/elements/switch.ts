/**
 * Switch Remote DOM Custom Element
 */

import { createRemoteElement } from "@remote-dom/core/elements";

/**
 * Nimbus Switch custom element for Remote DOM
 * Tracks selection state, validation, and style properties
 */
export const NimbusSwitch = createRemoteElement({
  properties: {
    styleProps: true, // Chakra UI style props as object
    size: true, // "sm" | "md" | "lg"
    colorPalette: true, // Color palette
    isSelected: true, // Controlled selection state
    defaultSelected: true, // Uncontrolled default selection
    isDisabled: true, // Disabled state
    isInvalid: true, // Validation state
    isReadOnly: true, // Read-only state
    isRequired: true, // Required state
    name: true, // Form name attribute
    value: true, // Form value
    id: true, // For event handling
    onChange: { event: true }, // Change event handler
  },
});

// Self-register on import
if (
  typeof customElements !== "undefined" &&
  !customElements.get("nimbus-switch")
) {
  customElements.define("nimbus-switch", NimbusSwitch);
}
