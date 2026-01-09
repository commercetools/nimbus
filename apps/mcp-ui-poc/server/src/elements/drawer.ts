/**
 * Nimbus Drawer Remote DOM Custom Elements
 */

import { createRemoteElement } from "@remote-dom/core/elements";

export const NimbusDrawerRoot = createRemoteElement({
  properties: {
    styleProps: true,
    isOpen: true, // Controlled open state (matches Nimbus prop name)
    defaultOpen: true,
    isDismissable: true, // Allow closing via backdrop/Escape
    isKeyboardDismissDisabled: true,
    onOpenChange: { event: true }, // Event handler for open state changes
    "data-uri": true, // URI for event routing (used for data table detail drawers)
  },
});

export const NimbusDrawerTrigger = createRemoteElement({
  properties: {
    styleProps: true,
  },
});

export const NimbusDrawerContent = createRemoteElement({
  properties: {
    styleProps: true,
    size: true, // sm, md, lg, xl, full
    placement: true, // start, end, top, bottom
  },
});

export const NimbusDrawerHeader = createRemoteElement({
  properties: {
    styleProps: true,
  },
});

export const NimbusDrawerTitle = createRemoteElement({
  properties: {
    styleProps: true,
  },
});

export const NimbusDrawerBody = createRemoteElement({
  properties: {
    styleProps: true,
  },
});

export const NimbusDrawerFooter = createRemoteElement({
  properties: {
    styleProps: true,
  },
});

export const NimbusDrawerCloseTrigger = createRemoteElement({
  properties: {
    styleProps: true,
    "aria-label": true,
    "data-uri": true, // URI for event routing (used for data table detail drawer close)
  },
});

// Self-register on import
if (typeof customElements !== "undefined") {
  if (!customElements.get("nimbus-drawer-root")) {
    customElements.define("nimbus-drawer-root", NimbusDrawerRoot);
  }
  if (!customElements.get("nimbus-drawer-trigger")) {
    customElements.define("nimbus-drawer-trigger", NimbusDrawerTrigger);
  }
  if (!customElements.get("nimbus-drawer-content")) {
    customElements.define("nimbus-drawer-content", NimbusDrawerContent);
  }
  if (!customElements.get("nimbus-drawer-header")) {
    customElements.define("nimbus-drawer-header", NimbusDrawerHeader);
  }
  if (!customElements.get("nimbus-drawer-title")) {
    customElements.define("nimbus-drawer-title", NimbusDrawerTitle);
  }
  if (!customElements.get("nimbus-drawer-body")) {
    customElements.define("nimbus-drawer-body", NimbusDrawerBody);
  }
  if (!customElements.get("nimbus-drawer-footer")) {
    customElements.define("nimbus-drawer-footer", NimbusDrawerFooter);
  }
  if (!customElements.get("nimbus-drawer-close-trigger")) {
    customElements.define(
      "nimbus-drawer-close-trigger",
      NimbusDrawerCloseTrigger
    );
  }
}
