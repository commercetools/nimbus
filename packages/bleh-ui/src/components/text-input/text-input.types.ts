import type { RecipeVariantProps } from "@chakra-ui/react";
import type { TextInputRootProps } from "./text-input.slots";
import { textInputRecipe } from "./text-input.recipe";

type FunctionalTextInputProps = TextInputRootProps &
  RecipeVariantProps<typeof textInputRecipe>;

export interface TextInputProps extends FunctionalTextInputProps {
  /**
   * If true, the input will indicate an error state
   * @default false
   * @example
   * ```jsx
   * <TextInput isInvalid />
   * ```
   * @see [Chakra UI `Input` docs](https://chakra-ui.com/docs/form/input)
   * @see [MDN `input` docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input)
   */
  isInvalid?: boolean;
}
