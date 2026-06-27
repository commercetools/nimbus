import { useRef } from "react";
import { Box } from "@chakra-ui/react/box";
import { useSlidingIndicator } from "@/hooks";
import type { SlidingIndicatorRects } from "@/hooks";
import { TabNavRootSlot } from "../tab-nav.slots";
import type { TabNavProps } from "../tab-nav.types";

/** Thickness of the sliding underline bar used by the `tabs` variant. */
const UNDERLINE_THICKNESS_PX = 2;

/**
 * # TabNav.Root
 *
 * The root container for the TabNav component. Renders a `<nav>` landmark
 * that provides the styling context for all child `TabNav.Item` links.
 *
 * Use this with `TabNav.Item` to build tab-styled navigation for route-based
 * navigation (not content-switching panels).
 *
 * ## Animated highlight
 *
 * Pass `animated` to render a single active-highlight indicator that slides
 * between items as the active item changes, instead of the static per-item
 * highlight. The indicator adapts to the variant:
 *
 * - `tabs` — a thin underline bar pinned to the active item's bottom edge.
 * - `filled` / `pill` — a full-height highlight painted behind the item label.
 *
 * The indicator is an `aria-hidden`, non-focusable element, so keyboard order,
 * focus rings, and `aria-current` are unaffected. Its position is driven by the
 * shared `useSlidingIndicator` hook (DOM-measured, kept in sync on active-item
 * and layout changes), and the slide is disabled under
 * `prefers-reduced-motion: reduce`.
 *
 * @supportsStyleProps
 */
export const TabNavRoot = (props: TabNavProps) => {
  const { animated, variant = "tabs", children, ref, ...rest } = props;

  const showIndicator =
    animated === true &&
    (variant === "tabs" || variant === "filled" || variant === "pill");

  // The `tabs` indicator is a thin underline bar pinned to the bottom edge;
  // `filled`/`pill` use a full-height highlight painted behind the label.
  const isUnderline = variant === "tabs";

  const indicatorRef = useRef<HTMLDivElement>(null);

  useSlidingIndicator({
    enabled: showIndicator,
    indicatorRef,
    activeSelector: '[aria-current="page"]',
    watchAttributes: ["aria-current"],
    itemSelector: "a",
    deps: [variant],
    getGeometry: ({ container, active }: SlidingIndicatorRects) => {
      const x = active.left - container.left;
      const y = active.top - container.top;
      if (isUnderline) {
        // Pin a thin bar to the active item's bottom edge.
        return {
          x,
          y: y + active.height - UNDERLINE_THICKNESS_PX,
          width: active.width,
          height: UNDERLINE_THICKNESS_PX,
        };
      }
      // Full-height highlight behind the label.
      return { x, y, width: active.width, height: active.height };
    },
  });

  return (
    <TabNavRootSlot
      ref={ref}
      variant={variant}
      // Ensure the absolutely-positioned indicator is anchored to the nav for
      // every variant (filled/pill already set this in the recipe).
      position={showIndicator ? "relative" : undefined}
      data-animated={showIndicator ? "true" : undefined}
      {...rest}
    >
      {showIndicator && (
        <Box
          ref={indicatorRef}
          aria-hidden="true"
          position="absolute"
          top="0"
          left="0"
          zIndex={0}
          opacity={0}
          pointerEvents="none"
          background={isUnderline ? "primary.9" : "colorPalette.3"}
          borderRadius={isUnderline ? "0" : variant === "pill" ? "full" : "200"}
          transition="transform 180ms ease, width 180ms ease, height 180ms ease, opacity 120ms ease"
          css={{
            "@media (prefers-reduced-motion: reduce)": {
              transition: "none",
            },
          }}
        />
      )}
      {children}
    </TabNavRootSlot>
  );
};

TabNavRoot.displayName = "TabNav.Root";
