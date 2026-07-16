import type { OmitInternalProps } from "@/type-utils/omit-props";
import type { HTMLChakraProps } from "@chakra-ui/react/styled-system";
import type { SkeletonRecipeProps } from "../../skeleton.types";

// ============================================================
// MAIN PROPS
// ============================================================

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
   * so the default bar height (`0.75em`, ≈ the font's cap-height) and line
   * spacing (`calc(1lh - 0.75em)`) scale to give the same vertical rhythm as
   * real text of that style.
   * @default "body"
   */
  textStyle?: HTMLChakraProps<"div">["textStyle"];
  /**
   * Gap between lines (accepts Nimbus spacing tokens or CSS values). Defaults to
   * `calc(1lh - 0.75em)` so that bar height + gap sum to exactly one line-height
   * (`1lh`), matching the `textStyle`'s line pitch; pass an explicit value to
   * override.
   * @default "calc(1lh - 0.75em)"
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
