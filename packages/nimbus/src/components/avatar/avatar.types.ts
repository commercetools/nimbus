import type { HTMLAttributes } from "react";
import type {
  HTMLChakraProps,
  RecipeProps,
  UnstyledProp,
} from "@chakra-ui/react/styled-system";
import type { OmitInternalProps } from "../../type-utils/omit-props";

// ============================================================
// RECIPE PROPS
// ============================================================

type AvatarRecipeProps = {
  /**
   * Size variant of the avatar
   * @default "md"
   */
  size?: RecipeProps<"nimbusAvatar">["size"];
} & UnstyledProp;

// ============================================================
// SLOT PROPS
// ============================================================

export type AvatarRootSlotProps = HTMLChakraProps<"div", AvatarRecipeProps>;

// ============================================================
// MAIN PROPS
// ============================================================

export type AvatarProps = OmitInternalProps<AvatarRootSlotProps> &
  HTMLAttributes<HTMLDivElement> & {
    /**
     * First name for generating initials
     */
    firstName: string;
    /**
     * Last name for generating initials
     */
    lastName: string;
    /**
     * Image source URL for the avatar
     */
    src?: string;
    /**
     * Alternative text for the avatar image
     */
    alt?: string;
    /**
     * Custom content to override default avatar rendering
     */
    children?: React.ReactNode;
    /**
     * Ref forwarding to the root element
     */
    ref?: React.Ref<HTMLDivElement>;
  };
