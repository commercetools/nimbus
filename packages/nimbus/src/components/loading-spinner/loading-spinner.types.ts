import type {
  HTMLChakraProps,
  UnstyledProp,
  ConditionalValue,
} from "@chakra-ui/react";
import type {
  LoadingSpinnerSize,
  LoadingSpinnerColorPalette,
} from "./loading-spinner.recipe";

// ============================================================
// RECIPE PROPS
// ============================================================

type LoadingSpinnerRecipeProps = {
  /**
   * Size variant of the loading spinner
   * @default "sm"
   */
  size?: ConditionalValue<LoadingSpinnerSize | undefined>;
} & UnstyledProp;

// ============================================================
// SLOT PROPS
// ============================================================

export type LoadingSpinnerRootSlotProps = Omit<
  HTMLChakraProps<"div", LoadingSpinnerRecipeProps>,
  "as" | "asChild" | "css" | "colorPalette"
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
