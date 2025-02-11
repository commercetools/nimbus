import type { AvatarRootProps } from "./avatar.slots";
import type { RecipeVariantProps } from "@chakra-ui/react";
import { avatarRecipe } from "./avatar.recipe";

/**
 * Combines the root props with Chakra UI's recipe variant props.
 * This allows the component to accept both structural props from Root
 * and styling variants from the recipe.
 */
type AvatarVariantProps = AvatarRootProps &
  RecipeVariantProps<typeof avatarRecipe>;

/**
 * Main props interface for the Avatar component.
 * Extends AvatarVariantProps to include both root props and variant props,
 * while adding support for React children.
 */
export interface AvatarProps extends AvatarVariantProps {
  children?: React.ReactNode;
}
