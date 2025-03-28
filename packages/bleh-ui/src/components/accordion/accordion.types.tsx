import type { RecipeVariantProps, HTMLChakraProps } from "@chakra-ui/react";
import { accordionSlotRecipe } from "./accordion.recipe";
import { type DisclosureProps } from "react-aria-components";

export type AccordionRootProps = HTMLChakraProps<
  "div",
  RecipeVariantProps<typeof accordionSlotRecipe>
>;

export interface AccordionProps
  extends Omit<DisclosureProps, "children" | "id"> {
  children?: React.ReactNode;
  title?: React.ReactNode;
  additionalTriggerComponent?: React.ReactNode;
  recipe?: string;
  size?: AccordionRootProps["size"];
}
