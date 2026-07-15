import { useRef } from "react";
import { useObjectRef, mergeProps } from "react-aria";
import { Box as ChakraBox } from "@chakra-ui/react/box";
import { SkeletonRoot } from "./skeleton.slots";
import type {
  SkeletonProps,
  SkeletonTextProps,
  SkeletonCircleProps,
} from "./skeleton.types";
import { mergeRefs } from "@/utils";

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
  const {
    ref: forwardedRef,
    shape,
    animation,
    width,
    height,
    borderRadius,
    "aria-hidden": ariaHidden = true,
    ...rest
  } = props;

  const localRef = useRef<HTMLDivElement>(null);
  const ref = useObjectRef(mergeRefs(localRef, forwardedRef));

  return (
    <SkeletonRoot
      {...mergeProps(rest, {
        ref,
        shape,
        animation,
        width,
        height,
        borderRadius,
        "aria-hidden": ariaHidden,
      })}
    />
  );
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
    animation = "pulse",
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
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton
          key={index}
          width={index === lines - 1 ? lastLineWidth : "100%"}
          height={lineHeight}
          animation={animation}
        />
      ))}
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
    animation,
    "aria-hidden": ariaHidden = true,
    ...rest
  } = props;

  return (
    <Skeleton
      ref={forwardedRef}
      shape="circle"
      width={size}
      height={size}
      animation={animation}
      aria-hidden={ariaHidden}
      {...rest}
    />
  );
};

SkeletonCircle.displayName = "SkeletonCircle";
