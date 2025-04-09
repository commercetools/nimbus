import React, { forwardRef, useContext } from "react";
import { AccordionPanel } from "../accordion.slots";
import { useObjectRef } from "react-aria";
import { mergeProps, mergeRefs } from "@chakra-ui/react";
import type { DisclosureGroupProps } from "../accordion.types";
import { ItemContext } from "../accordion-context";

// Create Content component
export const AccordionContent = forwardRef<
  HTMLDivElement,
  DisclosureGroupProps
>((props, forwardedRef) => {
  const context = useContext(ItemContext);
  const ref = useObjectRef<HTMLDivElement>(
    mergeRefs(context?.panelRef, forwardedRef)
  );

  return (
    // @ts-expect-error TODO - fix prop types merging conflict
    <AccordionPanel
      ref={ref}
      {...mergeProps({ ...context?.panelProps, ...props })}
      data-slot="panel"
    >
      {props.children}
    </AccordionPanel>
  );
});
