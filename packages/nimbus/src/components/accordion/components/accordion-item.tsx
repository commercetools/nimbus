import { forwardRef } from "react";
import { AccordionDisclosureSlot } from "../accordion.slots";
import { Disclosure as RaDisclosure } from "react-aria-components";
import type { AccordionItemProps } from "../accordion.types";

export const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ children, value, ...props }, forwardedRef) => {
    const disclosureProps = {
      ...props,
      id: value, // React Aria uses id for the key
    };

    return (
      <AccordionDisclosureSlot data-value={value} ref={forwardedRef} asChild>
        <RaDisclosure {...disclosureProps}>{children}</RaDisclosure>
      </AccordionDisclosureSlot>
    );
  }
);
