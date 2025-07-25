import {
  type HTMLChakraProps,
  type RecipeProps,
  type UnstyledProp,
  createRecipeContext,
} from "@chakra-ui/react";

import { kbdRecipe } from "./kbd.recipe";

/**
 * Base recipe props interface that combines Chakra UI's recipe props
 * with the unstyled prop option for the svg element.
 */
interface KbdRecipeProps extends RecipeProps<"kbd">, UnstyledProp {}

/**
 * Root props interface that extends Chakra's HTML props with our recipe props.
 * This creates a complete set of props for the root element, combining
 * HTML attributes, Chakra's styling system, and our custom recipe props.
 */
export interface KbdRootSlotProps
  extends HTMLChakraProps<"kbd", KbdRecipeProps> {}

const { withContext } = createRecipeContext({ recipe: kbdRecipe });

/**
 * Root component that provides the styling context for the Icon component.
 * Uses Chakra UI's recipe context system for consistent styling across instances.
 */
export const KbdRootSlot = withContext<HTMLElement, KbdRootSlotProps>("kbd");
