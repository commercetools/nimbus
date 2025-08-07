import {
  type HTMLChakraProps,
  type RecipeProps,
  type UnstyledProp,
  createRecipeContext,
} from "@chakra-ui/react/styled-system";

import { linkRecipe } from "./link.recipe";

/**
 * Base recipe props interface that combines Chakra UI's recipe props
 * with the unstyled prop option for the a element.
 */
interface LinkRecipeProps extends RecipeProps<"a">, UnstyledProp {}

/**
 * Root props interface that extends Chakra's HTML props with our recipe props.
 * This creates a complete set of props for the root element, combining
 * HTML attributes, Chakra's styling system, and our custom recipe props.
 */
export type LinkRootProps = HTMLChakraProps<"a", LinkRecipeProps>;

const { withContext } = createRecipeContext({ recipe: linkRecipe });

/**
 * Root component that provides the styling context for the Link component.
 * Uses Chakra UI's recipe context system for consistent styling across instances.
 */
export const LinkRoot = withContext<HTMLAnchorElement, LinkRootProps>("a");
