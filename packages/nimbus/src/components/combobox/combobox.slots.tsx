import {
  type HTMLChakraProps,
  type RecipeProps,
  type UnstyledProp,
  createRecipeContext,
} from "@chakra-ui/react";

import { comboboxRecipe } from "./combobox.recipe";

/**
 * Base recipe props interface that combines Chakra UI's recipe props
 * with the unstyled prop option for the div element.
 */
interface ComboboxRecipeProps extends RecipeProps<"div">, UnstyledProp {}

/**
 * Root props interface that extends Chakra's HTML props with our recipe props.
 * This creates a complete set of props for the root element, combining
 * HTML attributes, Chakra's styling system, and our custom recipe props.
 */
export interface ComboboxRootProps
  extends HTMLChakraProps<"div", ComboboxRecipeProps> {}

const { withContext } = createRecipeContext({ recipe: comboboxRecipe });

/**
 * Root component that provides the styling context for the Combobox component.
 * Uses Chakra UI's recipe context system for consistent styling across instances.
 */
export const ComboboxRoot = withContext<HTMLDivElement, ComboboxRootProps>(
  "div"
);
