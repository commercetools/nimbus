import { useRef, forwardRef } from "react";
import { useDisclosure } from "react-aria";
import { useDisclosureState } from "react-stately";
import { extractStyleProps } from "@/utils/extractStyleProps";
import { CollapsibleMotionContext } from "./collapsible-motion-context";
import {
  CollapsibleMotionRootSlot,
  type CollapsibleMotionRecipeProps,
} from "../collapsible-motion.slots";

/**
 * Props for CollapsibleMotion.Root component
 */
export interface CollapsibleMotionRootProps
  extends CollapsibleMotionRecipeProps {
  /**
   * The child components (Trigger and Content)
   */
  children: React.ReactNode;

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
   * The minimum height of the content when collapsed (in pixels)
   * @default 0
   */
  minHeight?: number;

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
 * CollapsibleMotion.Root - The root container component that manages state and provides context
 *
 * This component contains all the state management logic and provides context to
 * CollapsibleMotion.Trigger and CollapsibleMotion.Content components.
 */
export const CollapsibleMotionRoot = forwardRef<
  HTMLDivElement,
  CollapsibleMotionRootProps
>(function CollapsibleMotionRoot(
  {
    children,
    defaultExpanded = false,
    isExpanded: controlledExpanded,
    onExpandedChange,
    isDisabled = false,
    ...props
  },
  forwardedRef
) {
  // Use recipe context for slot styling
  const [styleProps, functionalProps] = extractStyleProps(props);

  // Use React Aria's disclosure state management
  const disclosureState = useDisclosureState({
    defaultExpanded,
    isExpanded: controlledExpanded,
    onExpandedChange,
  });

  const panelRef = useRef<HTMLDivElement>(null);

  // Use React Aria's disclosure hook for ARIA props
  const { buttonProps, panelProps } = useDisclosure(
    { isDisabled },
    disclosureState,
    panelRef
  );

  // Toggle function that respects disabled state
  const toggle = () => {
    if (isDisabled) return;
    disclosureState.toggle();
  };

  // Context value to provide to child components
  const contextValue = {
    toggle,
    isExpanded: disclosureState.isExpanded,
    isDisabled,
    buttonProps,
    panelProps,
    panelRef,
  };

  return (
    <CollapsibleMotionContext.Provider value={contextValue}>
      <CollapsibleMotionRootSlot ref={forwardedRef} {...styleProps} asChild>
        <div {...functionalProps}>{children}</div>
      </CollapsibleMotionRootSlot>
    </CollapsibleMotionContext.Provider>
  );
});

CollapsibleMotionRoot.displayName = "CollapsibleMotion.Root";
