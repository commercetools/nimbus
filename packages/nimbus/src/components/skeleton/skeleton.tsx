import { SkeletonRoot } from "./skeleton.slots";
import type { SkeletonProps } from "./skeleton.types";

/**
 * # Skeleton
 *
 * A loading placeholder that holds space for content while it loads.
 * Renders as a muted, optionally animated shape to reduce layout shift.
 * Decorative by default (`aria-hidden="true"`); reduced motion is respected.
 *
 * Two derivatives are built on top of this base and live under `derivatives/`:
 * `SkeletonText` (a paragraph of lines) and `SkeletonCircle` (an avatar-sized
 * circle).
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/feedback/skeleton}
 *
 * @supportsStyleProps
 */
export const Skeleton = (props: SkeletonProps) => {
  // `aria-hidden` needs a default; everything else (ref, shape, animation, and
  // all Chakra style props like width/height/borderRadius) flows straight
  // through to the recipe-styled root.
  const { ref, "aria-hidden": ariaHidden = true, ...rest } = props;

  return <SkeletonRoot ref={ref} aria-hidden={ariaHidden} {...rest} />;
};

Skeleton.displayName = "Skeleton";
