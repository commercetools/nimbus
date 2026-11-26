import {
  Children,
  useCallback,
  useEffect,
  useRef,
  useState,
  type FC,
  type ReactNode,
} from "react";
import { Box, Flex, IconButton, Text } from "@commercetools/nimbus";
import { ChevronLeft, ChevronRight } from "@commercetools/nimbus-icons";

type CarouselProps = {
  /** visible label of the carousel; also its accessible name */
  label: string;
  /** the slides; every child is one slide */
  children: ReactNode;
};

/** Width of the fade at a side of the row that has more slides behind it. */
const FADE_WIDTH = "48px";

/**
 * Row of slides that scrolls sideways and snaps to the start of a slide.
 * Previous and next buttons scroll by one view; they are disabled at the ends
 * and hidden when all slides fit. Scrolling with touch, trackpad or the
 * keyboard (focus moves into the slides) works without the buttons.
 */
export const Carousel: FC<CarouselProps> = ({ label, children }) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollBack, setCanScrollBack] = useState(false);
  const [canScrollForward, setCanScrollForward] = useState(false);

  const update = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanScrollBack(el.scrollLeft > 1);
    setCanScrollForward(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [update, children]);

  const scrollByView = (direction: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    el.scrollBy({
      left: direction * el.clientWidth * 0.8,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  const hasOverflow = canScrollBack || canScrollForward;

  // Opaque in the middle. A side fades to transparent only when slides are
  // hidden behind it, so the first slide is not faded at the start.
  const fadeMask = `linear-gradient(to right, ${
    canScrollBack ? `transparent 0, black ${FADE_WIDTH}` : "black 0"
  }, ${
    canScrollForward ? `black calc(100% - ${FADE_WIDTH}), transparent` : "black"
  })`;

  return (
    <Box as="section" aria-label={label}>
      <Flex alignItems="center" justifyContent="space-between" mb="200">
        <Text textStyle="md" fontWeight="600" color="neutral.11">
          {label}
        </Text>
        {hasOverflow && (
          <Flex gap="100">
            <IconButton
              aria-label="Previous"
              size="xs"
              variant="ghost"
              isDisabled={!canScrollBack}
              onPress={() => scrollByView(-1)}
            >
              <ChevronLeft />
            </IconButton>
            <IconButton
              aria-label="Next"
              size="xs"
              variant="ghost"
              isDisabled={!canScrollForward}
              onPress={() => scrollByView(1)}
            >
              <ChevronRight />
            </IconButton>
          </Flex>
        )}
      </Flex>
      <Flex
        as="ul"
        ref={scrollerRef}
        onScroll={update}
        gap="300"
        listStyle="none"
        m="0"
        p="1"
        // Room for the focus ring, which the scroll area would clip
        mx="-1"
        overflowX="auto"
        css={{
          scrollSnapType: "x proximity",
          // Fade out the edge that has more slides behind it
          ...(hasOverflow && {
            maskImage: fadeMask,
            WebkitMaskImage: fadeMask,
          }),
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
          "@media (prefers-reduced-motion: no-preference)": {
            scrollBehavior: "smooth",
          },
        }}
      >
        {Children.map(children, (child) => (
          <Box as="li" flexShrink="0" css={{ scrollSnapAlign: "start" }}>
            {child}
          </Box>
        ))}
      </Flex>
    </Box>
  );
};
