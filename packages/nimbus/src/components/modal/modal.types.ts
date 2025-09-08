import { type ComponentProps } from "react";
import { type RecipeVariantProps } from "@chakra-ui/react";
import { modalSlotRecipe } from "./modal.recipe";

/**
 * Props for the Modal.Root component
 * 
 * The root component that provides context and state management for the modal.
 * Uses React Aria's DialogTrigger for accessibility and state management.
 */
export interface ModalRootProps {
  /**
   * The children components (Trigger, Content, etc.)
   */
  children: React.ReactNode;
  
  /**
   * Whether the modal is open (controlled mode)
   */
  isOpen?: boolean;
  
  /**
   * Callback fired when the modal open state changes
   * @param isOpen - Whether the modal is now open
   */
  onOpenChange?: (isOpen: boolean) => void;
  
  /**
   * Whether the modal is open by default (uncontrolled mode)
   * @default false
   */
  defaultOpen?: boolean;
  
  /**
   * Whether the modal is disabled
   * @default false
   */
  isDisabled?: boolean;
}

/**
 * Props for the Modal.Trigger component
 * 
 * The trigger element that opens the modal when activated.
 */
export interface ModalTriggerProps extends ComponentProps<"button"> {
  /**
   * The trigger content
   */
  children: React.ReactNode;
}

/**
 * Props for the Modal.Content component
 * 
 * The main modal content container that wraps the React Aria Modal and Dialog.
 */
export interface ModalContentProps
  extends ComponentProps<"div">,
    RecipeVariantProps<typeof modalSlotRecipe> {
  /**
   * The modal content
   */
  children: React.ReactNode;
  
  /**
   * Whether to render the modal in a portal
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
   * Whether the modal should close when clicking outside
   * @default true
   */
  isDismissable?: boolean;
  
  /**
   * Whether the modal should close when pressing Escape
   * @default true
   */
  isKeyboardDismissDisabled?: boolean;
  
  /**
   * Callback fired when the modal requests to be closed
   */
  onClose?: () => void;
}

/**
 * Props for the Modal.Backdrop component
 * 
 * The backdrop overlay that appears behind the modal content.
 */
export interface ModalBackdropProps extends ComponentProps<"div"> {
  /**
   * Custom styles for the backdrop
   */
  style?: React.CSSProperties;
}

/**
 * Props for the Modal.Header component
 * 
 * The header section of the modal content.
 */
export interface ModalHeaderProps extends ComponentProps<"header"> {
  /**
   * The header content
   */
  children: React.ReactNode;
}

/**
 * Props for the Modal.Body component
 * 
 * The main body content section of the modal.
 */
export interface ModalBodyProps extends ComponentProps<"div"> {
  /**
   * The body content
   */
  children: React.ReactNode;
}

/**
 * Props for the Modal.Footer component
 * 
 * The footer section of the modal, typically containing action buttons.
 */
export interface ModalFooterProps extends ComponentProps<"footer"> {
  /**
   * The footer content (usually buttons)
   */
  children: React.ReactNode;
}

/**
 * Props for the Modal.Title component
 * 
 * The accessible title element for the modal.
 */
export interface ModalTitleProps extends ComponentProps<"h2"> {
  /**
   * The title text
   */
  children: React.ReactNode;
}

/**
 * Props for the Modal.Description component
 * 
 * The accessible description element for the modal.
 */
export interface ModalDescriptionProps extends ComponentProps<"p"> {
  /**
   * The description text
   */
  children: React.ReactNode;
}

/**
 * Props for the Modal.CloseTrigger component
 * 
 * A button that closes the modal when activated.
 */
export interface ModalCloseTriggerProps extends ComponentProps<"button"> {
  /**
   * The close button content (typically an icon)
   */
  children: React.ReactNode;
  
  /**
   * Accessible label for the close button
   * @default "Close modal"
   */
  "aria-label"?: string;
}

/**
 * Size variants for the modal
 */
export type ModalSize = "xs" | "sm" | "md" | "lg" | "xl" | "cover" | "full";

/**
 * Placement variants for the modal
 */
export type ModalPlacement = "center" | "top" | "bottom";

/**
 * Scroll behavior variants for the modal
 */
export type ModalScrollBehavior = "inside" | "outside";

/**
 * Motion preset variants for modal animations
 */
export type ModalMotionPreset = 
  | "scale" 
  | "slide-in-bottom" 
  | "slide-in-top" 
  | "slide-in-left" 
  | "slide-in-right" 
  | "none";