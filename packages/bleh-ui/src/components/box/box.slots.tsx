import {
  type HTMLChakraProps,
  type RecipeProps,
  type UnstyledProp,
  createRecipeContext,
} from "@chakra-ui/react";

import { boxRecipe } from "./box.recipe";

/**
 * Base recipe props interface that combines Chakra UI's recipe props
 * with the unstyled prop option for the div element.
 */
interface BoxRecipeProps extends RecipeProps<"div">, UnstyledProp {}

/**
 * Root props interface that extends Chakra's HTML props with our recipe props.
 * This creates a complete set of props for the root element, combining
 * HTML attributes, Chakra's styling system, and our custom recipe props.
 */
export interface BoxRootProps extends HTMLChakraProps<"div", BoxRecipeProps> {}

const { withContext } = createRecipeContext({ recipe: boxRecipe });

/**
 * Root component that provides the styling context for the Box component.
 * Uses Chakra UI's recipe context system for consistent styling across instances.
 */
export const BoxRoot = withContext<HTMLDivElement, BoxRootProps>("div");
