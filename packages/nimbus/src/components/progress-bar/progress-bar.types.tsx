import type {
  RecipeProps,
  UnstyledProp,
  HTMLChakraProps,
  RecipeVariantProps,
} from "@chakra-ui/react";
import type { AriaProgressBarProps } from "react-aria";
import { progressBarSlotRecipe } from "./progress-bar.recipe.tsx";

/**
 * Base recipe props interface that combines Chakra UI's recipe props
 * with the unstyled prop option for the div element.
 */
export interface ProgressBarRecipeProps
  extends RecipeProps<"div">,
    UnstyledProp {}

/**
 * Root props interface that extends Chakra's HTML props with our recipe props.
 * This creates a complete set of props for the root element, combining
 * HTML attributes, Chakra's styling system, and our custom recipe props.
 */
export interface ProgressBarRootProps
  extends HTMLChakraProps<"div", ProgressBarRecipeProps>,
    RecipeVariantProps<typeof progressBarSlotRecipe> {}

/**
 * Combines the root props with Chakra UI's recipe variant props and Aria's progress bar props.
 * This allows the component to accept both structural props from Root,
 * styling variants from the recipe, and accessibility props from react-aria.
 */
type ProgressBarVariantProps = ProgressBarRootProps &
  RecipeVariantProps<typeof progressBarSlotRecipe> &
  AriaProgressBarProps & {
    [key: `data-${string}`]: string;
  };

/**
 * Main props interface for the ProgressBar component.
 * Extends ProgressBarVariantProps to include root props, variant props, and aria props,
 * while adding custom props for label display and formatting.
 */
export interface ProgressBarProps extends ProgressBarVariantProps {
  /**
   * The progress value (0-100 for determinate progress).
   * If undefined, the progress bar will be in indeterminate state.
   */
  value?: number;

  /**
   * The minimum value (default: 0)
   */
  minValue?: number;

  /**
   * The maximum value (default: 100)
   */
  maxValue?: number;

  /**
   * Whether the progress is indeterminate (loading state)
   */
  isIndeterminate?: boolean;

  /**
   * The label text to display
   */
  label?: string;

  /**
   * Custom formatter for the value display
   * Defaults to percentage format (e.g., "75%")
   */
  formatOptions?: Intl.NumberFormatOptions;

  /**
   * Text display variant: hidden, inline, or stacked
   */
  variant?: "hidden" | "inline" | "stacked";

  /**
   * Color palette for the progress bar
   */
  colorPalette?: string;

  /**
   * Size variant
   */
  size?: "2xs" | "md";

  /**
   * Ref forwarding to the root element
   */
  ref?: React.Ref<HTMLDivElement>;
}
