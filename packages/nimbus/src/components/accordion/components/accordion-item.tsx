import { AccordionDisclosureSlot } from "../accordion.slots";
import { Disclosure as RaDisclosure } from "react-aria-components";
import type { AccordionItemProps } from "../accordion.types";

export const AccordionItem = ({
  children,
  value,
  ref,
  ...props
}: AccordionItemProps) => {
  const disclosureProps = {
    ...props,
    id: value, // React Aria uses id for the key
  };

  return (
    <AccordionDisclosureSlot data-value={value} ref={ref} asChild>
      <RaDisclosure {...disclosureProps}>{children}</RaDisclosure>
    </AccordionDisclosureSlot>
  );
};
