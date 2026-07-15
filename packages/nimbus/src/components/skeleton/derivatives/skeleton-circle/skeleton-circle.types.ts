import type { OmitInternalProps } from "@/type-utils/omit-props";
import type { HTMLChakraProps } from "@chakra-ui/react/styled-system";
import type { SkeletonRecipeProps } from "../../skeleton.types";

// ============================================================
// MAIN PROPS
// ============================================================

/**
 * Props for the SkeletonCircle component.
 * Renders a circular loading placeholder. Use the avatar-aligned `size` prop to
 * match an Avatar, or `boxSize` for a custom dimension — SkeletonCircle applies
 * whichever you set to equal width and height. `width`/`height` are omitted in
 * favor of these.
 */
export type SkeletonCircleProps = OmitInternalProps<
  HTMLChakraProps<"div">,
  "width" | "height"
> & {
  /**
   * Named circle size, aligned with the `Avatar` size scale
   * (`2xs` = 24px, `xs` = 32px, `md` = 40px). For a custom dimension use
   * `boxSize` instead. When neither is set, the circle defaults to `1em`.
   */
  size?: "2xs" | "xs" | "md";
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
