import {
  createSlotRecipeContext,
  type HTMLChakraProps,
  type RecipeVariantProps,
} from "@chakra-ui/react/styled-system";
import { accordionSlotRecipe } from "./accordion.recipe";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "accordion",
});

export type AccordionRootSlotProps = HTMLChakraProps<
  "div",
  RecipeVariantProps<typeof accordionSlotRecipe>
>;

export const AccordionRootSlot = withProvider<
  HTMLDivElement,
  AccordionRootSlotProps
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

export const AccordionHeaderRightContentSlot = withContext<
  HTMLDivElement,
  HTMLChakraProps<"div">
>("div", "headerContentRight");
