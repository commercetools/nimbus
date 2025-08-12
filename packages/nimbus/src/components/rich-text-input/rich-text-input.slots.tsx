import {
  type HTMLChakraProps,
  type RecipeVariantProps,
  type UnstyledProp,
  type ConditionalValue,
  createRecipeContext,
} from "@chakra-ui/react";
import { richTextInputRecipe } from "./rich-text-input.recipe";

export interface RichTextInputRecipeProps
  extends RecipeVariantProps<typeof richTextInputRecipe>,
    UnstyledProp {}

export interface RichTextInputSlotProps {
  size?: ConditionalValue<"sm" | "md" | "lg">;
  variant?: ConditionalValue<"outline" | "filled">;
  state?: ConditionalValue<"error" | "warning">;
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
