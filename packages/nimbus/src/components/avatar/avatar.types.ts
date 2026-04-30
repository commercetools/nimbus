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
     * First name used to generate initials. Optional — empty,
     * whitespace-only, or omitted values are handled gracefully and the
     * component falls back to `lastName` (if usable) or to the `Person`
     * icon when neither name yields a usable character.
     */
    firstName?: string;
    /**
     * Last name used to generate initials. Optional — empty,
     * whitespace-only, or omitted values are handled gracefully and the
     * component falls back to `firstName` (if usable) or to the `Person`
     * icon when neither name yields a usable character.
     */
    lastName?: string;
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
