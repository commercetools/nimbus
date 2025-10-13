import type {
  HTMLChakraProps,
  RecipeProps,
  UnstyledProp,
} from "@chakra-ui/react";

/**
 * Base recipe props interface that combines Chakra UI's recipe props
 * with the unstyled prop option for the div element.
 */
type LoadingSpinnerRecipeProps = {
  size?: RecipeProps<"loadingSpinner">["size"];
  tone?: RecipeProps<"loadingSpinner">["tone"];
} & UnstyledProp;

/**
 * Root props interface that extends Chakra's HTML props with our recipe props.
 * This creates a complete set of props for the root element, combining
 * HTML attributes, Chakra's styling system, and our custom recipe props.
 */
export type LoadingSpinnerRootProps = Omit<
  HTMLChakraProps<"div", LoadingSpinnerRecipeProps>,
  // We want to omit polymorphic props from the root props since they are not used internally.
  "as" | "asChild"
>;

/**
 * Combines the root props with Chakra UI's recipe variant props and Aria's progress bar props.
 *
 * This allows the component to accept both structural props from Root
 * and styling variants from the recipe.
 */
type LoadingSpinnerVariantProps = LoadingSpinnerRootProps & {
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
