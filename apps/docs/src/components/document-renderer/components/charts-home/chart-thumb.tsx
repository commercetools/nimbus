import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import { Box, Flex, Text } from "@commercetools/nimbus";

/**
 * Mounts its children only once the wrapper scrolls within `rootMargin` of the
 * viewport, then keeps them mounted. The charts gallery renders 47 live SVG
 * charts; mounting every one on first paint would stall the page, so each
 * thumbnail defers its (measure + draw) work until it is nearly on-screen and
 * reserves its height up front so the grid never reflows as charts stream in.
 */
export const InView = ({
  minHeight,
  children,
}: {
  minHeight: number;
  children: ReactNode;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (shown) return;
    const node = ref.current;
    if (!node) return;
    // No IntersectionObserver (old browser, jsdom) → render immediately.
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px 0px" }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [shown]);

  return (
    <Box ref={ref} minHeight={`${minHeight}px`}>
      {shown ? children : null}
    </Box>
  );
};

/**
 * Isolates a single thumbnail so a render error in one chart (bad data shape, a
 * chart that throws outside its provider, etc.) degrades to a small inline
 * notice instead of blanking the whole gallery.
 */
export class ThumbBoundary extends Component<
  { minHeight: number; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return (
        <Flex
          align="center"
          justify="center"
          minHeight={`${this.props.minHeight}px`}
          bg="neutral.2"
          borderRadius="200"
        >
          <Text textStyle="xs" color="neutral.9">
            Preview unavailable
          </Text>
        </Flex>
      );
    }
    return this.props.children;
  }
}
