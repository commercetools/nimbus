/**
 * Nimbus Alert Remote DOM Elements
 * Defines custom elements for Alert compound component using createRemoteElement
 */

import { createRemoteElement } from "@remote-dom/core/elements";

/**
 * Alert.Root custom element
 */
export const NimbusAlertRoot = createRemoteElement({
  properties: {
    variant: true,
    colorPalette: true,
    styleProps: true,
  },
});

/**
 * Alert.Title custom element
 */
export const NimbusAlertTitle = createRemoteElement({
  properties: {
    styleProps: true,
  },
});

/**
 * Alert.Description custom element
 */
export const NimbusAlertDescription = createRemoteElement({
  properties: {
    styleProps: true,
  },
});

/**
 * Alert.DismissButton custom element
 */
export const NimbusAlertDismissButton = createRemoteElement({
  properties: {
    styleProps: true,
    onPress: { event: true },
  },
});

// Register all Alert custom elements
if (
  typeof customElements !== "undefined" &&
  !customElements.get("nimbus-alert-root")
) {
  customElements.define("nimbus-alert-root", NimbusAlertRoot);
  customElements.define("nimbus-alert-title", NimbusAlertTitle);
  customElements.define("nimbus-alert-description", NimbusAlertDescription);
  customElements.define(
    "nimbus-alert-dismiss-button",
    NimbusAlertDismissButton
  );
}
