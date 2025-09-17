import {
  type HTMLChakraProps,
  type RecipeVariantProps,
  type UnstyledProp,
  createSlotRecipeContext,
} from "@chakra-ui/react/styled-system";

import { multilineTextInputRecipe } from "./multiline-text-input.recipe";

export interface MultilineTextInputRecipeProps
  extends RecipeVariantProps<typeof multilineTextInputRecipe>,
    UnstyledProp {}

export type MultilineTextInputRootSlotProps = HTMLChakraProps<
  "div",
  MultilineTextInputRecipeProps
>;

export type MultilineTextInputLeadingElementProps = HTMLChakraProps<
  "div",
  MultilineTextInputRecipeProps
>;


export type MultilineTextInputTextAreaSlotProps = HTMLChakraProps<
  "textarea",
  MultilineTextInputRecipeProps
>;

const { withContext, withProvider } = createSlotRecipeContext({
  recipe: multilineTextInputRecipe,
});

/**
 * Root component that provides the styling context for the MultilineTextInput component.
 * Uses Chakra UI's recipe context system for consistent styling across instances.
 */
export const MultilineTextInputRootSlot = withProvider<
  HTMLDivElement,
  MultilineTextInputRootSlotProps
>("div", "root");

export const MultilineTextInputLeadingElementSlot = withContext<
  HTMLDivElement,
  MultilineTextInputLeadingElementProps
>("div", "leadingElement");


export const MultilineTextInputTextAreaSlot = withContext<
  HTMLTextAreaElement,
  MultilineTextInputTextAreaSlotProps
>("textarea", "textarea");
