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
    lastLineWidth = "60%",
    animation,
    "aria-hidden": ariaHidden = true,
    ...rest
  } = props;

  return (
    <ChakraBox
      ref={forwardedRef}
      display="flex"
      flexDirection="column"
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
          // Each line gets its own `textStyle`-sized line-box (`height: 1lh`)
          // with the bar vertically centered. Centering splits the leftover
          // leading (`1lh - 0.75em`) equally above and below the bar — mirroring
          // how CSS distributes a real line's leading — so bar centers align
          // with glyph centers. N rows sum to N×1lh, matching a real paragraph's
          // exact height, with the rhythm coming purely from the text style.
          <ChakraBox
            key={index}
            textStyle={textStyle}
            height="1lh"
            display="flex"
            alignItems="center"
          >
            <Skeleton
              width={isShortLastLine ? lastLineWidth : "100%"}
              // Bar height tracks the textStyle's cap-height (`0.75em` against
              // the line-box font-size).
              height="0.75em"
              animation={animation}
            />
          </ChakraBox>
        );
      })}
    </ChakraBox>
  );
};

SkeletonText.displayName = "SkeletonText";
