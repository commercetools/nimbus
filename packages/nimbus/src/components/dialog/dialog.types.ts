import { type ComponentProps } from "react";
import { type RecipeVariantProps } from "@chakra-ui/react";
import { dialogSlotRecipe } from "./dialog.recipe";

/**
 * Props for the Dialog.Root component
 *
 * The root component that provides context and state management for the dialog.
 * Uses React Aria's DialogTrigger for accessibility and state management.
 *
 * This component handles configuration through recipe variants that are passed
 * down to child components via context.
 */
export interface DialogRootProps
  extends RecipeVariantProps<typeof dialogSlotRecipe> {
  /**
   * The children components (Trigger, Content, etc.)
   */
  children: React.ReactNode;

  /**
   * Whether the dialog is open (controlled mode)
   */
  isOpen?: boolean;

  /**
   * Callback fired when the dialog open state changes
   * @param isOpen - Whether the dialog is now open
   */
  onOpenChange?: (isOpen: boolean) => void;

  /**
   * Whether the dialog is open by default (uncontrolled mode)
   * @default false
   */
  defaultOpen?: boolean;
}

/**
 * Props for the Dialog.Trigger component
 *
 * The trigger element that opens the dialog when activated.
 */
export interface DialogTriggerProps extends ComponentProps<"button"> {
  /**
   * The trigger content
   */
  children: React.ReactNode;

  /**
   * Whether to render as a child element (use children directly as the trigger)
   * @default false
   */
  asChild?: boolean;

  /**
   * Whether the trigger is disabled
   * @default false
   */
  isDisabled?: boolean;
}

/**
 * Props for the Dialog.Content component
 *
 * The main dialog content container that wraps the React Aria Dialog and Dialog.
 * Configuration (size, placement, motionPreset, etc.) is inherited from Dialog.Root via context.
 */
export interface DialogContentProps extends ComponentProps<"div"> {
  /**
   * The dialog content
   */
  children: React.ReactNode;

  /**
   * Whether to render the dialog in a portal
   * @default true
   */
  isPortalled?: boolean;

  /**
   * The container element for the portal
   */
  portalContainer?: HTMLElement | (() => HTMLElement);

  /**
   * Whether to show the backdrop overlay
   * @default true
   */
  hasBackdrop?: boolean;

  /**
   * Whether the dialog should close when clicking outside
   * @default true
   */
  isDismissable?: boolean;

  /**
   * Whether the dialog should close when pressing Escape
   * @default true
   */
  isKeyboardDismissDisabled?: boolean;

  /**
   * Callback fired when the dialog requests to be closed
   */
  onClose?: () => void;
}

/**
 * Props for the Dialog.Backdrop component
 *
 * The backdrop overlay that appears behind the dialog content.
 */
export interface DialogBackdropProps extends ComponentProps<"div"> {
  /**
   * Custom styles for the backdrop
   */
  style?: React.CSSProperties;
}

/**
 * Props for the Dialog.Header component
 *
 * The header section of the dialog content.
 */
export interface DialogHeaderProps extends ComponentProps<"header"> {
  /**
   * The header content
   */
  children: React.ReactNode;
}

/**
 * Props for the Dialog.Body component
 *
 * The main body content section of the dialog.
 */
export interface DialogBodyProps extends ComponentProps<"div"> {
  /**
   * The body content
   */
  children: React.ReactNode;
}

/**
 * Props for the Dialog.Footer component
 *
 * The footer section of the dialog, typically containing action buttons.
 */
export interface DialogFooterProps extends ComponentProps<"footer"> {
  /**
   * The footer content (usually buttons)
   */
  children: React.ReactNode;
}

/**
 * Props for the Dialog.Title component
 *
 * The accessible title element for the dialog.
 */
export interface DialogTitleProps extends ComponentProps<"h2"> {
  /**
   * The title text
   */
  children: React.ReactNode;
}

/**
 * Props for the Dialog.Description component
 *
 * The accessible description element for the dialog.
 */
export interface DialogDescriptionProps extends ComponentProps<"p"> {
  /**
   * The description text
   */
  children: React.ReactNode;
}

/**
 * Props for the Dialog.CloseTrigger component
 *
 * A button that closes the dialog when activated.
 * Displays an IconButton with an X icon by default.
 */
export interface DialogCloseTriggerProps
  extends Omit<ComponentProps<"button">, "value" | "onFocus" | "onBlur"> {
  /**
   * Accessible label for the close button
   * @default "Close dialog"
   */
  "aria-label"?: string;
}

/**
 * Placement variants for the dialog
 */
export type DialogPlacement = "center" | "top" | "bottom";

/**
 * Scroll behavior variants for the dialog
 */
export type DialogScrollBehavior = "inside" | "outside";

/**
 * Motion preset variants for dialog animations
 */
export type DialogMotionPreset =
  | "scale"
  | "slide-in-bottom"
  | "slide-in-top"
  | "slide-in-left"
  | "slide-in-right"
  | "none";
