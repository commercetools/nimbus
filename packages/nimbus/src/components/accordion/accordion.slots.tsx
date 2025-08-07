import {
  createSlotRecipeContext,
  type HTMLChakraProps,
} from "@chakra-ui/react/styled-system";
import type { AccordionRootProps } from "./accordion.types";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "accordion",
});

export const AccordionRoot = withProvider<HTMLDivElement, AccordionRootProps>(
  "div",
  "root"
);

export const AccordionDisclosure = withContext<
  HTMLDivElement,
  HTMLChakraProps<"div">
>("div", "disclosure");

export const AccordionTrigger = withContext<
  HTMLButtonElement,
  HTMLChakraProps<"button">
>("button", "trigger");

export const AccordionPanel = withContext<
  HTMLDivElement,
  HTMLChakraProps<"div">
>("div", "panel");

export const AccordionTitle = withContext<
  HTMLButtonElement,
  HTMLChakraProps<"div">
>("div", "accordionTitle");

export const AccordionHeaderRightContent = withContext<
  HTMLDivElement,
  HTMLChakraProps<"div">
>("div", "headerContentRight");
