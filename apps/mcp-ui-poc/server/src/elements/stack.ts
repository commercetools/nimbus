/**
 * Stack Remote DOM Custom Element
 */

import { createRemoteElement } from "@remote-dom/core/elements";

export const NimbusStack = createRemoteElement({
  properties: {
    styleProps: true,
    direction: true,
    as: true,
    wrap: true,
    alignItems: true,
    justifyContent: true,
    // Form props (when used as <form>)
    action: true,
    method: true,
    enctype: true,
  },
});

// Self-register on import
if (
  typeof customElements !== "undefined" &&
  !customElements.get("nimbus-stack")
) {
  customElements.define("nimbus-stack", NimbusStack);
}
