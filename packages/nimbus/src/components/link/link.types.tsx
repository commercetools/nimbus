import type {
  HTMLChakraProps,
  RecipeProps,
  UnstyledProp,
} from "@chakra-ui/react";
import type { LinkProps as RaLinkProps } from "react-aria-components";

// ============================================================
// RECIPE PROPS
// ============================================================

type LinkRecipeProps = {
  /**
   * Size variant of the link
   */
  size?: RecipeProps<"link">["size"];
  /**
   * Font color variant of the link
   */
  fontColor?: RecipeProps<"link">["fontColor"];
} & UnstyledProp;

// ============================================================
// SLOT PROPS
// ============================================================

export type LinkRootSlotProps = HTMLChakraProps<"a", LinkRecipeProps>;

// ============================================================
// HELPER TYPES
// ============================================================

type ExcludedLinkProps = "className" | "style";

// ============================================================
// MAIN PROPS
// ============================================================

export type LinkProps = Omit<LinkRootSlotProps, ExcludedLinkProps> &
  Omit<RaLinkProps, ExcludedLinkProps> & {
    /**
     * Content to display inside the link
     */
    children?: React.ReactNode;
    /**
     * Ref forwarding to the anchor element
     */
    ref?: React.Ref<HTMLAnchorElement>;
  };
