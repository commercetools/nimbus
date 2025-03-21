import type { LoadingSpinnerRootProps } from "./loading-spinner.slots";
import type { RecipeVariantProps } from "@chakra-ui/react";
import { loadingSpinnerRecipe } from "./loading-spinner.recipe";
import type { AriaProgressBarProps } from "react-aria";

/**
 * Combines the root props with Chakra UI's recipe variant props and Aria's progress bar props.
 *
 * This allows the component to accept both structural props from Root
 * and styling variants from the recipe.
 */
type LoadingSpinnerVariantProps = LoadingSpinnerRootProps &
  AriaProgressBarProps &
  RecipeVariantProps<typeof loadingSpinnerRecipe>;

/**
 * Main props interface for the LoadingSpinner component.
 * Extends LoadingSpinnerVariantProps to include both root props and variant props,
 * while adding support for React children.
 */
export type LoadingSpinnerProps = LoadingSpinnerVariantProps;
