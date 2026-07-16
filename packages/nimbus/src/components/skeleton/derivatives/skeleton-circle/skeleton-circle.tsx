import { Skeleton } from "../../skeleton";
import type { SkeletonCircleProps } from "./skeleton-circle.types";

/**
 * # SkeletonCircle
 *
 * A circular loading placeholder. Sugar over `Skeleton` with `shape="circle"`:
 * size it with the avatar-aligned `size` prop (inherited from `Skeleton`) to
 * stand in for an `Avatar`, or with a `boxSize` style prop for a custom
 * dimension. Defaults to a `1em` circle, useful inline.
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/feedback/skeletoncircle}
 *
 * @supportsStyleProps
 */
export const SkeletonCircle = (props: SkeletonCircleProps) => {
  const {
    ref: forwardedRef,
    "aria-hidden": ariaHidden = true,
    ...rest
  } = props;

  // Default to a 1em circle only when the consumer hasn't sized it — via the
  // avatar-aligned `size` variant (inherited from Skeleton) or a native
  // `boxSize` style prop. Applied before `...rest` so either of those wins.
  const isSized = rest.size != null || rest.boxSize != null;

  return (
    <Skeleton
      ref={forwardedRef}
      shape="circle"
      aria-hidden={ariaHidden}
      {...(isSized ? {} : { boxSize: "1em" })}
      {...rest}
    />
  );
};

SkeletonCircle.displayName = "SkeletonCircle";
