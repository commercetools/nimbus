import React, { forwardRef, type Key } from "react";
import { AccordionRoot as AccordionRootSlot } from "../accordion.slots";
import { useDisclosureGroupState } from "react-stately";
import { useSlotRecipe } from "@chakra-ui/react";
import type { DisclosureGroupProps } from "../accordion.types";
import { DisclosureGroupStateContext } from "../accordion-context";

/**
 * # Accordion
 *
 * Displays an Accordion.
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/navigation/accordion}
 */
export const AccordionRoot = forwardRef<HTMLDivElement, DisclosureGroupProps>(
  ({ children, onExpandedChange, ...props }, forwardedRef) => {
    const state = useDisclosureGroupState({
      ...props,
      onExpandedChange: (keys: Set<Key>) => {
        onExpandedChange?.(keys.size > 0);
      },
    });
    const recipe = useSlotRecipe({ key: "accordion" });
    const [recipeProps] = recipe.splitVariantProps(props);

    return (
      <DisclosureGroupStateContext.Provider value={state}>
        <AccordionRootSlot data-slot="root" ref={forwardedRef} {...recipeProps}>
          {children}
        </AccordionRootSlot>
      </DisclosureGroupStateContext.Provider>
    );
  }
);
