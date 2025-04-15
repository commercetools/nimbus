import { HeaderRightContent } from "./accordion.slots";
import { AccordionGroup } from "./components/accordion-group";
import { AccordionHeader } from "./components/accordion-header";
import { AccordionContent } from "./components/accordion-content";
import { AccordionItem } from "./components/accordion-item";

// Create the Accordion namespace object as an object literal
export const Accordion = {
  Root: AccordionGroup,
  Item: AccordionItem,
  Header: AccordionHeader,
  Content: AccordionContent,
  HeaderRightContent,
};
