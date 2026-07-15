import { Box as ChakraBox } from "@chakra-ui/react/box";
import { Skeleton } from "../../skeleton";
import type { SkeletonTextProps } from "./skeleton-text.types";

/**
 * # SkeletonText
 *
 * A stack of placeholder lines that approximates a paragraph of text while
 * content loads. The last line is narrower by default to mimic a real paragraph
 * ending. Composed of `Skeleton` lines; does not use its own recipe.
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/feedback/skeletontext}
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
