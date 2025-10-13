import type {
  HTMLChakraProps,
  RecipeProps,
  UnstyledProp,
} from "@chakra-ui/react";

/**
 * Base recipe props interface that combines Chakra UI's recipe props
 * with the unstyled prop option for the svg element.
 */
type IconRecipeProps = RecipeProps<"icon"> & UnstyledProp;

/**
 * Root props interface that extends Chakra's HTML props with our recipe props.
 * This creates a complete set of props for the root element, combining
 * HTML attributes, Chakra's styling system, and our custom recipe props.
 */

export type IconRootSlotProps = HTMLChakraProps<"svg", IconRecipeProps>;

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
>;

/**
 * Main props interface for the Icon component.
 * Extends IconVariantProps to include both root props and variant props,
 * while adding support for React children.
 */
export type IconProps = IconVariantProps & {
  /**
   * Accepts only a single child - an icon-component or SVG html-element.
   * Alternatively, as shorthand, use the `as` property.
   */
  children?: React.ReactNode;
  /**
   * Colors the icon, accepts a color token from the theme or a custom value
   */
  color?: IconRootSlotProps["color"];
  /**
   * Accepts a React component to be rendered as the icon .
   */
  as?: IconRootSlotProps["as"];
  /**
   * Ref to the icon element
   */
  ref?: React.Ref<SVGSVGElement>;

  /**
   * The slot to render the icon in.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/slot
   */
  slot?: string | null | undefined;
};
