/**
 * Card Remote DOM Custom Elements
 */

import { createRemoteElement } from "@remote-dom/core/elements";

export const NimbusCardRoot = createRemoteElement({
  properties: {
    styleProps: true,
    elevation: true,
    borderStyle: true,
    cardPadding: true,
  },
});

export const NimbusCardHeader = createRemoteElement({
  properties: {
    styleProps: true,
  },
});

export const NimbusCardContent = createRemoteElement({
  properties: {
    styleProps: true,
  },
});

// Self-register on import
if (typeof customElements !== "undefined") {
  if (!customElements.get("nimbus-card-root")) {
    customElements.define("nimbus-card-root", NimbusCardRoot);
  }
  if (!customElements.get("nimbus-card-header")) {
    customElements.define("nimbus-card-header", NimbusCardHeader);
  }
  if (!customElements.get("nimbus-card-content")) {
    customElements.define("nimbus-card-content", NimbusCardContent);
  }
}
