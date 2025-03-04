import type { TextInputRootProps } from "./text-input.slots";
import type { RecipeVariantProps } from "@chakra-ui/react";
import { textInputRecipe } from "./text-input.recipe";

/**
 * Combines the root props with Chakra UI's recipe variant props.
 * This allows the component to accept both structural props from Root
 * and styling variants from the recipe.
 */
type TextInputVariantProps = TextInputRootProps &
  RecipeVariantProps<typeof textInputRecipe>;

/**
 * Main props interface for the TextInput component.
 * Extends TextInputVariantProps to include both root props and variant props,
 * while adding support for React children.
 */
export interface TextInputProps extends TextInputVariantProps {
  children?: React.ReactNode;
}
