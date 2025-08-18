import {
  type HTMLChakraProps,
  type RecipeVariantProps,
  type UnstyledProp,
  createRecipeContext,
} from "@chakra-ui/react";

import { textInputRecipe } from "./text-input.recipe";

export interface TextInputRecipeProps
  extends RecipeVariantProps<typeof textInputRecipe>,
    UnstyledProp {}

export type TextInputRootSlotProps = HTMLChakraProps<
  "div",
  TextInputRecipeProps
>;

export type TextInputLeadingElementSlotProps = HTMLChakraProps<
  "div",
  TextInputRecipeProps
>;

export type TextInputTrailingElementSlotProps = HTMLChakraProps<
  "div",
  TextInputRecipeProps
>;

const { withContext } = createRecipeContext({ recipe: textInputRecipe });

/**
 * Root component that provides the styling context for the TextInput component.
 * Uses Chakra UI's recipe context system for consistent styling across instances.
 */
export const TextInputRootSlot = withContext<
  HTMLDivElement,
  TextInputRootSlotProps
>("div");

export const TextInputLeadingElementSlot = withContext<
  HTMLDivElement,
  TextInputLeadingElementSlotProps
>("div");

export const TextInputTrailingElementSlot = withContext<
  HTMLDivElement,
  TextInputTrailingElementSlotProps
>("div");
