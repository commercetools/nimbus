import type { HTMLAttributes } from "react";
import type {
  HTMLChakraProps,
  RecipeProps,
  UnstyledProp,
} from "@chakra-ui/react";

type AvatarRecipeProps = RecipeProps<"avatar"> & UnstyledProp;

export type AvatarRootProps = HTMLChakraProps<"div", AvatarRecipeProps>;

export type AvatarComponentProps = HTMLAttributes<HTMLDivElement> & {
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
};

type AvatarRecipeVariantProps = {
  /**
   * Size variant
   * @default "md"
   */
  size?: "md" | "xs" | "2xs";
};

type FunctionalAvatarProps = AvatarRootProps &
  AvatarComponentProps &
  AvatarRecipeVariantProps;

export type AvatarProps = FunctionalAvatarProps & {
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
};
