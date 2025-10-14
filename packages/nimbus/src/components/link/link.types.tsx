import type {
  HTMLChakraProps,
  RecipeProps,
  UnstyledProp,
} from "@chakra-ui/react";
import type { AriaLinkOptions } from "react-aria";

// ============================================================
// RECIPE PROPS
// ============================================================

type LinkRecipeProps = {
  size?: RecipeProps<"link">["size"];
  fontColor?: RecipeProps<"link">["fontColor"];
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
  children?: React.ReactNode;
  ref?: React.Ref<HTMLAnchorElement>;
};
