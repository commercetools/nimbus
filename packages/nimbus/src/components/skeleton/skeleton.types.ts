import type { OmitInternalProps } from "../../type-utils/omit-props";
import type {
  HTMLChakraProps,
  UnstyledProp,
} from "@chakra-ui/react/styled-system";

// ============================================================
// RECIPE PROPS
// ============================================================

// The `shape`/`animation` unions are declared explicitly here rather than
// derived from `RecipeProps<"nimbusSkeleton">`. This avoids coupling the public
// API type to the generated Chakra theme typings (which only exist after
// `build-theme-typings`), keeps the type self-documenting, and is stable before
// the typings are regenerated. Keep these values in sync with the recipe's
// `variants.shape` / `variants.animation` blocks in skeleton.recipe.ts.
export type SkeletonRecipeProps = {
  /**
   * Shape variant of the skeleton placeholder.
   * - rectangle: default shape with small border radius (~4px)
   * - circle: fully-rounded with 1:1 aspect ratio
   * @default "rectangle"
   */
  shape?: "rectangle" | "circle";
  /**
   * Animation variant of the skeleton placeholder.
   * - pulse: opacity oscillation (default)
   * - wave: gradient shimmer sweep via ::after pseudo-element
   * - none: no animation
   * @default "pulse"
   */
  animation?: "pulse" | "wave" | "none";
} & UnstyledProp;

// ============================================================
// SLOT PROPS
// ============================================================

export type SkeletonRootSlotProps = HTMLChakraProps<"div", SkeletonRecipeProps>;

// ============================================================
// MAIN PROPS
// ============================================================

/**
 * Props for the Skeleton component.
 * Renders a single block-level loading placeholder element.
 * Accepts all standard Chakra UI style props for sizing and positioning
 * (e.g. `width`, `height`, `borderRadius`).
 */
export type SkeletonProps = OmitInternalProps<SkeletonRootSlotProps> & {
  /**
   * Whether the element is hidden from assistive technology.
   * Skeleton placeholders are decorative by default.
   * @default true
   */
  "aria-hidden"?: boolean | "true" | "false";
  /**
   * Ref forwarding to the root element.
   */
  ref?: React.Ref<HTMLDivElement>;
  /**
   * Data attributes for testing or custom metadata.
   */
  [key: `data-${string}`]: unknown;
};

/**
 * Props for the SkeletonText component.
 * Renders a stack of N placeholder lines to approximate a paragraph of text.
 *
 * Note: `shape` is intentionally absent — SkeletonText lines are always
 * rectangles. Use `Skeleton shape="circle"` or `SkeletonCircle` for circular
 * placeholders.
 */
export type SkeletonTextProps = OmitInternalProps<HTMLChakraProps<"div">> & {
  /**
   * Number of placeholder lines to render.
   * @default 3
   */
  lines?: number;
  /**
   * Nimbus text style the placeholder should visually match (e.g. `"body"`,
   * `"caption"`, `"3xl"`). Sets the container's `font-size` and `line-height`,
   * so the default bar height (`1em`) and line spacing (`calc(1lh - 1em)`) scale
   * to give the same vertical rhythm as real text of that style.
   * @default "body"
   */
  textStyle?: HTMLChakraProps<"div">["textStyle"];
  /**
   * Height of each placeholder line. Overrides the `textStyle`-derived height.
   * @default "1em"
   */
  lineHeight?: string | number;
  /**
   * Gap between lines (accepts Nimbus spacing tokens or CSS values). Defaults to
   * the `textStyle`'s leading (`line-height − font-size`) via the `1lh`/`1em`
   * units; pass an explicit value to override.
   * @default "calc(1lh - 1em)"
   */
  spacing?: string | number;
  /**
   * Width of the last line, narrower to mimic a paragraph ending.
   * @default "60%"
   */
  lastLineWidth?: string | number;
  /**
   * Animation forwarded to each Skeleton line.
   * @default "pulse"
   */
  animation?: SkeletonRecipeProps["animation"];
  /**
   * Whether the container is hidden from assistive technology.
   * @default true
   */
  "aria-hidden"?: boolean | "true" | "false";
  /**
   * Ref forwarding to the root container element.
   */
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * Props for the SkeletonCircle component.
 * Renders a circular loading placeholder sized by a single `size` prop.
 * Use `size` instead of `width`/`height` — SkeletonCircle maps `size` to equal
 * width and height automatically.
 */
export type SkeletonCircleProps = OmitInternalProps<
  HTMLChakraProps<"div">,
  "width" | "height"
> & {
  /**
   * Equal width and height of the circular placeholder.
   */
  size?: string | number;
  /**
   * Animation of the skeleton placeholder.
   * @default "pulse"
   */
  animation?: SkeletonRecipeProps["animation"];
  /**
   * Whether the element is hidden from assistive technology.
   * @default true
   */
  "aria-hidden"?: boolean | "true" | "false";
  /**
   * Ref forwarding to the root element.
   */
  ref?: React.Ref<HTMLDivElement>;
};
