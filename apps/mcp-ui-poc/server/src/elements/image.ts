/**
 * Image Remote DOM Custom Element
 */

import { createRemoteElement } from "@remote-dom/core/elements";

export const NimbusImage = createRemoteElement({
  properties: {
    styleProps: true,
    src: true,
    alt: true,
  },
});

// Self-register on import
if (
  typeof customElements !== "undefined" &&
  !customElements.get("nimbus-image")
) {
  customElements.define("nimbus-image", NimbusImage);
}
