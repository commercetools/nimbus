import type { IconRootSlotProps } from "./icon.slots";
import type { BoxProps } from "../box";

type IconRecipeVariantProps = {
  /**
   * Size variant
   * @default "md"
   */
  size?: "2xs" | "xs" | "sm" | "md" | "lg" | "xl";
};

/**
 * Combines the root props with Chakra UI's recipe variant props.
 * This allows the component to accept both structural props from Root
 * and styling variants from the recipe.
 */
type IconVariantProps = IconRecipeVariantProps &
  Omit<
    IconRootSlotProps,
    | keyof React.SVGProps<SVGSVGElement> // excludes the 3 bazillion possible svg-props from the props-table
    | "css"
    | "unstyled"
    | "asChild"
    | "recipe"
    | "size"
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
  color?: BoxProps["color"];
  /**
   * Accepts a React component to be rendered as the icon .
   */
  as?: BoxProps["as"];
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
