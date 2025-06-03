import { AccordionHeaderRightContent } from "./accordion.slots";
import { AccordionRoot } from "./components/accordion-root";
import { AccordionHeader } from "./components/accordion-header";
import { AccordionContent } from "./components/accordion-content";
import { AccordionItem } from "./components/accordion-item";

// Create the Accordion namespace object as an object literal
export const Accordion = {
  Root: AccordionRoot,
  Item: AccordionItem,
  Header: AccordionHeader,
  Content: AccordionContent,
  HeaderRightContent: AccordionHeaderRightContent,
};

export {
  AccordionRoot as _AccordionRoot,
  AccordionItem as _AccordionItem,
  AccordionHeader as _AccordionHeader,
  AccordionContent as _AccordionContent,
  AccordionHeaderRightContent as _AccordionHeaderRightContent,
};
