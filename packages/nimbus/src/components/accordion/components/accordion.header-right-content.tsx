import { AccordionHeaderRightContentSlot } from "../accordion.slots";
import type { AccordionHeaderRightContentProps } from "../accordion.types";

/**
 * Accordion.HeaderRightContent - Content displayed on the right side of the accordion header
 *
 * Used to add actions, badges, or additional information to the header.
 * Positioned to the right of the header title.
 *
 * @supportsStyleProps
 */
export const AccordionHeaderRightContent = ({
  children,
  ref,
  ...props
}: AccordionHeaderRightContentProps) => {
  return (
    <AccordionHeaderRightContentSlot ref={ref} {...props}>
      {children}
    </AccordionHeaderRightContentSlot>
  );
};

AccordionHeaderRightContent.displayName = "Accordion.HeaderRightContent";
