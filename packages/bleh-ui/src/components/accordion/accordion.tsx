import { HeaderRightContent } from "./accordion.slots";
import { AccordionGroup } from "./accordion-group";
import { AccordionHeader } from "./accordion-header";
import { AccordionContent } from "./accordion-content";
import { AccordionItem } from "./accordion-item";

// Create the Accordion namespace object as an object literal
const Accordion = {
  Root: AccordionGroup,
  Item: AccordionItem,
  Header: AccordionHeader,
  Content: AccordionContent,
  HeaderRightContent,
};

export default Accordion;
