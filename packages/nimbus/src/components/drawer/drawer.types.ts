import { type RecipeVariantProps } from "@chakra-ui/react";
import { drawerSlotRecipe } from "./drawer.recipe";
import { type ModalOverlayProps as RaModalOverlayProps } from "react-aria-components";
import type {
  DrawerModalOverlaySlotProps,
  DrawerTriggerSlotProps,
  DrawerHeaderSlotProps,
  DrawerBodySlotProps,
  DrawerFooterSlotProps,
  DrawerTitleSlotProps,
} from "./drawer.slots";
import type { IconButtonProps } from "@/components";

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
export type DrawerRootProps = RecipeVariantProps<typeof drawerSlotRecipe> & {
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
   * @default false
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
export type DrawerTriggerProps = DrawerTriggerSlotProps & {
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
export type DrawerContentProps = DrawerModalOverlaySlotProps & {
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
export type DrawerHeaderProps = DrawerHeaderSlotProps & {
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
export type DrawerBodyProps = DrawerBodySlotProps & {
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
export type DrawerFooterProps = DrawerFooterSlotProps & {
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
export type DrawerTitleProps = DrawerTitleSlotProps & {
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
export type DrawerCloseTriggerProps = Omit<IconButtonProps, "aria-label"> & {
  /**
   * Accessible label for the close button
   * @default "Close drawer"
   */
  "aria-label"?: string;
};
