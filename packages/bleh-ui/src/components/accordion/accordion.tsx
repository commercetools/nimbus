import React, { forwardRef } from "react";
import { AccordionRoot } from "./accordion.slots";
import { useDisclosureState } from "react-stately";
import { useDisclosure, mergeProps, useButton, useFocusRing } from "react-aria";

import {
  Disclosure,
  DisclosurePanel,
  Heading,
  Button,
  type DisclosureProps,
  type DisclosurePanelProps,
} from "react-aria-components";

/**
 * Accordion
 * ============================================================
 * A collapsible component used for organizing contents. This allows users to toggle visibility of the content sections in their individual panels when the panel's header is clicked.
 *
 * Features:
 *
 * - allows forwarding refs to the underlying DOM element
 * - accepts all native html 'HTMLDivElement' attributes (including aria- & data-attributes)
 * - supports 'variants', 'sizes', etc. configured in the recipe
 * - allows overriding styles by using style-props
 * - supports 'asChild' and 'as' to modify the underlying html-element (polymorphic)
 */

interface AccordionProps extends Omit<DisclosureProps, "children"> {
  title?: string;
  children?: React.ReactNode;
}

export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  ({ title, children, ...props }, forwardedRef) => {
    // const ref = useObjectRef(forwardedRef);
    const state = useDisclosureState(props);
    const panelRef = React.useRef<HTMLDivElement | null>(null);
    const triggerRef = React.useRef<HTMLButtonElement | null>(null);
    const { buttonProps: triggerProps, panelProps } = useDisclosure(
      props,
      state,
      panelRef
    );
    const { buttonProps } = useButton(triggerProps, triggerRef);
    const { isFocusVisible, focusProps } = useFocusRing();

    return (
      <AccordionRoot ref={forwardedRef} {...props}>
        <div className="disclosure">
          <h3>
            <button
              className="trigger"
              ref={triggerRef}
              {...mergeProps(buttonProps, focusProps)}
              style={{
                outline: isFocusVisible ? "2px solid dodgerblue" : "none",
              }}
            >
              <svg viewBox="0 0 24 24">
                <path d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
              {title}
            </button>
          </h3>
          <div className="panel" ref={panelRef} {...panelProps}>
            <>{children}</>
          </div>
        </div>
      </AccordionRoot>
    );
  }
);
Accordion.displayName = "Accordion";
