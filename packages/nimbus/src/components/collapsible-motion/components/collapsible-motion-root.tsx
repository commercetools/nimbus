import { useRef, forwardRef } from "react";
import { useDisclosure } from "react-aria";
import { useDisclosureState } from "react-stately";
import { CollapsibleMotionContext } from "./collapsible-motion-context";
import { CollapsibleMotionRootSlot } from "../collapsible-motion.slots";
import type { CollapsibleMotionRootProps } from "../collapsible-motion.types";

/**
 * CollapsibleMotion.Root - The root container component that manages state and provides context
 *
 * This component contains all the state management logic and provides context to
 * CollapsibleMotion.Trigger and CollapsibleMotion.Content components.
 *
 * @supportsStyleProps
 */
export const CollapsibleMotionRoot: React.ForwardRefExoticComponent<
  CollapsibleMotionRootProps & React.RefAttributes<HTMLDivElement>
> = forwardRef<HTMLDivElement, CollapsibleMotionRootProps>(
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
        <CollapsibleMotionRootSlot ref={forwardedRef} {...props}>
          {children}
        </CollapsibleMotionRootSlot>
      </CollapsibleMotionContext.Provider>
    );
  }
);

CollapsibleMotionRoot.displayName = "CollapsibleMotion.Root";
