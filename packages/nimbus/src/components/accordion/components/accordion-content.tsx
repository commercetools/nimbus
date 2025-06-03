import React, {
  forwardRef,
  useContext,
  type ComponentProps,
  type ReactNode,
} from "react";
import { AccordionPanel } from "../accordion.slots";
import { useObjectRef } from "react-aria";
import { mergeProps, mergeRefs } from "@chakra-ui/react";
import { ItemContext } from "../accordion-context";

type AccordionContentProps = {
  /**
   * The content to display
   */
  children: ReactNode;
} & ComponentProps<typeof AccordionPanel>;

// Create Content component
export const AccordionContent = forwardRef<
  HTMLDivElement,
  AccordionContentProps
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
