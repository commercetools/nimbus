import { AccordionPanelSlot } from "../accordion.slots";
import { DisclosurePanel as RaDisclosurePanel } from "react-aria-components";
import type { AccordionContentProps } from "../accordion.types";
import { extractStyleProps } from "@/utils/extract-style-props";

// Create Content component
export const AccordionContent = ({
  children,
  ref,
  ...props
}: AccordionContentProps) => {
  const [styleProps, restProps] = extractStyleProps(props);

  return (
    <AccordionPanelSlot ref={ref} {...styleProps} asChild>
      <RaDisclosurePanel {...restProps}>{children}</RaDisclosurePanel>
    </AccordionPanelSlot>
  );
};
