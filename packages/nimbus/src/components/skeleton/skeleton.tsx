import { Box as ChakraBox } from "@chakra-ui/react/box";
import { SkeletonRoot } from "./skeleton.slots";
import type {
  SkeletonProps,
  SkeletonTextProps,
  SkeletonCircleProps,
} from "./skeleton.types";

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
 * # Skeleton
 *
 * A loading placeholder that holds space for content while it loads.
 * Renders as a muted, optionally animated shape to reduce layout shift.
 * Decorative by default (`aria-hidden="true"`); reduced motion is respected.
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

/**
 * # SkeletonText
 *
 * A stack of placeholder lines that approximates a paragraph of text while
 * content loads. The last line is narrower by default to mimic a real paragraph
 * ending. Composed of `Skeleton` lines; does not use its own recipe.
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/feedback/skeleton}
 *
 * @supportsStyleProps
 */
export const SkeletonText = (props: SkeletonTextProps) => {
  const {
    ref: forwardedRef,
    lines = 3,
    textStyle = "body",
    lineHeight = "1em",
    spacing = "calc(1lh - 1em)",
    lastLineWidth = "60%",
    animation,
    "aria-hidden": ariaHidden = true,
    ...rest
  } = props;

  return (
    // `textStyle` sets the container's font-size + line-height, so each line's
    // `1em` height and the `calc(1lh - 1em)` gap resolve to that style's glyph
    // size and leading — giving the placeholder the same vertical rhythm as real
    // text of the chosen style.
    <ChakraBox
      ref={forwardedRef}
      display="flex"
      flexDirection="column"
      textStyle={textStyle}
      gap={spacing}
      aria-hidden={ariaHidden}
      {...rest}
    >
      {Array.from({ length: lines }, (_, index) => {
        // Only the last line is narrowed (to mimic a paragraph ending). The
        // first line always spans the full width, so a single-line skeleton
        // isn't rendered arbitrarily short; narrow the whole block via the
        // container's `width` prop instead.
        const isShortLastLine = index === lines - 1 && index !== 0;
        return (
          <Skeleton
            key={index}
            width={isShortLastLine ? lastLineWidth : "100%"}
            height={lineHeight}
            animation={animation}
          />
        );
      })}
    </ChakraBox>
  );
};

SkeletonText.displayName = "SkeletonText";

/**
 * # SkeletonCircle
 *
 * A circular loading placeholder sized by a single `size` prop applied equally
 * to width and height. Sugar over `Skeleton` with `shape="circle"`.
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/feedback/skeleton}
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
