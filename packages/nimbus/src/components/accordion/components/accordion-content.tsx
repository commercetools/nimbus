import { AccordionPanelSlot } from "../accordion.slots";
import { DisclosurePanel as RaDisclosurePanel } from "react-aria-components";
import type { AccordionContentProps } from "../accordion.types";

// Create Content component
export const AccordionContent = ({
  children,
  ref,
  ...props
}: AccordionContentProps) => {
  return (
    <AccordionPanelSlot ref={ref} asChild>
      <RaDisclosurePanel {...props}>{children}</RaDisclosurePanel>
    </AccordionPanelSlot>
  );
};
