import {
  type HTMLChakraProps,
  type RecipeVariantProps,
  type UnstyledProp,
  createSlotRecipeContext,
} from "@chakra-ui/react";
import { richTextInputRecipe } from "./rich-text-input.recipe";

const { withProvider, withContext } = createSlotRecipeContext({
  recipe: richTextInputRecipe,
});

// Root slot
export type RichTextInputRootSlotProps = HTMLChakraProps<
  "div",
  RecipeVariantProps<typeof richTextInputRecipe> & UnstyledProp
>;

export const RichTextInputRootSlot = withProvider<
  HTMLDivElement,
  RichTextInputRootSlotProps
>("div", "root");

// Toolbar slot
export type RichTextInputToolbarSlotProps = HTMLChakraProps<"div">;

export const RichTextInputToolbarSlot = withContext<
  HTMLDivElement,
  RichTextInputToolbarSlotProps
>("div", "toolbar");

// Editable slot
export type RichTextInputEditableSlotProps = HTMLChakraProps<"div">;
export const RichTextInputEditableSlot = withContext<
  HTMLDivElement,
  RichTextInputEditableSlotProps
>("div", "editable");
