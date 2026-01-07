/**
 * Flex Remote DOM Custom Element
 */

import { createRemoteElement } from "@remote-dom/core/elements";

export const NimbusFlex = createRemoteElement({
  properties: {
    styleProps: true,
    direction: true,
    wrap: true,
    alignItems: true,
    justifyContent: true,
  },
});

// Self-register on import
if (
  typeof customElements !== "undefined" &&
  !customElements.get("nimbus-flex")
) {
  customElements.define("nimbus-flex", NimbusFlex);
}
