import {
  createSlotRecipeContext,
  type HTMLChakraProps,
  type RecipeVariantProps,
} from "@chakra-ui/react";
import { accordionSlotRecipe } from "./accordion.recipe";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "accordion",
});

export type AccordionRootProps = HTMLChakraProps<
  "div",
  RecipeVariantProps<typeof accordionSlotRecipe>
>;

export const AccordionRoot = withProvider<HTMLDivElement, AccordionRootProps>(
  "div",
  "root"
);

type AccordionDisclosureProps = HTMLChakraProps<"div">;
export const AccordionDisclosure = withContext<
  HTMLDivElement,
  AccordionDisclosureProps
>("div", "disclosure");

type AccordionTriggerProps = HTMLChakraProps<"button">;
export const AccordionTrigger = withContext<
  HTMLButtonElement,
  AccordionTriggerProps
>("button", "trigger");

type AccordionPanelProps = HTMLChakraProps<"div">;
export const AccordionPanel = withContext<HTMLDivElement, AccordionPanelProps>(
  "div",
  "panel"
);
