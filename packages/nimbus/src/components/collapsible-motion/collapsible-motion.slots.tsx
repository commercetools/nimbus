import {
  createSlotRecipeContext,
  type HTMLChakraProps,
  type RecipeVariantProps,
} from "@chakra-ui/react/styled-system";
import { collapsibleMotionSlotRecipe } from "./collapsible-motion.recipe";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "collapsibleMotion",
});

export type CollapsibleMotionRootSlotProps = HTMLChakraProps<
  "div",
  RecipeVariantProps<typeof collapsibleMotionSlotRecipe>
>;

export const CollapsibleMotionRootSlot = withProvider<
  HTMLDivElement,
  CollapsibleMotionRootSlotProps
>("div", "root");

export const CollapsibleMotionTriggerSlot = withContext<
  HTMLButtonElement,
  HTMLChakraProps<"button">
>("button", "trigger");

export const CollapsibleMotionContentSlot = withContext<
  HTMLDivElement,
  HTMLChakraProps<"div">
>("div", "content");

// Re-export recipe variant props for use in components
export type CollapsibleMotionRecipeProps = RecipeVariantProps<
  typeof collapsibleMotionSlotRecipe
>;
