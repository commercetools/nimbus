/**
 * Text Remote DOM Custom Element
 */

import { createRemoteElement } from "@remote-dom/core/elements";

export const NimbusText = createRemoteElement({
  properties: {
    styleProps: true,
    as: true,
  },
});

// Self-register on import
if (
  typeof customElements !== "undefined" &&
  !customElements.get("nimbus-text")
) {
  customElements.define("nimbus-text", NimbusText);
}
