// ============================================================
// TOAST CORE TYPES
// ============================================================

/**
 * Toast type determines visual styling and ARIA semantics.
 * - info: Informational messages (role="status", polite)
 * - success: Success confirmations (role="status", polite)
 * - warning: Warning messages (role="alert", assertive)
 * - error: Error messages (role="alert", assertive)
 */
export type ToastType = "info" | "success" | "warning" | "error" | "loading";

/**
 * Toast placement determines position on screen.
 * Maps to Chakra UI placement values and numpad positions for hotkeys.
 */
export type ToastPlacement =
  | "top-start"
  | "top"
  | "top-end"
  | "bottom-start"
  | "bottom"
  | "bottom-end";

/**
 * Action button configuration for toast.
 */
export interface ToastAction {
  /** Label text for the action button */
  label: string;
  /** Click handler for the action button */
  onClick: () => void;
}

/**
 * Toast visual variant.
 * - solid: Bold colored background with contrast text (default)
 * - subtle: Subtle background with border
 * - accent-start: Subtle background with a colored accent line on the inline-start edge
 */
export type ToastVariant = "solid" | "subtle" | "accent-start";

/**
 * Options for creating a toast notification.
 */
export interface ToastOptions {
  /** Toast type determines styling and ARIA role */
  type?: ToastType;
  /** Visual variant (default: "accent-start") */
  variant?: ToastVariant;
  /** Title text (required for most toasts) */
  title?: string;
  /** Description text (required for accessibility and context) */
  description: string;
  /** Optional action button */
  action?: ToastAction;
  /** Auto-dismiss duration in milliseconds (default: 6000, Infinity = never) */
  duration?: number;
  /** Placement on screen (default: "top-end") */
  placement?: ToastPlacement;
  /** Whether the close button is visible (default: false) */
  closable?: boolean;
  /** Pause auto-dismiss on hover/focus (default: true) */
  pauseOnInteraction?: boolean;
  /** Pause auto-dismiss when page is idle (default: true) */
  pauseOnPageIdle?: boolean;
  /** Custom metadata passed to render function */
  meta?: Record<string, unknown>;
}

/**
 * Promise toast configuration for loading/success/error states.
 */
export interface ToastPromiseOptions {
  /** Toast options for loading state */
  loading: ToastOptions;
  /** Toast options for success state */
  success: ToastOptions;
  /** Toast options for error state */
  error: ToastOptions;
}

// ============================================================
// TOAST MANAGER TYPES
// ============================================================

/**
 * Toast manager interface for imperative API.
 */
export interface IToastManager {
  /** Create a toast and return its ID */
  create: (options: ToastOptions) => string;
  /** Update an existing toast */
  update: (id: string, options: Partial<ToastOptions>) => void;
  /** Dismiss toast(s) with animation */
  dismiss: (id?: string) => void;
  /** Remove toast(s) immediately without animation */
  remove: (id?: string) => void;
  /** Create info toast */
  info: (options: Omit<ToastOptions, "type">) => string;
  /** Create success toast */
  success: (options: Omit<ToastOptions, "type">) => string;
  /** Create warning toast */
  warning: (options: Omit<ToastOptions, "type">) => string;
  /** Create error toast */
  error: (options: Omit<ToastOptions, "type">) => string;
  /** Create promise toast with loading/success/error states */
  promise: (
    promise: Promise<unknown>,
    options: ToastPromiseOptions,
    config?: Pick<ToastOptions, "placement">
  ) => void;
  /** Reset manager state (testing only) */
  reset: () => void;
}
