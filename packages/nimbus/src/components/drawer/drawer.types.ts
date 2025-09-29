import { type ComponentProps } from "react";
import { type RecipeVariantProps } from "@chakra-ui/react";
import { drawerSlotRecipe } from "./drawer.recipe";
import { type ModalOverlayProps } from "react-aria-components";
import type { DrawerModalOverlaySlotProps } from "./drawer.slots";
import type { IconButtonProps } from "@/components";

/**
 * Props for the Drawer.Root component
 *
 * The root component that provides context and state management for the drawer.
 * Uses React Aria's DialogTrigger for accessibility and state management.
 *
 * This component handles configuration through recipe variants that are passed
 * down to child components via context.
 */
export interface DrawerRootProps
  extends RecipeVariantProps<typeof drawerSlotRecipe> {
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
  isDismissable?: ModalOverlayProps["isDismissable"];

  /**
   * Whether keyboard dismissal (Escape key) is disabled.
   * If true, pressing Escape will NOT close the drawer.
   * @default false
   */
  isKeyboardDismissDisabled?: ModalOverlayProps["isKeyboardDismissDisabled"];

  /**
   * Function to determine whether the drawer should close when interacting outside.
   * Receives the event and returns true to allow closing, false to prevent.
   */
  shouldCloseOnInteractOutside?: ModalOverlayProps["shouldCloseOnInteractOutside"];

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

  /** A Title for the drawer, optional, as long as there is a Heading
   * component used inside the Drawer.Content with a `slot`-property set to `title`.
   */
  "aria-label"?: string;
}

/**
 * Props for the Drawer.Trigger component
 *
 * The trigger element that opens the drawer when activated.
 */
export interface DrawerTriggerProps extends ComponentProps<"button"> {
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
 * Props for the Drawer.Content component
 *
 * The main drawer content container that wraps the React Aria Dialog and Dialog.
 * Configuration (size, placement, etc.) is inherited from Drawer.Root via context.
 */
export interface DrawerContentProps extends DrawerModalOverlaySlotProps {
  /**
   * The drawer content
   */
  children: React.ReactNode;

  /**
   * The ref to the drawer content
   */
  ref?: React.RefObject<HTMLDivElement>;
}
/**
 * Props for the Drawer.Header component
 *
 * The header section of the drawer content.
 */
export interface DrawerHeaderProps extends ComponentProps<"header"> {
  /**
   * The header content
   */
  children: React.ReactNode;
}

/**
 * Props for the Drawer.Body component
 *
 * The main body content section of the drawer.
 */
export interface DrawerBodyProps extends ComponentProps<"div"> {
  /**
   * The body content
   */
  children: React.ReactNode;
}

/**
 * Props for the Drawer.Footer component
 *
 * The footer section of the drawer, typically containing action buttons.
 */
export interface DrawerFooterProps extends ComponentProps<"footer"> {
  /**
   * The footer content (usually buttons)
   */
  children: React.ReactNode;
}

/**
 * Props for the Drawer.Title component
 *
 * The accessible title element for the drawer.
 */
export interface DrawerTitleProps extends ComponentProps<"h2"> {
  /**
   * The title text
   */
  children: React.ReactNode;
}

/**
 * Props for the Drawer.CloseTrigger component
 *
 * A button that closes the drawer when activated.
 * Displays an IconButton with an X icon by default.
 */
export interface DrawerCloseTriggerProps
  extends Omit<IconButtonProps, "aria-label"> {
  /**
   * Accessible label for the close button
   * @default "Close drawer"
   */
  "aria-label"?: string;
}
/**
 * Scroll behavior variants for the drawer
 */
export type DrawerScrollBehavior = "inside" | "outside";
