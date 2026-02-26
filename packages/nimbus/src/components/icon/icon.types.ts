import type {
  HTMLChakraProps,
  RecipeProps,
  UnstyledProp,
} from "@chakra-ui/react/styled-system";

// ============================================================
// RECIPE PROPS
// ============================================================

type IconRecipeProps = RecipeProps<"nimbusIcon"> & UnstyledProp;

// ============================================================
// SLOT PROPS
// ============================================================

export type IconRootSlotProps = HTMLChakraProps<"svg", IconRecipeProps>;

// ============================================================
// HELPER TYPES
// ============================================================

type IconVariantProps = Omit<
  IconRootSlotProps,
  | keyof React.SVGProps<SVGSVGElement>
  | "css"
  | "unstyled"
  | "asChild"
  | "recipe"
>;

// ============================================================
// MAIN PROPS
// ============================================================
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
