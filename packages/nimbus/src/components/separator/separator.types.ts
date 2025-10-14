import type {
  RecipeProps,
  UnstyledProp,
  HTMLChakraProps,
} from "@chakra-ui/react";

// ============================================================
// RECIPE PROPS
// ============================================================

type SeparatorRecipeProps = RecipeProps<"separator"> & UnstyledProp;

// ============================================================
// SLOT PROPS
// ============================================================

export type SeparatorRootSlotProps = HTMLChakraProps<
  "div",
  SeparatorRecipeProps
>;

// ============================================================
// MAIN PROPS
// ============================================================

export type SeparatorProps = SeparatorRootSlotProps & {
  [key: `data-${string}`]: unknown;
  ref?: React.Ref<HTMLDivElement>;
};
