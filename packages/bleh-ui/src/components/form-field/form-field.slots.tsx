import {
  type HTMLChakraProps,
  type RecipeProps,
  type UnstyledProp,
  createRecipeContext,
} from "@chakra-ui/react";

import { formFieldRecipe } from "./form-field.recipe";

/**
 * Base recipe props interface that combines Chakra UI's recipe props
 * with the unstyled prop option for the div element.
 */
interface FormFieldRecipeProps extends RecipeProps<"div">, UnstyledProp {}

/**
 * Root props interface that extends Chakra's HTML props with our recipe props.
 * This creates a complete set of props for the root element, combining
 * HTML attributes, Chakra's styling system, and our custom recipe props.
 */
export interface FormFieldRootProps
  extends HTMLChakraProps<"div", FormFieldRecipeProps> {}

const { withContext } = createRecipeContext({ recipe: formFieldRecipe });

/**
 * Root component that provides the styling context for the FormField component.
 * Uses Chakra UI's recipe context system for consistent styling across instances.
 */
export const FormFieldRoot = withContext<HTMLDivElement, FormFieldRootProps>(
  "div"
);
