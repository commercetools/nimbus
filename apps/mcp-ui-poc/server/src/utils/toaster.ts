/**
 * Global Toaster System
 * Shows temporary alert notifications using Nimbus Alert component
 */

import type { RemoteDomElement } from "../types/remote-dom.js";
import { getRemoteEnvironment } from "../remote-dom/environment.js";

// Special URI for the global toaster
const TOASTER_URI = "ui://global-toaster";

// Initialize toaster environment and container
export function initializeToaster() {
  const env = getRemoteEnvironment(TOASTER_URI);
  const root = env.getRoot() as Element;

  // Create container for toasts (fixed position at top-right)
  const container = document.createElement("nimbus-stack") as RemoteDomElement;
  container.setAttribute("id", "toast-container");
  container.direction = "column";
  container.styleProps = {
    position: "fixed",
    top: "16px",
    right: "16px",
    zIndex: 9999,
    gap: "300",
    maxWidth: "400px",
    pointerEvents: "none", // Allow clicks to pass through container
  };

  root.appendChild(container);
  env.flush();
}

/**
 * Get the toaster URI (for marking as active)
 */
export function getToasterUri(): string {
  return TOASTER_URI;
}

/**
 * Show a toast notification
 */
export function showToast(options: {
  type: "success" | "error" | "info" | "warning";
  title?: string;
  message: string;
  duration?: number;
}) {
  const {
    type,
    title,
    message,
    duration = 5000, // Default 5 seconds
  } = options;

  const env = getRemoteEnvironment(TOASTER_URI);
  const root = env.getRoot() as Element;
  const container = root.querySelector("#toast-container") as Element | null;

  if (!container) {
    console.error("❌ Toast container not found, initializing...");
    initializeToaster();
    return;
  }

  // Map type to Alert colorPalette
  const colorPaletteMap = {
    success: "positive",
    error: "critical",
    info: "info",
    warning: "warning",
  } as const;

  // Create unique ID for this toast
  const toastId = `toast-${Date.now()}-${Math.random().toString(36).substring(7)}`;

  // Create Alert.Root
  const alertRoot = document.createElement(
    "nimbus-alert-root"
  ) as RemoteDomElement;
  alertRoot.setAttribute("id", toastId);
  alertRoot.variant = "outlined";
  alertRoot.colorPalette = colorPaletteMap[type];
  alertRoot.styleProps = {
    pointerEvents: "auto", // Allow interaction with individual toasts
    boxShadow: "lg",
    zIndex: "9999",
  };

  // Add title if provided
  if (title) {
    const alertTitle = document.createElement(
      "nimbus-alert-title"
    ) as RemoteDomElement;
    alertTitle.textContent = title;
    alertRoot.appendChild(alertTitle);
  }

  // Add description
  const alertDescription = document.createElement(
    "nimbus-alert-description"
  ) as RemoteDomElement;
  alertDescription.textContent = message;
  alertRoot.appendChild(alertDescription);

  // Add dismiss button
  const dismissButton = document.createElement(
    "nimbus-alert-dismiss-button"
  ) as RemoteDomElement;
  alertRoot.appendChild(dismissButton);

  // Add to container
  container.appendChild(alertRoot);
  env.flush();

  // Auto-remove after duration
  setTimeout(() => {
    if (alertRoot.parentNode) {
      alertRoot.parentNode.removeChild(alertRoot);
      env.flush();
    }
  }, duration);
}
