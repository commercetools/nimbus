import type { BadgeRootProps } from "./badge.slots";
import type { RecipeVariantProps } from "@chakra-ui/react";
import { badgeRecipe } from "./badge.recipe";

/**
 * Combines the root props with Chakra UI's recipe variant props.
 * This allows the component to accept both structural props from Root
 * and styling variants from the recipe.
 */
type BadgeVariantProps = BadgeRootProps &
  RecipeVariantProps<typeof badgeRecipe> & {
    [key: `data-${string}`]: string;
  };
/**
 * Main props interface for the Badge component.
 * Extends BadgeVariantProps to include both root props and variant props,
 * while adding support for React children.
 */
export interface BadgeProps extends BadgeVariantProps {
  children?: React.ReactNode;
}
