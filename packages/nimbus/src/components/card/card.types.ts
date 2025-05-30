import type { CardRootProps } from "./card.slots";
import type { RecipeVariantProps } from "@chakra-ui/react";
import { cardRecipe } from "./card.recipe";

/**
 * Combines the root props with Chakra UI's recipe variant props.
 * This allows the component to accept both structural props from Root
 * and styling variants from the recipe.
 */
type CardVariantProps = CardRootProps &
  RecipeVariantProps<typeof cardRecipe> & {
    [key: `data-${string}`]: unknown;
  };

/**
 * Main props interface for the Card component.
 * Extends CardVariantProps to include both root props and variant props,
 * while adding support for React children.
 */
export interface CardProps extends CardVariantProps {
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
}
