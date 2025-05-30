import type { LinkRootProps } from "./link.slots";
import type { RecipeVariantProps } from "@chakra-ui/react";
import type { AriaLinkOptions } from "react-aria";
import { linkRecipe } from "./link.recipe";

/**
 * Combines the root props with Chakra UI's recipe variant props.
 * This allows the component to accept both structural props from Root
 * and styling variants from the recipe.
 *
 * Differences between LinkRootProps and LinkVariantProps necessitate
 * the use of Omit and Pick to ensure the correct props are passed
 */
type LinkVariantProps = Omit<LinkRootProps, "onFocus" | "onBlur" | "onClick"> &
  Pick<AriaLinkOptions, "onFocus" | "onBlur" | "onClick"> &
  RecipeVariantProps<typeof linkRecipe> & {
    [key: `data-${string}`]: string;
  };
/**
 * Main props interface for the Link component.
 * Extends LinkVariantProps to include both root props and variant props,
 * while adding support for React children.
 */
export interface LinkProps extends LinkVariantProps {
  children?: React.ReactNode;
  ref?: React.Ref<HTMLAnchorElement>;
}
