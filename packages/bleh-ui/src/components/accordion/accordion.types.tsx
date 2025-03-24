import type { RecipeVariantProps, HTMLChakraProps } from "@chakra-ui/react";
import { accordionSlotRecipe } from "./accordion.recipe";

export type AccordionRootProps = HTMLChakraProps<
  "div",
  RecipeVariantProps<typeof accordionSlotRecipe>
>;
