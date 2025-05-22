import type { IconRootSlotProps } from "./icon.slots";
import type { RecipeVariantProps } from "@chakra-ui/react";
import { iconRecipe } from "./icon.recipe";
import type { BoxProps } from "../box";

/**
 * Combines the root props with Chakra UI's recipe variant props.
 * This allows the component to accept both structural props from Root
 * and styling variants from the recipe.
 */
type IconVariantProps = Omit<
  IconRootSlotProps,
  | keyof React.SVGProps<SVGSVGElement> // excludes the 3 bazillion possible svg-props from the props-table
  | "css"
  | "unstyled"
  | "asChild"
  | "recipe"
> &
  RecipeVariantProps<typeof iconRecipe>;

/**
 * Main props interface for the Icon component.
 * Extends IconVariantProps to include both root props and variant props,
 * while adding support for React children.
 */
export interface IconProps extends IconVariantProps {
  /**
   * Accepts only a single child - an icon-component or SVG html-element.
   * Alternatively, as shorthand, use the `as` property.
   */
  children?: React.ReactNode;
  /**
   * Colors the icon, accepts a color token from the theme or a custom value
   */
  color?: BoxProps["color"];
  /**
   * Accepts a React component to be rendered as the icon .
   */
  as?: BoxProps["as"];
  /**
   * Ref to the icon element
   */
  ref?: React.Ref<SVGSVGElement>;
}
