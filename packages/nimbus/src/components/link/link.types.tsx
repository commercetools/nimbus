import type {
  HTMLChakraProps,
  RecipeProps,
  UnstyledProp,
} from "@chakra-ui/react";
import type { AriaLinkOptions } from "react-aria";

/**
 * Base recipe props interface that combines Chakra UI's recipe props
 * with the unstyled prop option for the a element.
 */
type LinkRecipeProps = RecipeProps<"link"> & UnstyledProp;
/**
 * Root props interface that extends Chakra's HTML props with our recipe props.
 * This creates a complete set of props for the root element, combining
 * HTML attributes, Chakra's styling system, and our custom recipe props.
 */
export type LinkRootProps = HTMLChakraProps<"a", LinkRecipeProps>;

/**
 * Combines the root props with Chakra UI's recipe variant props.
 * This allows the component to accept both structural props from Root
 * and styling variants from the recipe.
 *
 * Differences between LinkRootProps and LinkVariantProps necessitate
 * the use of Omit and Pick to ensure the correct props are passed
 */
type LinkVariantProps = Omit<LinkRootProps, "onFocus" | "onBlur" | "onClick"> &
  Pick<AriaLinkOptions, "onFocus" | "onBlur" | "onClick"> & {
    [key: `data-${string}`]: string;
  };
/**
 * Main props interface for the Link component.
 * Extends LinkVariantProps to include both root props and variant props,
 * while adding support for React children.
 */
export type LinkProps = LinkVariantProps & {
  children?: React.ReactNode;
  ref?: React.Ref<HTMLAnchorElement>;
};
