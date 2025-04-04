import type {
  RecipeProps,
  UnstyledProp,
  HTMLChakraProps,
  RecipeVariantProps,
} from "@chakra-ui/react";
import { badgeRecipe } from "./badge.recipe";

/**
 * Base recipe props interface that combines Chakra UI's recipe props
 * with the unstyled prop option for the div element.
 */
export interface BadgeRecipeProps extends RecipeProps<"div">, UnstyledProp {}

/**
 * Root props interface that extends Chakra's HTML props with our recipe props.
 * This creates a complete set of props for the root element, combining
 * HTML attributes, Chakra's styling system, and our custom recipe props.
 */
export interface BadgeRootProps
  extends HTMLChakraProps<"div", BadgeRecipeProps> {}

/**
 * Combines the root props with Chakra UI's recipe variant props.
 * This allows the component to accept both structural props from Root
 * and styling variants from the recipe.
 */
type BadgeVariantProps = BadgeRootProps &
  RecipeVariantProps<typeof badgeRecipe>;

/**
 * Main props interface for the Badge component.
 * Extends BadgeVariantProps to include both root props and variant props,
 * while adding support for React children.
 */
export interface BadgeProps extends BadgeVariantProps {
  children?: React.ReactNode;
}
