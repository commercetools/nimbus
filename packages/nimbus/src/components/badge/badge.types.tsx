import type {
  RecipeProps,
  UnstyledProp,
  HTMLChakraProps,
} from "@chakra-ui/react";

// ============================================================
// RECIPE PROPS
// ============================================================

type BadgeRecipeProps = {
  size?: RecipeProps<"badge">["size"];
} & UnstyledProp;

// ============================================================
// SLOT PROPS
// ============================================================

export type BadgeRootSlotProps = HTMLChakraProps<"span", BadgeRecipeProps>;

// ============================================================
// MAIN PROPS
// ============================================================

export type BadgeProps = BadgeRootSlotProps & {
  children?: React.ReactNode;
  ref?: React.Ref<HTMLSpanElement>;
  [key: `data-${string}`]: string;
};
