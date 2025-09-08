import { type ComponentProps } from "react";
import { type RecipeVariantProps } from "@chakra-ui/react";
import { drawerSlotRecipe } from "./drawer.recipe";

/**
 * Side position options for the drawer
 */
export type DrawerSide = "left" | "right" | "top" | "bottom";

/**
 * Size variants specific to drawer positioning
 */
export type DrawerSize = 
  | "xs" | "sm" | "md" | "lg" | "xl" // Standard sizes
  | "full" | "cover"               // Full screen variants
  | "narrow" | "wide";             // Drawer-specific sizes

/**
 * Props for the Drawer.Root component
 * 
 * The root component that provides context and state management for the drawer.
 * Extends Modal.Root with drawer-specific functionality.
 */
export interface DrawerRootProps {
  /**
   * The children components (Trigger, Content, etc.)
   */
  children: React.ReactNode;
  
  /**
   * Whether the drawer is open (controlled mode)
   */
  isOpen?: boolean;
  
  /**
   * Callback fired when the drawer open state changes
   * @param isOpen - Whether the drawer is now open
   */
  onOpenChange?: (isOpen: boolean) => void;
  
  /**
   * Whether the drawer is open by default (uncontrolled mode)
   * @default false
   */
  defaultOpen?: boolean;
  
  /**
   * Whether the drawer is disabled
   * @default false
   */
  isDisabled?: boolean;
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
}

/**
 * Props for the Drawer.Content component
 * 
 * The main drawer content container that extends Modal.Content with 
 * edge-positioning and drawer-specific behavior.
 */
export interface DrawerContentProps
  extends ComponentProps<"div">,
    RecipeVariantProps<typeof drawerSlotRecipe> {
  /**
   * The drawer content
   */
  children: React.ReactNode;
  
  /**
   * Which edge of the screen the drawer should slide in from
   * Automatically maps to appropriate placement and motionPreset
   * @default "left"
   */
  side?: DrawerSide;
  
  /**
   * Whether to render the drawer in a portal
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
   * Whether the drawer should close when clicking outside
   * @default true
   */
  isDismissable?: boolean;
  
  /**
   * Whether the drawer should close when pressing Escape
   * @default true
   */
  isKeyboardDismissDisabled?: boolean;
  
  /**
   * Callback fired when the drawer requests to be closed
   */
  onClose?: () => void;
  
  /**
   * Whether the drawer should close when swiping
   * @default false
   */
  isSwipeDisabled?: boolean;
}

/**
 * Props for the Drawer.Backdrop component
 * 
 * The backdrop overlay that appears behind the drawer content.
 */
export interface DrawerBackdropProps extends ComponentProps<"div"> {
  /**
   * Custom styles for the backdrop
   */
  style?: React.CSSProperties;
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
 * Props for the Drawer.Description component
 * 
 * The accessible description element for the drawer.
 */
export interface DrawerDescriptionProps extends ComponentProps<"p"> {
  /**
   * The description text
   */
  children: React.ReactNode;
}

/**
 * Props for the Drawer.CloseTrigger component
 * 
 * A button that closes the drawer when activated.
 */
export interface DrawerCloseTriggerProps extends ComponentProps<"button"> {
  /**
   * The close button content (typically an icon)
   */
  children: React.ReactNode;
  
  /**
   * Accessible label for the close button
   * @default "Close drawer"
   */
  "aria-label"?: string;
}

/**
 * Placement variants for the drawer (mapped from side)
 */
export type DrawerPlacement = "left" | "right" | "top" | "bottom";

/**
 * Scroll behavior variants for the drawer
 */
export type DrawerScrollBehavior = "inside" | "outside";

/**
 * Motion preset variants for drawer animations (mapped from side)
 */
export type DrawerMotionPreset = 
  | "slide-in-left" 
  | "slide-in-right" 
  | "slide-in-top" 
  | "slide-in-bottom"
  | "none";