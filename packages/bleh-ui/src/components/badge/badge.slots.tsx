import {
  type HTMLChakraProps,
  type RecipeProps,
  type UnstyledProp,
  createRecipeContext,
} from "@chakra-ui/react";

import { badgeRecipe } from "./badge.recipe";

/**
 * Base recipe props interface that combines Chakra UI's recipe props
 * with the unstyled prop option for the div element.
 */
interface BadgeRecipeProps extends RecipeProps<"div">, UnstyledProp {}

/**
 * Root props interface that extends Chakra's HTML props with our recipe props.
 * This creates a complete set of props for the root element, combining
 * HTML attributes, Chakra's styling system, and our custom recipe props.
 */
export interface BadgeRootProps
  extends HTMLChakraProps<"div", BadgeRecipeProps> {}

const { withContext } = createRecipeContext({ recipe: badgeRecipe });

/**
 * Root component that provides the styling context for the Badge component.
 * Uses Chakra UI's recipe context system for consistent styling across instances.
 */
export const BadgeRoot = withContext<HTMLDivElement, BadgeRootProps>("div");
