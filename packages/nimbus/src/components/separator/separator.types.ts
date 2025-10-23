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
  /**
   * Data attributes for testing or custom metadata
   */
  [key: `data-${string}`]: unknown;
  /**
   * Ref forwarding to the root element
   */
  ref?: React.Ref<HTMLDivElement>;
};
