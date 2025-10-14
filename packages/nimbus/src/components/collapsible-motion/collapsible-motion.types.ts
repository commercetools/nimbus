import type { ReactNode, RefObject } from "react";
import type { AriaButtonProps as RaButtonProps } from "react-aria";
import type { HTMLChakraProps, SlotRecipeProps } from "@chakra-ui/react";

// ============================================================
// RECIPE PROPS
// ============================================================

export type CollapsibleMotionRecipeProps = SlotRecipeProps<"collapsibleMotion">;

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

export type CollapsibleMotionRootProps = CollapsibleMotionRootSlotProps & {
  children: ReactNode;
  defaultExpanded?: boolean;
  isExpanded?: boolean;
  onExpandedChange?: (isExpanded: boolean) => void;
  isDisabled?: boolean;
  [key: `data-${string}`]: unknown;
};

export type CollapsibleMotionTriggerProps =
  CollapsibleMotionTriggerSlotProps & {
    children: React.ReactNode;
    asChild?: boolean;
  };

export type CollapsibleMotionContentProps =
  CollapsibleMotionContentSlotProps & {
    children: ReactNode;
  };
