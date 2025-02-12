import type { HTMLAttributes } from "react";
import type { RecipeVariantProps } from "@chakra-ui/react";
import { avatarRecipe } from "./avatar.recipe.tsx";
import type { AvatarRootProps } from "./avatar.slots";
export interface AvatarComponentProps
  extends HTMLAttributes<HTMLDivElement>,
    RecipeVariantProps<typeof avatarRecipe> {
  /**
   * The name used to show initials
   */
  name: string;
  /**
   * The image URL
   */
  src?: string;
  /**
   * Alt text for the avatar image
   */
  alt?: string;
  /**
   * Callback when image fails to load
   */
  onError?: () => void;
  /**
   * Show border around avatar
   */
  showBorder?: boolean;
  /**
   * If the avatar is disabled
   */
  isDisabled?: boolean;
}

type FunctionalAvatarProps = AvatarRootProps & AvatarComponentProps;
export interface AvatarProps extends FunctionalAvatarProps {
  children?: React.ReactNode;
}
