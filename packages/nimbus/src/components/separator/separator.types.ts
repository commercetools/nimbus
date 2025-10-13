import type {
  RecipeProps,
  UnstyledProp,
  HTMLChakraProps,
} from "@chakra-ui/react";

/**
 * Base recipe props type that combines Chakra UI's recipe props
 * with the unstyled prop option for the div element.
 */
export type SeparatorRecipeProps = RecipeProps<"separator"> & UnstyledProp;

/**
 * Root props type that extends Chakra's HTML props with our recipe props.
 * This creates a complete set of props for the root element, combining
 * HTML attributes, Chakra's styling system, and our custom recipe props.
 */
export type SeparatorRootProps = HTMLChakraProps<"div", SeparatorRecipeProps>;

/**
 * Combines the root props with Chakra UI's recipe variant props.
 * This allows the component to accept both structural props from Root
 * and styling variants from the recipe.
 */
type SeparatorVariantProps = SeparatorRootProps & {
  [key: `data-${string}`]: unknown;
};

/**
 * Main props type for the Separator component.
 * Extends SeparatorVariantProps to include both root props and variant props,
 * while adding support for React Aria separator props.
 */
export type SeparatorProps = SeparatorVariantProps & {
  /** Reference to the separator element */
  ref?: React.Ref<HTMLDivElement>;
};
