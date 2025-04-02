import {
  createSlotRecipeContext,
  type HTMLChakraProps,
} from "@chakra-ui/react";
import type { AccordionRootProps } from "./accordion.types";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "accordion",
});

export const AccordionRoot = withProvider<HTMLDivElement, AccordionRootProps>(
  "div",
  "root"
);

type AccordionDisclosureProps = HTMLChakraProps<"div">;
export const AccordionDisclosure = withContext<
  HTMLDivElement,
  AccordionDisclosureProps
>("div", "disclosure");

export type AccordionTriggerProps = HTMLChakraProps<"button">;
export const AccordionTrigger = withContext<
  HTMLButtonElement,
  AccordionTriggerProps
>("button", "trigger");

export type AccordionPanelProps = HTMLChakraProps<"div">;
export const AccordionPanel = withContext<HTMLDivElement, AccordionPanelProps>(
  "div",
  "panel"
);

type AccordionTitleProps = HTMLChakraProps<"div">;
export const AccordionTitle = withContext<
  HTMLButtonElement,
  AccordionTitleProps
>("div", "accordionTitle");
