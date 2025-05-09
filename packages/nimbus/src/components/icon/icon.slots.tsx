import {
  type HTMLChakraProps,
  type RecipeProps,
  type UnstyledProp,
  createRecipeContext,
} from "@chakra-ui/react";

import { iconRecipe } from "./icon.recipe";

/**
 * Base recipe props interface that combines Chakra UI's recipe props
 * with the unstyled prop option for the svg element.
 */
interface IconRecipeProps extends RecipeProps<"svg">, UnstyledProp {}

/**
 * Root props interface that extends Chakra's HTML props with our recipe props.
 * This creates a complete set of props for the root element, combining
 * HTML attributes, Chakra's styling system, and our custom recipe props.
 */
export interface IconRootSlotProps
  extends HTMLChakraProps<"svg", IconRecipeProps> {}

const { withContext } = createRecipeContext({ recipe: iconRecipe });

/**
 * Root component that provides the styling context for the Icon component.
 * Uses Chakra UI's recipe context system for consistent styling across instances.
 */
export const IconRootSlot = withContext<SVGSVGElement, IconRootSlotProps>(
  "svg"
);
