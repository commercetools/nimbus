import type { AlertRootDivProps, AlertRootCardProps } from "./alert.slots";
import type { RecipeVariantProps } from "@chakra-ui/react";
import { alertRecipe } from "./alert.recipe";

/**
 * Combines the root props with Chakra UI's recipe variant props.
 * This allows the component to accept both structural props from Root
 * and styling variants from the recipe.
 */
type AlertVariantProps = AlertRootDivProps &
  AlertRootCardProps &
  RecipeVariantProps<typeof alertRecipe>;

/**
 * Main props interface for the Alert component.
 * Extends AlertVariantProps to include both root props and variant props,
 * while adding support for React children.
 */
export interface AlertProps extends AlertVariantProps {
  children?: React.ReactNode;
}
