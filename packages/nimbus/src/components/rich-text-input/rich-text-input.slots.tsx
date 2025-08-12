import {
  type HTMLChakraProps,
  type RecipeVariantProps,
  type UnstyledProp,
  createRecipeContext,
} from "@chakra-ui/react";
import { richTextInputRecipe } from "./rich-text-input.recipe";

export interface RichTextInputRecipeProps
  extends RecipeVariantProps<typeof richTextInputRecipe>,
    UnstyledProp {}

export interface RichTextInputSlotProps {
  size?: "sm" | "md" | "lg";
  variant?: "outline" | "filled";
  state?: "error" | "warning";
}

export type RichTextInputRootSlotProps = HTMLChakraProps<
  "div",
  RichTextInputRecipeProps
>;

const { withContext } = createRecipeContext({
  recipe: richTextInputRecipe,
});

export const RichTextInputRootSlot = withContext<
  HTMLDivElement,
  RichTextInputRootSlotProps
>("div");
