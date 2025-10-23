import type {
  HTMLChakraProps,
  RecipeProps,
  UnstyledProp,
} from "@chakra-ui/react";
import type { SemanticPalettesOnly } from "../../type-utils/shared-types";

// ============================================================
// RECIPE PROPS
// ============================================================

type LoadingSpinnerRecipeProps = {
  /**
   * Size variant of the loading spinner
   * @default "sm"
   */
  size?: RecipeProps<"loadingSpinner">["size"];
} & UnstyledProp;

// ============================================================
// SLOT PROPS
// ============================================================

export type LoadingSpinnerRootSlotProps = Omit<
  HTMLChakraProps<"div", LoadingSpinnerRecipeProps>,
  "as" | "asChild" | "colorPalette"
> & {
  colorPalette?: "primary" | "white";
};

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
  /**
   * Ref forwarding to the root element
   */
  ref?: React.Ref<HTMLDivElement>;
};
