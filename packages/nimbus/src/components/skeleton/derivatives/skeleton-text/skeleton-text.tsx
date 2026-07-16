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
    spacing = "calc(1lh - 0.75em)",
    lastLineWidth = "60%",
    animation,
    "aria-hidden": ariaHidden = true,
    ...rest
  } = props;

  return (
    // `textStyle` sets the container's font-size + line-height. Each bar is
    // `0.75em` tall (≈ the font's cap-height, the visual "mass" of a real line —
    // a full `1em` reads too heavy and its gap collapses on tight-leaded
    // headings) and the `calc(1lh - 0.75em)` gap makes bar + gap sum to exactly
    // one line-height (`1lh`), so the placeholder keeps the same vertical rhythm
    // as real text of the chosen style.
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
            // Bar height tracks the chosen `textStyle`'s cap-height (`0.75em`
            // against the container's font-size), so it follows the typography
            // rhythm rather than a separately tunable prop.
            height="0.75em"
            animation={animation}
          />
        );
      })}
    </ChakraBox>
  );
};

SkeletonText.displayName = "SkeletonText";
