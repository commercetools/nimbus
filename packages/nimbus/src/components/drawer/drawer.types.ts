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

type DrawerRecipeProps = {
  /** Placement of the drawer in the viewport */
  placement?: SlotRecipeProps<"nimbusDrawer">["placement"];
  /** Whether to show backdrop overlay */
  showBackdrop?: SlotRecipeProps<"nimbusDrawer">["showBackdrop"];
};

// ============================================================
// SLOT PROPS
// ============================================================

export type DrawerRootSlotProps = HTMLChakraProps<"div", DrawerRecipeProps>;

export type DrawerTriggerSlotProps = HTMLChakraProps<"button">;

export type DrawerModalOverlaySlotProps = HTMLChakraProps<"div">;

export type DrawerModalSlotProps = HTMLChakraProps<"div">;

export type DrawerContentSlotProps = HTMLChakraProps<"div">;

export type DrawerHeaderSlotProps = HTMLChakraProps<"header">;

export type DrawerBodySlotProps = HTMLChakraProps<"div">;

export type DrawerFooterSlotProps = HTMLChakraProps<"footer">;

export type DrawerTitleSlotProps = HTMLChakraProps<"h2">;

export type DrawerCloseTriggerSlotProps = HTMLChakraProps<"div">;

// ============================================================
// MAIN PROPS
// ============================================================

/**
 * Props for the Drawer.Root component
 *
 * The root component that provides context and state management for the drawer.
 * Uses React Aria's DialogTrigger for accessibility and state management.
 *
 * This component handles configuration through recipe variants that are passed
 * down to child components via context.
 */
export type DrawerRootProps = OmitInternalProps<DrawerRootSlotProps> & {
  /**
   * The children components (Trigger, Content, etc.)
   */
  children: React.ReactNode;

  /**
   * Whether the drawer is open (controlled mode)
   */
  isOpen?: boolean;

  /**
   * Whether the drawer is open by default (uncontrolled mode)
   * @default false
   */
  defaultOpen?: boolean;

  /**
   * Whether the drawer can be dismissed by clicking the backdrop or pressing Escape.
   * If true, clicking outside the drawer or pressing Escape will close it.
   * @default true
   */
  isDismissable?: RaModalOverlayProps["isDismissable"];

  /**
   * Whether keyboard dismissal (Escape key) is disabled.
   * If true, pressing Escape will NOT close the drawer.
   * @default false
   */
  isKeyboardDismissDisabled?: RaModalOverlayProps["isKeyboardDismissDisabled"];

  /**
   * Function to determine whether the drawer should close when interacting outside.
   * Receives the event and returns true to allow closing, false to prevent.
   */
  shouldCloseOnInteractOutside?: RaModalOverlayProps["shouldCloseOnInteractOutside"];

  /**
   * Callback fired when the drawer open state changes
   * @param isOpen - Whether the drawer is now open
   */
  onOpenChange?: (isOpen: boolean) => void;

  /**
   * Whether to show the backdrop overlay behind the drawer
   * @default true
   */
  showBackdrop?: boolean;

  /** A Title for the drawer, optional, as long as the Drawer.Title component is used
   * or there is a Heading component used inside the Drawer with
   * a `slot`-property set to `title`.
   */
  "aria-label"?: string;
};

/**
 * Props for the Drawer.Trigger component
 *
 * The trigger element that opens the drawer when activated.
 */
export type DrawerTriggerProps = OmitInternalProps<DrawerTriggerSlotProps> & {
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
 * Props for the Drawer.Content component
 *
 * The main drawer content container that wraps the React Aria Dialog and Dialog.
 * Configuration (size, placement, etc.) is inherited from Drawer.Root via context.
 */
export type DrawerContentProps =
  OmitInternalProps<DrawerModalOverlaySlotProps> & {
    /**
     * The drawer content
     */
    children: React.ReactNode;

    /**
     * The ref to the drawer content
     */
    ref?: React.RefObject<HTMLDivElement>;
  };

/**
 * Props for the Drawer.Header component
 *
 * The header section of the drawer content.
 */
export type DrawerHeaderProps = OmitInternalProps<DrawerHeaderSlotProps> & {
  /**
   * The header content
   */
  children: React.ReactNode;

  /**
   * The ref to the drawer header
   */
  ref?: React.Ref<HTMLElement>;
};

/**
 * Props for the Drawer.Body component
 *
 * The main body content section of the drawer.
 */
export type DrawerBodyProps = OmitInternalProps<DrawerBodySlotProps> & {
  /**
   * The body content
   */
  children: React.ReactNode;

  /**
   * The ref to the drawer body
   */
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * Props for the Drawer.Footer component
 *
 * The footer section of the drawer, typically containing action buttons.
 */
export type DrawerFooterProps = OmitInternalProps<DrawerFooterSlotProps> & {
  /**
   * The footer content (usually buttons)
   */
  children: React.ReactNode;

  /**
   * The ref to the drawer footer
   */
  ref?: React.Ref<HTMLElement>;
};

/**
 * Props for the Drawer.Title component
 *
 * The accessible title element for the drawer.
 */
export type DrawerTitleProps = OmitInternalProps<DrawerTitleSlotProps> & {
  /**
   * The title text
   */
  children: React.ReactNode;

  /**
   * The ref to the drawer title
   */
  ref?: React.Ref<HTMLHeadingElement>;
};

/**
 * Props for the Drawer.CloseTrigger component
 *
 * A button that closes the drawer when activated.
 * Displays an IconButton with an X icon by default.
 */
export type DrawerCloseTriggerProps = OmitInternalProps<
  IconButtonProps,
  "aria-label"
> & {
  /**
   * Accessible label for the close button
   * @default "Close drawer"
   */
  "aria-label"?: string;
};
