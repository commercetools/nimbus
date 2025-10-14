import type {
  HTMLChakraProps,
  RecipeProps,
  UnstyledProp,
} from "@chakra-ui/react";

// ============================================================
// RECIPE PROPS
// ============================================================

type LoadingSpinnerRecipeProps = {
  size?: RecipeProps<"loadingSpinner">["size"];
  tone?: RecipeProps<"loadingSpinner">["tone"];
} & UnstyledProp;

// ============================================================
// SLOT PROPS
// ============================================================

export type LoadingSpinnerRootSlotProps = Omit<
  HTMLChakraProps<"div", LoadingSpinnerRecipeProps>,
  "as" | "asChild"
>;

// ============================================================
// HELPER TYPES
// ============================================================

type LoadingSpinnerVariantProps = LoadingSpinnerRootSlotProps & {
  [key: `data-${string}`]: string;
};

// ============================================================
// MAIN PROPS
// ============================================================

export type LoadingSpinnerProps = LoadingSpinnerVariantProps & {
  ref?: React.Ref<HTMLDivElement>;
};
