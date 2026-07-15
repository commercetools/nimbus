import { Skeleton } from "../../skeleton";
import type { SkeletonCircleProps } from "./skeleton-circle.types";

/**
 * Avatar-aligned named sizes for {@link SkeletonCircle}. Kept in sync with the
 * `size` variant in `avatar.recipe.ts` (2xs = 24px, xs = 32px, md = 40px) so a
 * SkeletonCircle can stand in for an Avatar at the same dimensions.
 */
const avatarSizeScale = {
  "2xs": "600",
  xs: "800",
  md: "1000",
} as const;

/**
 * # SkeletonCircle
 *
 * A circular loading placeholder sized by a single `size` prop applied equally
 * to width and height. Sugar over `Skeleton` with `shape="circle"`.
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/feedback/skeletoncircle}
 *
 * @supportsStyleProps
 */
export const SkeletonCircle = (props: SkeletonCircleProps) => {
  const {
    ref: forwardedRef,
    size,
    boxSize,
    animation,
    "aria-hidden": ariaHidden = true,
    ...rest
  } = props;

  // Precedence: a named avatar-aligned `size` wins; otherwise a custom
  // `boxSize`; otherwise default to a 1em circle (matches the current text
  // line height, useful inline).
  const dimension = size ? avatarSizeScale[size] : (boxSize ?? "1em");

  return (
    <Skeleton
      ref={forwardedRef}
      shape="circle"
      width={dimension}
      height={dimension}
      animation={animation}
      aria-hidden={ariaHidden}
      {...rest}
    />
  );
};

SkeletonCircle.displayName = "SkeletonCircle";
