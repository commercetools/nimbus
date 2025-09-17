import type { ReactNode, RefObject } from "react";
import type { AriaButtonProps } from "react-aria";
import type {
  HTMLChakraProps,
  RecipeVariantProps,
} from "@chakra-ui/react/styled-system";
import type { collapsibleMotionSlotRecipe } from "./collapsible-motion.recipe";

// ============================================================================
// BASE TYPES
// ============================================================================

/**
 * Type definition for the CollapsibleMotion slot recipe
 * This is the foundation for all recipe-based styling
 */
export type CollapsibleMotionSlotRecipe = typeof collapsibleMotionSlotRecipe;

/**
 * Recipe variant props extracted from the slot recipe
 * These control the visual variants available in the recipe system
 */
export type CollapsibleMotionRecipeProps =
  RecipeVariantProps<CollapsibleMotionSlotRecipe>;

// ============================================================================
// SLOT TYPES
// ============================================================================

/**
 * Root slot props combining Chakra HTML props with recipe variants
 * This is the base for the root container component
 */
export type CollapsibleMotionRootSlotProps = HTMLChakraProps<
  "div",
  CollapsibleMotionRecipeProps
>;

// ============================================================================
// CONTEXT TYPES
// ============================================================================

/**
 * Internal context value interface for sharing state between compound components
 * This provides the communication layer between Root, Trigger, and Content components
 *
 * Note: Only includes properties that are actually consumed by child components.
 * React Aria handles state management internally through buttonProps/panelProps.
 */
export interface CollapsibleMotionContextValue {
  /** Whether the collapsible is disabled */
  isDisabled: boolean;
  /** Button props from React Aria for accessibility */
  buttonProps: AriaButtonProps<"button">;
  /** Panel props from React Aria for accessibility */
  panelProps: React.HTMLAttributes<HTMLDivElement>;
  /** Panel ref for React Aria (needs to be attached to the panel container) */
  panelRef: RefObject<HTMLDivElement | null>;
}

// ============================================================================
// COMPOUND COMPONENT PROPS
// ============================================================================

/**
 * Props for CollapsibleMotion.Root component
 * The main container that manages disclosure state and provides context to child components
 * Extends recipe props to inherit styling variants
 */
export interface CollapsibleMotionRootProps
  extends CollapsibleMotionRecipeProps {
  /**
   * The child components (Trigger and Content)
   */
  children: ReactNode;

  /**
   * Whether the content is expanded by default (uncontrolled mode)
   */
  defaultExpanded?: boolean;

  /**
   * Whether the content is expanded (controlled mode)
   */
  isExpanded?: boolean;

  /**
   * Callback fired when the expanded state changes
   */
  onExpandedChange?: (isExpanded: boolean) => void;

  /**
   * Whether the collapsible is disabled
   */
  isDisabled?: boolean;

  /**
   * Data attributes for testing and analytics
   */
  [key: `data-${string}`]: unknown;
}

/**
 * Props for CollapsibleMotion.Trigger component
 * The clickable element that toggles the disclosure state
 * Extends button HTML attributes for direct button rendering
 */
export interface CollapsibleMotionTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The trigger element content (typically text or icons)
   */
  children: React.ReactNode;
}

/**
 * Props for CollapsibleMotion.Content component
 * The collapsible content container with Chakra UI styling support
 * Extends HTML div attributes to support all standard div props
 */
export interface CollapsibleMotionContentProps extends HTMLChakraProps<"div"> {
  /**
   * The content to be collapsed/expanded
   */
  children: ReactNode;
}
