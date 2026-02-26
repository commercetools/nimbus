import type { ReactNode, RefObject } from "react";
import type { AriaButtonProps as RaButtonProps } from "react-aria";
import type {
  HTMLChakraProps,
  SlotRecipeProps,
} from "@chakra-ui/react/styled-system";
import type { OmitInternalProps } from "../../type-utils/omit-props";

// ============================================================
// RECIPE PROPS
// ============================================================

export type CollapsibleMotionRecipeProps =
  SlotRecipeProps<"nimbusCollapsibleMotion">;

// ============================================================
// SLOT PROPS
// ============================================================

export type CollapsibleMotionRootSlotProps = HTMLChakraProps<
  "div",
  CollapsibleMotionRecipeProps
>;

export type CollapsibleMotionTriggerSlotProps = HTMLChakraProps<"button">;

export type CollapsibleMotionContentSlotProps = HTMLChakraProps<"div">;

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

export type CollapsibleMotionRootProps =
  OmitInternalProps<CollapsibleMotionRootSlotProps> & {
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
  OmitInternalProps<CollapsibleMotionTriggerSlotProps> & {
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
  OmitInternalProps<CollapsibleMotionContentSlotProps> & {
    /**
     * Content to display inside the collapsible area
     */
    children: ReactNode;
  };
