import type { LoadingSpinnerRootProps } from "./loading-spinner.slots";

type LoadingSpinnerRecipeVariantProps = {
  /**
   * Size variant
   * @default "sm"
   */
  size?: "2xs" | "xs" | "sm" | "md" | "lg";
  /**
   * Tone variant
   * @default "primary"
   */
  tone?: "primary" | "white";
};

/**
 * Combines the root props with Chakra UI's recipe variant props and Aria's progress bar props.
 *
 * This allows the component to accept both structural props from Root
 * and styling variants from the recipe.
 */
type LoadingSpinnerVariantProps = LoadingSpinnerRootProps &
  LoadingSpinnerRecipeVariantProps & {
    [key: `data-${string}`]: string;
  };

/**
 * Main props interface for the LoadingSpinner component.
 * Extends LoadingSpinnerVariantProps to include both root props and variant props,
 * while adding support for React children.
 */
export type LoadingSpinnerProps = LoadingSpinnerVariantProps & {
  ref?: React.Ref<HTMLDivElement>;
};
