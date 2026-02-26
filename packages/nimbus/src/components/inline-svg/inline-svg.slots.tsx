import {
  type HTMLChakraProps,
  type RecipeProps,
  type UnstyledProp,
  createRecipeContext,
} from "@chakra-ui/react/styled-system";

import { iconRecipe } from "../icon/icon.recipe";

/**
 * Base recipe props interface that combines Chakra UI's recipe props
 * with the unstyled prop option for the svg element.
 * We reuse the icon recipe for consistent styling with Icon component.
 */
type InlineSvgRecipeProps = RecipeProps<"svg"> & UnstyledProp;

/**
 * Root props interface that extends Chakra's HTML props with our recipe props.
 * This creates a complete set of props for the root element, combining
 * HTML attributes, Chakra's styling system, and our custom recipe props.
 */

export type InlineSvgRootSlotProps = HTMLChakraProps<
  "svg",
  InlineSvgRecipeProps
>;

const { withContext } = createRecipeContext({ recipe: iconRecipe });

/**
 * Root component that provides the styling context for the InlineSvg component.
 * Uses Chakra UI's recipe context system for consistent styling across instances.
 * Reuses the icon recipe to maintain consistency with the Icon component.
 */
export const InlineSvgRootSlot = withContext<
  SVGSVGElement,
  InlineSvgRootSlotProps
>("svg");
