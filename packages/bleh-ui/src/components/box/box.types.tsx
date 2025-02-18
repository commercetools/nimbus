import type { BoxRootProps } from "./box.slots";
import type { RecipeVariantProps } from "@chakra-ui/react";
import { boxRecipe } from "./box.recipe";

/**
 * Combines the root props with Chakra UI's recipe variant props.
 * This allows the component to accept both structural props from Root
 * and styling variants from the recipe.
 */
type BoxVariantProps = BoxRootProps & RecipeVariantProps<typeof boxRecipe>;

/**
 * Main props interface for the Box component.
 * Extends BoxVariantProps to include both root props and variant props,
 * while adding support for React children.
 */
export interface BoxProps extends BoxVariantProps {
  children?: React.ReactNode;
}
