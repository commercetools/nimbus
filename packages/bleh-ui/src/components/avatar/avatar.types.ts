import type { HTMLAttributes } from "react";
import type { RecipeVariantProps } from "@chakra-ui/react";
import { avatarRecipe } from "./avatar.recipe.tsx";
import type { AvatarRootProps } from "./avatar.slots";
export interface AvatarComponentProps
  extends HTMLAttributes<HTMLDivElement>,
    RecipeVariantProps<typeof avatarRecipe> {
  /**
   * The first name used to show initials
   */
  firstName: string;
  /**
   * The last name used to show initials
   */
  lastName: string;
  /**
   * The image URL
   */
  src?: string;
  /**
   * Alt text for the avatar image
   */
  alt?: string;
  /**
   * If the avatar is disabled
   */
  isDisabled?: boolean;
}

type FunctionalAvatarProps = AvatarRootProps & AvatarComponentProps;
export interface AvatarProps extends FunctionalAvatarProps {
  children?: React.ReactNode;
}
