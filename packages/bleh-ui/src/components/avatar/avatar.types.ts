import type { HTMLAttributes } from "react";
import type { RecipeVariantProps } from "@chakra-ui/react";
import { avatarRecipe } from "./avatar.recipe.tsx";

export interface AvatarProps
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
   * The size of the avatar
   */
  size?: "md" | "2xs" | "xs";
  /**
   * The variant style of the avatar
   */
  variant?: "default" | "focused" | "disabled";
  /**
   * The color palette to use for the avatar
   */
  tone?: "primary" | "critical" | "neutral";
  /**
   * If the avatar is disabled
   */
  isDisabled?: boolean;
}
