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
  /**
   * Visual style variant of the avatar
   * @default "subtle"
   */
  variant?: RecipeProps<"nimbusAvatar">["variant"];
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
     * Custom content (e.g. an icon) to override the default avatar rendering.
     * Takes **unconditional precedence**: when `children` is provided, `src` is
     * ignored — the image is never rendered and its `onLoad`/`onError` never
     * fire. Use `children` for a bespoke avatar, not as a fallback shown while
     * `src` loads.
     */
    children?: React.ReactNode;
    /**
     * Ref forwarding to the root element
     */
    ref?: React.Ref<HTMLDivElement>;
  };
