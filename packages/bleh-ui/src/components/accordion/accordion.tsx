import React, { forwardRef } from "react";
import {
  AccordionRoot,
  AccordionDisclosure,
  AccordionTrigger,
  AccordionPanel,
  AccordionTitle,
} from "./accordion.slots";
import { useDisclosureState } from "react-stately";
import { useDisclosure, mergeProps, useButton, useFocusRing } from "react-aria";
import { type DisclosureProps } from "react-aria-components";
import { useSlotRecipe } from "@chakra-ui/react";
import type { AccordionRootProps } from "./accordion.types";
import { Flex } from "@/components";

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
  children?: React.ReactNode;
  title?: React.ReactNode;
  additionalTriggerComponent?: React.ReactNode;
  recipe?: string;
  size?: AccordionRootProps["size"];
}

export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  ({ title, children, additionalTriggerComponent, ...props }, forwardedRef) => {
    const state = useDisclosureState(props);
    const panelRef = React.useRef<HTMLDivElement | null>(null);
    const triggerRef = React.useRef<HTMLButtonElement | null>(null);
    const { buttonProps: triggerProps, panelProps } = useDisclosure(
      props,
      state,
      panelRef
    );
    const { buttonProps } = useButton(triggerProps, triggerRef);
    const { focusProps, isFocusVisible } = useFocusRing();
    const recipe = useSlotRecipe({ key: "accordion" });
    const [recipeProps] = recipe.splitVariantProps(props);

    return (
      <AccordionRoot data-slot="root" ref={forwardedRef} {...recipeProps}>
        <AccordionDisclosure>
          <Flex
            justifyContent="space-between"
            alignItems={"center"}
            borderBottom="solid-25"
            borderColor="neutral.4"
          >
            <AccordionTrigger
              ref={triggerRef}
              {...mergeProps(buttonProps, focusProps)}
              data-slot="trigger"
              outline={isFocusVisible ? undefined : "none"}
            >
              <svg viewBox="0 0 24 24">
                <path d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
              <AccordionTitle
                data-slot="acccordionTitle"
                style={{
                  fontSize: props.size as string,
                }}
              >
                {title}
              </AccordionTitle>
            </AccordionTrigger>
            <div>{additionalTriggerComponent}</div>
          </Flex>
          <AccordionPanel ref={panelRef} {...panelProps} data-slot="panel">
            {children}
          </AccordionPanel>
        </AccordionDisclosure>
      </AccordionRoot>
    );
  }
);
Accordion.displayName = "Accordion";
