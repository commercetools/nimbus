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
type ProgressBarVariantProps = ProgressBarRootProps & AriaProgressBarProps;

/**
 * Main props interface for the ProgressBar component.
 * Extends ProgressBarVariantProps to include root props, variant props, and aria props,
 * while adding custom props for label display and formatting.
 */
export interface ProgressBarProps extends ProgressBarVariantProps {
  /**
   * Ref forwarding to the root element
   */
  ref?: React.Ref<HTMLDivElement>;

  /**
   * Whether the progress bar represents an active, ongoing process that is being updated in real-time.
   * Set to true for dynamic progress (e.g., file uploads, downloads, loading operations).
   * Set to false for static progress indicators (e.g., showing step 3 of 5 in a wizard, completion percentage that won't change).
   * @default true
   */
  isDynamic?: boolean;
}
