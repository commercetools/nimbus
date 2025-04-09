import React, { forwardRef, useContext, useRef } from "react";
import { AccordionDisclosure } from "./accordion.slots";
import { useDisclosureState } from "react-stately";
import {
  useDisclosure,
  mergeProps,
  useButton,
  useFocusRing,
  useId,
} from "react-aria";
import type { DisclosureItemProps } from "./accordion.types";
// Import the contexts from the shared file
import { ItemContext, DisclosureGroupStateContext } from "./accordion-context";

export const AccordionItem = forwardRef<HTMLDivElement, DisclosureItemProps>(
  (
    { children, id, isDisabled, isExpanded, onExpandedChange, value },
    forwardedRef
  ) => {
    const defaultId = useId();
    const itemId = id || defaultId;
    const itemValue = value || itemId;

    // Get group state from context
    const groupState = useContext(DisclosureGroupStateContext);

    // Determine if expanded based on group state or prop
    const expanded = groupState
      ? groupState.expandedKeys.has(itemValue)
      : isExpanded;

    // Create disclosure state
    const state = useDisclosureState({
      isExpanded: expanded,
      onExpandedChange: (isExpanded) => {
        if (groupState) {
          groupState.toggleKey(itemValue);
        }
        onExpandedChange?.(isExpanded);
      },
    });

    // Create refs and get props
    const panelRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const disabled = isDisabled || groupState?.isDisabled || false;

    const { buttonProps, panelProps } = useDisclosure(
      {
        isExpanded: state.isExpanded,
        isDisabled: disabled,
      },
      state,
      panelRef
    );

    const { buttonProps: finalButtonProps } = useButton(
      buttonProps,
      triggerRef
    );
    const { focusProps, isFocusVisible } = useFocusRing();

    // Create context value for Header and Content
    const contextValue = {
      isExpanded: state.isExpanded,
      triggerRef,
      panelRef,
      buttonProps: mergeProps(finalButtonProps, focusProps),
      panelProps,
      isFocusVisible,
    };

    // Using the imported ItemContext
    return (
      <ItemContext.Provider value={contextValue}>
        <AccordionDisclosure
          data-slot="disclosure"
          data-value={itemValue}
          data-expanded={state.isExpanded}
          ref={forwardedRef}
        >
          {children}
        </AccordionDisclosure>
      </ItemContext.Provider>
    );
  }
);
