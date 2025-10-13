import type {
  HTMLChakraProps,
  SlotRecipeProps,
  UnstyledProp,
} from "@chakra-ui/react";

/**
 * Base recipe props interface that combines Chakra UI's recipe props
 * with the unstyled prop option for the div element.
 */
type CardRecipeProps = {
  cardPadding?: SlotRecipeProps<"card">["cardPadding"];
  borderStyle?: SlotRecipeProps<"card">["borderStyle"];
  elevation?: SlotRecipeProps<"card">["elevation"];
  backgroundStyle?: SlotRecipeProps<"card">["backgroundStyle"];
} & UnstyledProp;

/**
 * Root props interface that extends Chakra's HTML props with our recipe props.
 * This creates a complete set of props for the root element, combining
 * HTML attributes, Chakra's styling system, and our custom recipe props.
 */

export type CardRootProps = HTMLChakraProps<"div", CardRecipeProps>;

export type CardHeaderProps = HTMLChakraProps<"div">;

export type CardContentProps = HTMLChakraProps<"div">;

/**
 * Main props interface for the Card component.
 * Extends CardRecipeVariantProps to include both root props and variant props,
 * while adding support for React children.
 */
export type CardProps = CardRootProps & {
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
  [key: `data-${string}`]: unknown;
};
