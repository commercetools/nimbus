import {
  type HTMLChakraProps,
  type RecipeVariantProps,
  type UnstyledProp,
  createRecipeContext,
} from "@chakra-ui/react/styled-system";

import { multilineTextInputRecipe } from "./multiline-text-input.recipe";

export interface MultilineTextInputRecipeProps
  extends RecipeVariantProps<typeof multilineTextInputRecipe>,
    UnstyledProp {}

export type MultilineTextInputRootSlotProps = HTMLChakraProps<
  "textarea",
  MultilineTextInputRecipeProps
>;

const { withContext } = createRecipeContext({
  recipe: multilineTextInputRecipe,
});

/**
 * Root component that provides the styling context for the MultilineTextInput component.
 * Uses Chakra UI's recipe context system for consistent styling across instances.
 */
export const MultilineTextInputRootSlot = withContext<
  HTMLTextAreaElement,
  MultilineTextInputRootSlotProps
>("textarea");
