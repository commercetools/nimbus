/**
 * Badge Remote DOM Custom Element
 */

import { createRemoteElement } from "@remote-dom/core/elements";

export const NimbusBadge = createRemoteElement({
  properties: {
    styleProps: true,
    variant: true,
    size: true,
    colorPalette: true,
  },
});

// Self-register on import
if (
  typeof customElements !== "undefined" &&
  !customElements.get("nimbus-badge")
) {
  customElements.define("nimbus-badge", NimbusBadge);
}
