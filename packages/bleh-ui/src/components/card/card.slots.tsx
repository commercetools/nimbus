import {
  type HTMLChakraProps,
  type RecipeProps,
  type UnstyledProp,
  createSlotRecipeContext,
} from "@chakra-ui/react";

import { cardRecipe } from "./card.recipe";

/**
 * Base recipe props interface that combines Chakra UI's recipe props
 * with the unstyled prop option for the div element.
 */
interface CardRecipeProps extends RecipeProps<"div">, UnstyledProp {}

/**
 * Root props interface that extends Chakra's HTML props with our recipe props.
 * This creates a complete set of props for the root element, combining
 * HTML attributes, Chakra's styling system, and our custom recipe props.
 */
export type CardRootProps = HTMLChakraProps<"div", CardRecipeProps>;

export type CardHeaderProps = HTMLChakraProps<"div", CardRecipeProps>;

export type CardContentProps = HTMLChakraProps<"div", CardRecipeProps>;

const { withProvider, withContext } = createSlotRecipeContext({
  recipe: cardRecipe,
});

/**
 * Root component that provides the styling context for the Card component.
 * Uses Chakra UI's recipe context system for consistent styling across instances.
 */
export const CardRoot = withProvider<HTMLDivElement, CardRootProps>(
  "div",
  "root"
);

export const CardHeader = withContext<HTMLDivElement, CardHeaderProps>(
  "div",
  "header"
);
export const CardContent = withContext<HTMLDivElement, CardContentProps>(
  "div",
  "content"
);
