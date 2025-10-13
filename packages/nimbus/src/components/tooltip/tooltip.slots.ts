import {
  type HTMLChakraProps,
  type RecipeProps,
  type UnstyledProp,
  createRecipeContext,
} from "@chakra-ui/react";

import { type TooltipProps as RATooltipProps } from "react-aria-components";

import { tooltipRecipe } from "./tooltip.recipe";

/**
 * Base recipe props interface that combines Chakra UI's recipe props
 */
interface TooltipRecipeProps extends RecipeProps<"div">, UnstyledProp {}

/**
 * Root props interface that extends Chakra's HTML props with our recipe props.
 * This creates a complete set of props for the root element, combining
 * HTML attributes, Chakra's styling system, and our custom recipe props.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface TooltipRootProps
  extends HTMLChakraProps<"div", TooltipRecipeProps> {}

const { withContext } = createRecipeContext({ recipe: tooltipRecipe });

/**
 * Root component that provides the styling context for the Tooltip component.
 * Uses Chakra UI's recipe context system for consistent styling across instances.
 */
export const TooltipRootSlot = withContext<
  HTMLDivElement,
  TooltipRootProps & RATooltipProps
>("div");
