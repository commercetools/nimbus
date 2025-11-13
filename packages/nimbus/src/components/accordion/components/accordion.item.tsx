import { AccordionDisclosureSlot } from "../accordion.slots";
import { Disclosure as RaDisclosure } from "react-aria-components";
import type { AccordionItemProps } from "../accordion.types";
import { extractStyleProps } from "@/utils";

/**
 * Accordion.Item - An individual accordion item
 *
 * Contains a header and collapsible content.
 * Multiple items can be placed within an Accordion.Root.
 *
 * @supportsStyleProps
 */
export const AccordionItem = ({
  children,
  value,
  ref,
  ...props
}: AccordionItemProps) => {
  const [styleProps, restProps] = extractStyleProps(props);
  const disclosureProps = {
    ...restProps,
    id: value, // React Aria uses id for the key
  };

  return (
    <AccordionDisclosureSlot
      data-value={value}
      ref={ref}
      {...styleProps}
      asChild
    >
      <RaDisclosure {...disclosureProps}>{children}</RaDisclosure>
    </AccordionDisclosureSlot>
  );
};

AccordionItem.displayName = "Accordion.Item";
