import { type ModalOverlayProps as RaModalOverlayProps } from "react-aria-components";
import type { IconButtonProps } from "../icon-button/icon-button.types";
import type {
  HTMLChakraProps,
  SlotRecipeProps,
} from "@chakra-ui/react/styled-system";
import type { OmitInternalProps } from "../../type-utils/omit-props";

// ============================================================
// RECIPE PROPS
// ============================================================

type DialogRecipeProps = {
  /** Placement of the dialog in the viewport */
  placement?: SlotRecipeProps<"nimbusDialog">["placement"];
  /** How scrolling behavior is handled when content overflows */
  scrollBehavior?: SlotRecipeProps<"nimbusDialog">["scrollBehavior"];
};

// ============================================================
// SLOT PROPS
// ============================================================

export type DialogRootSlotProps = HTMLChakraProps<"div", DialogRecipeProps>;

export type DialogTriggerSlotProps = HTMLChakraProps<"button">;

export type DialogModalOverlaySlotProps = HTMLChakraProps<"div">;

export type DialogModalSlotProps = HTMLChakraProps<"div">;

export type DialogContentSlotProps = HTMLChakraProps<"div">;

export type DialogHeaderSlotProps = HTMLChakraProps<"header">;

export type DialogBodySlotProps = HTMLChakraProps<"div">;

export type DialogFooterSlotProps = HTMLChakraProps<"footer">;

export type DialogTitleSlotProps = HTMLChakraProps<"h2">;

export type DialogCloseTriggerSlotProps = HTMLChakraProps<"div">;

// ============================================================
// HELPER TYPES
// ============================================================

/**
 * Scroll behavior variants for the dialog
 */
export type DialogScrollBehavior = "inside" | "outside";

// ============================================================
// MAIN PROPS
// ============================================================

/**
 * Props for the Dialog.Root component
 *
 * The root component that provides context and state management for the dialog.
 * Uses React Aria's DialogTrigger for accessibility and state management.
 *
 * This component handles configuration through recipe variants that are passed
 * down to child components via context.
 */
export type DialogRootProps = OmitInternalProps<DialogRootSlotProps> & {
  /**
   * The children components (Trigger, Content, etc.)
   */
  children: React.ReactNode;

  /**
   * Whether the dialog is open (controlled mode)
   */
  isOpen?: boolean;

  /**
   * Whether the dialog is open by default (uncontrolled mode)
   * @default false
   */
  defaultOpen?: boolean;

  /**
   * Whether the dialog can be dismissed by clicking the backdrop or pressing Escape.
   * If true, clicking outside the dialog or pressing Escape will close it.
   * @default false
   */
  isDismissable?: RaModalOverlayProps["isDismissable"];

  /**
   * Whether keyboard dismissal (Escape key) is disabled.
   * If true, pressing Escape will NOT close the dialog.
   * @default false
   */
  isKeyboardDismissDisabled?: RaModalOverlayProps["isKeyboardDismissDisabled"];

  /**
   * Function to determine whether the dialog should close when interacting outside.
   * Receives the event and returns true to allow closing, false to prevent.
   */
  shouldCloseOnInteractOutside?: RaModalOverlayProps["shouldCloseOnInteractOutside"];

  /**
   * Callback fired when the dialog open state changes
   * @param isOpen - Whether the dialog is now open
   */
  onOpenChange?: (isOpen: boolean) => void;

  /** A Title for the dialog, optional, as long as the Dialog.Title component is user
   * or there is a Heading component used inside the Dialog with
   * a `slot`-property set to `title`.
   */
  "aria-label"?: string;
};

/**
 * Props for the Dialog.Trigger component
 *
 * The trigger element that opens the dialog when activated.
 */
export type DialogTriggerProps = OmitInternalProps<DialogTriggerSlotProps> & {
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
  /**
   * The ref to the trigger html-button
   */
  ref?: React.RefObject<HTMLButtonElement>;
};

/**
 * Props for the Dialog.Content component
 *
 * The main dialog content container that wraps the React Aria Dialog and Dialog.
 * Configuration (size, placement, etc.) is inherited from Dialog.Root via context.
 */
export type DialogContentProps =
  OmitInternalProps<DialogModalOverlaySlotProps> & {
    /**
     * The dialog content
     */
    children: React.ReactNode;

    /**
     * The ref to the dialog content
     */
    ref?: React.RefObject<HTMLDivElement>;
  };
/**
 * Props for the Dialog.Header component
 *
 * The header section of the dialog content.
 */
export type DialogHeaderProps = OmitInternalProps<DialogHeaderSlotProps> & {
  /**
   * The header content
   */
  children: React.ReactNode;

  /**
   * The ref to the dialog header
   */
  ref?: React.Ref<HTMLElement>;
};

/**
 * Props for the Dialog.Body component
 *
 * The main body content section of the dialog.
 */
export type DialogBodyProps = OmitInternalProps<DialogBodySlotProps> & {
  /**
   * The body content
   */
  children: React.ReactNode;

  /**
   * The ref to the dialog body
   */
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * Props for the Dialog.Footer component
 *
 * The footer section of the dialog, typically containing action buttons.
 */
export type DialogFooterProps = OmitInternalProps<DialogFooterSlotProps> & {
  /**
   * The footer content (usually buttons)
   */
  children: React.ReactNode;

  /**
   * The ref to the dialog footer
   */
  ref?: React.Ref<HTMLElement>;
};

/**
 * Props for the Dialog.Title component
 *
 * The accessible title element for the dialog.
 */
export type DialogTitleProps = OmitInternalProps<DialogTitleSlotProps> & {
  /**
   * The title text
   */
  children: React.ReactNode;

  /**
   * The ref to the dialog title
   */
  ref?: React.Ref<HTMLHeadingElement>;
};

/**
 * Props for the Dialog.CloseTrigger component
 *
 * A button that closes the dialog when activated.
 * Displays an IconButton with an X icon by default.
 */
export type DialogCloseTriggerProps = OmitInternalProps<
  Omit<IconButtonProps, "aria-label">
> & {
  /**
   * Accessible label for the close button
   * @default "Close dialog"
   */
  "aria-label"?: string;
};
