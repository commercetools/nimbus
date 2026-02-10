import type { HTMLChakraProps } from "@chakra-ui/react";
import type { TextProps } from "../text/text";
import type { ButtonProps } from "../button/button.types";
import type { SemanticPalettesOnly } from "../../type-utils/shared-types";
import type { OmitInternalProps } from "../../type-utils/omit-props";

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
export type ToastType = "info" | "success" | "warning" | "error";

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
 * Options for creating a toast notification.
 */
export interface ToastOptions {
  /** Toast type determines styling and ARIA role */
  type?: ToastType;
  /** Title text (required for most toasts) */
  title?: string;
  /** Description text */
  description?: string;
  /** Optional action button */
  action?: ToastAction;
  /** Auto-dismiss duration in milliseconds (default: 6000, 0 = never) */
  duration?: number;
  /** Placement on screen (default: "top-end") */
  placement?: ToastPlacement;
  /** Whether the close button is visible (default: true) */
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
// RECIPE PROPS
// ============================================================

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type ToastRecipeProps = {};

// ============================================================
// SLOT PROPS
// ============================================================

export type ToastRootSlotProps = HTMLChakraProps<"div", ToastRecipeProps> & {
  /** Color palette variant of the toast */
  colorPalette?: Exclude<SemanticPalettesOnly, "neutral" | "primary">;
  /** Override ARIA role (set by Toast.Root based on type) */
  role?: "status" | "alert";
  /** Override ARIA live region politeness */
  "aria-live"?: "polite" | "assertive";
};

export type ToastIconSlotProps = HTMLChakraProps<"div">;

export type ToastActionTriggerSlotProps = HTMLChakraProps<"div">;

export type ToastCloseTriggerSlotProps = HTMLChakraProps<"div">;

// ============================================================
// MAIN PROPS
// ============================================================

/**
 * Props for the Toast.Root component.
 */
export type ToastRootProps = OmitInternalProps<ToastRootSlotProps> & {
  [key: `data-${string}`]: unknown;
  ref?: React.Ref<HTMLDivElement>;
  /** Toast type for ARIA role determination */
  type?: ToastType;
};

/**
 * Type signature for the Toast.Root component.
 */
export type ToastRootComponent = React.FC<ToastRootProps>;

/**
 * Props for the Toast.Icon component.
 */
export type ToastIconProps = ToastIconSlotProps & {
  /** Toast type to determine which icon to render */
  type?: ToastType;
};

/**
 * Props for the Toast.Title component.
 */
export type ToastTitleProps = Omit<TextProps, "ref"> & {
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * Props for the Toast.Description component.
 */
export type ToastDescriptionProps = Omit<TextProps, "ref"> & {
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * Props for the Toast.ActionTrigger component.
 */
export type ToastActionTriggerProps = OmitInternalProps<ButtonProps>;

/**
 * Props for the Toast.CloseTrigger component.
 */
export type ToastCloseTriggerProps = OmitInternalProps<ButtonProps>;

// ============================================================
// TOAST MANAGER TYPES
// ============================================================

/**
 * Toaster store instance with placement and operations.
 */
export interface ToasterStore {
  /** Placement of this toaster */
  placement: ToastPlacement;
  /** Chakra UI toaster instance */
  toaster: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

/**
 * Subscriber callback for new toaster creation.
 */
export type ToasterSubscriber = (store: ToasterStore) => void;

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
  /** Subscribe to new toaster creation */
  subscribe: (subscriber: ToasterSubscriber) => () => void;
  /** Get all active toasters */
  getToasters: () => ToasterStore[];
  /** Get hotkey for placement */
  getHotkeyForPlacement: (placement: ToastPlacement) => string;
  /** Get active hotkeys */
  getActiveHotkeys: () => string[];
  /** Reset manager state (testing only) */
  reset: () => void;
}
