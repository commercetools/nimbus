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
