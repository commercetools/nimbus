import type {
  HTMLChakraProps,
  UnstyledProp,
  ConditionalValue,
} from "@chakra-ui/react";
import type { AriaLinkOptions } from "react-aria";
import type { LinkSize, LinkFontColor } from "./link.recipe";

// ============================================================
// RECIPE PROPS
// ============================================================

type LinkRecipeProps = {
  /**
   * Size variant of the link
   */
  size?: ConditionalValue<LinkSize | undefined>;
  /**
   * Font color variant of the link
   */
  fontColor?: ConditionalValue<LinkFontColor | undefined>;
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
