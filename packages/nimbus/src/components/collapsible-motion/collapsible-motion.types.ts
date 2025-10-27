import type { ReactNode, RefObject } from "react";
import type { AriaButtonProps as RaButtonProps } from "react-aria";
import type { HTMLChakraProps, SlotRecipeProps } from "@chakra-ui/react";
import type { OmitUnwantedProps } from "../../type-utils/omit-props";

// ============================================================
// RECIPE PROPS
// ============================================================

export type CollapsibleMotionRecipeProps = SlotRecipeProps<"collapsibleMotion">;

// ============================================================
// SLOT PROPS
// ============================================================

export type CollapsibleMotionRootSlotProps = OmitUnwantedProps<
  HTMLChakraProps<"div", CollapsibleMotionRecipeProps>
>;

export type CollapsibleMotionTriggerSlotProps = OmitUnwantedProps<
  HTMLChakraProps<"button">
>;

export type CollapsibleMotionContentSlotProps = OmitUnwantedProps<
  HTMLChakraProps<"div">
>;

// ============================================================
// HELPER TYPES
// ============================================================

export type CollapsibleMotionContextValue = {
  isDisabled: boolean;
  isExpanded: boolean;
  buttonProps: RaButtonProps<"button">;
  panelProps: React.HTMLAttributes<HTMLDivElement>;
  panelRef: RefObject<HTMLDivElement | null>;
};

// ============================================================
// MAIN PROPS
// ============================================================

export type CollapsibleMotionRootProps = CollapsibleMotionRootSlotProps & {
  /**
   * Content of the collapsible component
   */
  children: ReactNode;
  /**
   * Default expanded state (uncontrolled mode)
   * @default false
   */
  defaultExpanded?: boolean;
  /**
   * Controlled expanded state
   */
  isExpanded?: boolean;
  /**
   * Callback fired when expanded state changes
   */
  onExpandedChange?: (isExpanded: boolean) => void;
  /**
   * Whether the component is disabled
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Data attributes for testing or custom metadata
   */
  [key: `data-${string}`]: unknown;
};

export type CollapsibleMotionTriggerProps =
  CollapsibleMotionTriggerSlotProps & {
    /**
     * Content to display in the trigger button
     */
    children: React.ReactNode;
    /**
     * Whether to render as a child component
     * @default false
     */
    asChild?: boolean;
  };

export type CollapsibleMotionContentProps =
  CollapsibleMotionContentSlotProps & {
    /**
     * Content to display inside the collapsible area
     */
    children: ReactNode;
  };
