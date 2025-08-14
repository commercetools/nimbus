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
export interface RichTextInputRootSlotProps
  extends HTMLChakraProps<
    "div",
    RecipeVariantProps<typeof richTextInputRecipe> & UnstyledProp
  > {}

export const RichTextInputRootSlot = withProvider<
  HTMLDivElement,
  RichTextInputRootSlotProps
>("div", "root");

// Toolbar slot
export interface RichTextInputToolbarSlotProps extends HTMLChakraProps<"div"> {}

export const RichTextInputToolbarSlot = withContext<
  HTMLDivElement,
  RichTextInputToolbarSlotProps
>("div", "toolbar");

// Editable slot
export interface RichTextInputEditableSlotProps
  extends HTMLChakraProps<"div"> {}
export const RichTextInputEditableSlot = withContext<
  HTMLDivElement,
  RichTextInputEditableSlotProps
>("div", "editable");
