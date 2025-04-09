import React, { forwardRef, type Key } from "react";
import { AccordionRoot as AccordionRootSlot } from "./accordion.slots";
import { useDisclosureGroupState } from "react-stately";
import { mergeProps } from "react-aria";
import { useSlotRecipe } from "@chakra-ui/react";
import type { DisclosureGroupProps } from "./accordion.types";
import { DisclosureGroupStateContext } from "./accordion-context";

export const AccordionGroup = forwardRef<
  HTMLButtonElement,
  DisclosureGroupProps
>(({ children, onExpandedChange, ...props }, ref) => {
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
      <AccordionRootSlot
        data-slot="root"
        {...mergeProps({ ...recipeProps }, { ...props, ref })}
      >
        {children}
      </AccordionRootSlot>
    </DisclosureGroupStateContext.Provider>
  );
});
