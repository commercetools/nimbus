import type {
  HTMLChakraProps,
  RecipeProps,
  UnstyledProp,
} from "@chakra-ui/react/styled-system";
import type { AriaLinkOptions } from "react-aria";

// ============================================================
// RECIPE PROPS
// ============================================================

type LinkRecipeProps = {
  /**
   * Size variant of the link
   */
  size?: RecipeProps<"nimbusLink">["size"];
  /**
   * Font color variant of the link
   */
  fontColor?: RecipeProps<"nimbusLink">["fontColor"];
} & UnstyledProp;

// ============================================================
// SLOT PROPS
// ============================================================

export type LinkRootSlotProps = HTMLChakraProps<"a", LinkRecipeProps>;

// ============================================================
// HELPER TYPES
// ============================================================

type LinkVariantProps = Omit<
  LinkRootSlotProps,
  "onFocus" | "onBlur" | "onClick"
> &
  Pick<AriaLinkOptions, "onFocus" | "onBlur" | "onClick"> & {
    [key: `data-${string}`]: string;
  };

// ============================================================
// MAIN PROPS
// ============================================================

export type LinkProps = LinkVariantProps & {
  /**
   * Content to display inside the link
   */
  children?: React.ReactNode;
  /**
   * Ref forwarding to the anchor element
   */
  ref?: React.Ref<HTMLAnchorElement>;
};
