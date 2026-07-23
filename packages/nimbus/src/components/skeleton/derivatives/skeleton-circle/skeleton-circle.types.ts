import type { OmitInternalProps } from "@/type-utils/omit-props";
import type { SkeletonRootSlotProps } from "../../skeleton.types";

// ============================================================
// MAIN PROPS
// ============================================================

/**
 * Props for the SkeletonCircle component.
 *
 * A circular loading placeholder. Inherits the base `Skeleton` props: use the
 * avatar-aligned `size` prop (`2xs`/`xs`/`md`) to match an `Avatar`, or a
 * `boxSize` style prop for a custom dimension. `width`/`height` and `shape` are
 * omitted — it always renders as a circle, and defaults to `1em` when unsized.
 */
export type SkeletonCircleProps = OmitInternalProps<
  SkeletonRootSlotProps,
  "width" | "height" | "shape"
> & {
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
