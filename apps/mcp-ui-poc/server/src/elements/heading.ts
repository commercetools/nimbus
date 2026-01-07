/**
 * Heading Remote DOM Custom Element
 */

import { createRemoteElement } from "@remote-dom/core/elements";

export const NimbusHeading = createRemoteElement({
  properties: {
    styleProps: true,
    size: true,
    as: true,
  },
});

// Self-register on import
if (
  typeof customElements !== "undefined" &&
  !customElements.get("nimbus-heading")
) {
  customElements.define("nimbus-heading", NimbusHeading);
}
