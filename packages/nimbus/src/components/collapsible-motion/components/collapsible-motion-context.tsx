import { createContext, useContext, type RefObject } from "react";
import type { AriaButtonProps } from "react-aria";

/**
 * Context value interface for CollapsibleMotion compound components
 */
export interface CollapsibleMotionContextValue {
  /** Function to toggle the expanded state */
  toggle: () => void;
  /** Whether the collapsible is currently expanded */
  isExpanded: boolean;
  /** Whether the collapsible is disabled */
  isDisabled: boolean;
  /** Button props from React Aria for accessibility */
  buttonProps: AriaButtonProps<"button">;
  /** Panel props from React Aria for accessibility */
  panelProps: React.HTMLAttributes<HTMLDivElement>;
  /** Panel ref for React Aria (needs to be attached to the panel container) */
  panelRef: RefObject<HTMLDivElement | null>;
}

/**
 * React Context for sharing CollapsibleMotion state between compound components
 */
export const CollapsibleMotionContext = createContext<
  CollapsibleMotionContextValue | undefined
>(undefined);

/**
 * Custom hook to consume CollapsibleMotion context
 */
export function useCollapsibleMotionContext(): CollapsibleMotionContextValue {
  const context = useContext(CollapsibleMotionContext);

  if (context === undefined) {
    throw new Error(
      "useCollapsibleMotionContext must be used within a CollapsibleMotion.Root component"
    );
  }

  return context;
}
