import type { TextInputRootProps } from "./text-input.slots";
import type { RecipeVariantProps } from "@chakra-ui/react";
import { textInputRecipe } from "./text-input.recipe";

/**
 * Combines the root props with Chakra UI's recipe variant props.
 * This allows the component to accept both structural props from Root
 * and styling variants from the recipe.
 */
export type TextInputProps = (TextInputRootProps &
  RecipeVariantProps<typeof textInputRecipe>) & {
  isInvalid?: boolean;
};
