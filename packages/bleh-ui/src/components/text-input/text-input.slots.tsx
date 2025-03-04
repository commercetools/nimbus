import {
  type HTMLChakraProps,
  type RecipeProps,
  type UnstyledProp,
  createRecipeContext,
} from "@chakra-ui/react";

import { textInputRecipe } from "./text-input.recipe";

interface TextInputRecipeProps extends RecipeProps<"input">, UnstyledProp {}

export type TextInputRootProps = HTMLChakraProps<"input", TextInputRecipeProps>;

const { withContext } = createRecipeContext({ recipe: textInputRecipe });

/**
 * Root component that provides the styling context for the TextInput component.
 * Uses Chakra UI's recipe context system for consistent styling across instances.
 */
export const TextInputRoot = withContext<HTMLInputElement, TextInputRootProps>(
  "input"
);
