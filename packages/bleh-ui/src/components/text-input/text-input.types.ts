import type { HTMLChakraProps, RecipeVariantProps } from "@chakra-ui/react";
import { textInputRecipe } from "./text-input.recipe";

export interface TextInputProps
  extends HTMLChakraProps<"input">,
    RecipeVariantProps<typeof textInputRecipe> {
  /**
   * If true, the input will indicate an error state
   */
  isInvalid?: boolean;
}
