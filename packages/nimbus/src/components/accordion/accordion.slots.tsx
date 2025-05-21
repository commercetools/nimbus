import {
  createSlotRecipeContext,
  type HTMLChakraProps,
} from "@chakra-ui/react";
import type { AccordionRootProps } from "./accordion.types";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "accordion",
});

export const AccordionRootSlot = withProvider<
  HTMLDivElement,
  AccordionRootProps
>("div", "root");

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

// TODO: should have slot, but if it does, it will break the props table
export const AccordionHeaderRightContent = withContext<
  HTMLDivElement,
  HTMLChakraProps<"div">
>("div", "headerContentRight");
