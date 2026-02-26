import {
  createSlotRecipeContext,
  type HTMLChakraProps,
} from "@chakra-ui/react/styled-system";
import type { SlotComponent } from "@/type-utils";
import type { AccordionRootSlotProps } from "./accordion.types";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "nimbusAccordion",
});

export const AccordionRootSlot: SlotComponent<
  HTMLDivElement,
  AccordionRootSlotProps
> = withProvider<HTMLDivElement, AccordionRootSlotProps>("div", "root");

export const AccordionDisclosureSlot = withContext<
  HTMLDivElement,
  HTMLChakraProps<"div">
>("div", "disclosure");

export const AccordionTriggerSlot = withContext<
  HTMLButtonElement,
  HTMLChakraProps<"button">
>("button", "trigger");

export const AccordionPanelSlot = withContext<
  HTMLDivElement,
  HTMLChakraProps<"div">
>("div", "panel");

export const AccordionTitleSlot = withContext<
  HTMLButtonElement,
  HTMLChakraProps<"div">
>("div", "accordionTitle");

export const AccordionHeaderRightContentSlot = withContext<
  HTMLDivElement,
  HTMLChakraProps<"div">
>("div", "headerContentRight");
