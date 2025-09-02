import { forwardRef } from "react";
import { AccordionPanelSlot } from "../accordion.slots";
import { DisclosurePanel as RaDisclosurePanel } from "react-aria-components";
import type { AccordionContentProps } from "../accordion.types";

// Create Content component
export const AccordionContent = forwardRef<
  HTMLDivElement,
  AccordionContentProps
>(({ children, ...props }, forwardedRef) => {
  return (
    <AccordionPanelSlot ref={forwardedRef} asChild>
      <RaDisclosurePanel {...props}>{children}</RaDisclosurePanel>
    </AccordionPanelSlot>
  );
});
