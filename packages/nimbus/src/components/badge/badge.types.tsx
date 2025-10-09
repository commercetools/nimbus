import type {
  RecipeProps,
  UnstyledProp,
  HTMLChakraProps,
} from "@chakra-ui/react/styled-system";

/**
 * Base recipe props interface that combines Chakra UI's recipe props
 * with the unstyled prop option for the span element.
 */
export type BadgeRecipeProps = RecipeProps<"span"> & UnstyledProp;

/**
 * Root props interface that extends Chakra's HTML props with our recipe props.
 * This creates a complete set of props for the root element, combining
 * HTML attributes, Chakra's styling system, and our custom recipe props.
 */

export type BadgeRootProps = HTMLChakraProps<"span", BadgeRecipeProps>;

type BadgeRecipeVariantProps = {
  /**
   * Size variant
   * @default "md"
   */
  size?: "2xs" | "xs" | "md";
};

/**
 * Combines the root props with Chakra UI's recipe variant props.
 * This allows the component to accept both structural props from Root
 * and styling variants from the recipe.
 */
type BadgeVariantProps = BadgeRootProps &
  BadgeRecipeVariantProps & {
    [key: `data-${string}`]: string;
  };

/**
 * Main props interface for the Badge component.
 * Extends BadgeVariantProps to include both root props and variant props,
 * while adding support for React children.
 */
export type BadgeProps = BadgeVariantProps & {
  children?: React.ReactNode;
  ref?: React.Ref<HTMLSpanElement>;
};
