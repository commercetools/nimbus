/* eslint-disable @typescript-eslint/no-empty-object-type */
import {
  type HTMLChakraProps,
  createRecipeContext,
  type RecipeProps,
  type UnstyledProp,
} from "@chakra-ui/react";
import { toolbarRecipe } from "./toolbar.recipe";

const { withContext } = createRecipeContext({
  recipe: toolbarRecipe,
});

/**
 * Base recipe props interface that combines Chakra UI's recipe props
 * with the unstyled prop option for the toolbar recipe.
 */
interface ToolbarRecipeProps
  extends RecipeProps<typeof toolbarRecipe>,
    UnstyledProp {}

/**
 * Root props interface that extends Chakra's HTML props with our recipe props.
 * This creates a complete set of props for the root element, combining
 * HTML attributes, Chakra's styling system, and our custom recipe props.
 */
export interface ToolbarSlotProps
  extends HTMLChakraProps<"div", ToolbarRecipeProps> {}

/**
 * Slot component that provides the styling context for the Group component.
 * Uses Chakra UI's recipe context system for consistent styling across instances.
 */
export const ToolbarRoot = withContext<HTMLDivElement, ToolbarSlotProps>("div");
