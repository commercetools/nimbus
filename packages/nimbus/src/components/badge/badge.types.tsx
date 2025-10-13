import type {
  RecipeProps,
  UnstyledProp,
  HTMLChakraProps,
} from "@chakra-ui/react";

/**
 * Base recipe props interface that combines Chakra UI's recipe props
 * with the unstyled prop option for the span element.
 */
export type BadgeRecipeProps = {
  size?: RecipeProps<"badge">["size"];
} & UnstyledProp;

/**
 * Root props interface that extends Chakra's HTML props with our recipe props.
 * This creates a complete set of props for the root element, combining
 * HTML attributes, Chakra's styling system, and our custom recipe props.
 */
export type BadgeRootProps = HTMLChakraProps<"span", BadgeRecipeProps>;

/**
 * Main props interface for the Badge component.
 * Extends BadgeVariantProps to include both root props and variant props,
 * while adding support for React children.
 */
export type BadgeProps = BadgeRootProps & {
  children?: React.ReactNode;
  ref?: React.Ref<HTMLSpanElement>;
  [key: `data-${string}`]: string;
};
