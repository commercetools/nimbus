import {
  type HTMLChakraProps,
  type RecipeProps,
  type UnstyledProp,
  createRecipeContext,
} from "@chakra-ui/react";

import {
  Tooltip as RATooltip,
  type TooltipProps as RATooltipProps,
} from "react-aria-components";

import { tooltipRecipe } from "./tooltip.recipe";
import type { TooltipProps } from "./tooltip.types";

/**
 * Base recipe props interface that combines Chakra UI's recipe props
 * with the unstyled prop option for the span element.
 */
interface TooltipRecipeProps
  extends RecipeProps<typeof RATooltip>,
    UnstyledProp {}

/**
 * Root props interface that extends Chakra's HTML props with our recipe props.
 * This creates a complete set of props for the root element, combining
 * HTML attributes, Chakra's styling system, and our custom recipe props.
 */
export interface TooltipRootProps
  extends HTMLChakraProps<typeof RATooltip, TooltipRecipeProps> {}

const { withContext } = createRecipeContext({ recipe: tooltipRecipe });

/**
 * Root component that provides the styling context for the Tooltip component.
 * Uses Chakra UI's recipe context system for consistent styling across instances.
 */
export const TooltipRoot = withContext<
  typeof RATooltip,
  TooltipRootProps & RATooltipProps
>(RATooltip);
