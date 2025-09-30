import { useRef, forwardRef } from "react";
import { useDisclosure } from "react-aria";
import { useDisclosureState } from "react-stately";
import { extractStyleProps } from "@/utils/extractStyleProps";
import { CollapsibleMotionContext } from "./collapsible-motion-context";
import { CollapsibleMotionRootSlot } from "../collapsible-motion.slots";
import type { CollapsibleMotionRootProps } from "../collapsible-motion.types";

/**
 * CollapsibleMotion.Root - The root container component that manages state and provides context
 *
 * This component contains all the state management logic and provides context to
 * CollapsibleMotion.Trigger and CollapsibleMotion.Content components.
 */
export const CollapsibleMotionRoot = forwardRef<
  HTMLDivElement,
  CollapsibleMotionRootProps
>(
  (
    {
      children,
      defaultExpanded = false,
      isExpanded: controlledExpanded,
      onExpandedChange,
      isDisabled = false,
      ...props
    },
    forwardedRef
  ) => {
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

    // Context value to provide to child components
    const contextValue = {
      isDisabled,
      isExpanded: disclosureState.isExpanded,
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
  }
);

CollapsibleMotionRoot.displayName = "CollapsibleMotion.Root";
