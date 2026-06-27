import { useRef } from "react";
import { Box } from "@chakra-ui/react/box";
import { useSlidingIndicator } from "@/hooks";
import type { SlidingIndicatorRects } from "@/hooks";
import { TabNavRootSlot } from "../tab-nav.slots";
import type { TabNavProps } from "../tab-nav.types";

/** Thickness of the sliding underline bar used by the `underline` variant. */
const UNDERLINE_THICKNESS_PX = 2;

/** Deprecated variant aliases → their replacement. */
const VARIANT_ALIASES: Record<string, "underline" | "rounded" | "pill"> = {
  tabs: "underline",
};

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
 * The active highlight is a single indicator that slides between items as the
 * active item changes. It adapts to the variant:
 *
 * - `underline` — a thin bar pinned to the active item's bottom edge.
 * - `rounded` / `pill` — a full-height highlight painted behind the item label.
 *
 * The indicator is an `aria-hidden`, non-focusable element driven by the shared
 * `useSlidingIndicator` hook (DOM-measured, kept in sync on active-item and
 * layout changes), so keyboard order, focus rings, and `aria-current` are
 * unaffected. The slide is disabled under `prefers-reduced-motion: reduce` (the
 * highlight snaps), and the recipe's static marker is the SSR / no-JS fallback.
 *
 * @supportsStyleProps
 */
export const TabNavRoot = (props: TabNavProps) => {
  const { variant: variantProp, children, ref, ...rest } = props;

  // Resolve deprecated aliases (e.g. `tabs` → `underline`) to the real variant.
  const variant =
    typeof variantProp === "string"
      ? (VARIANT_ALIASES[variantProp] ?? variantProp)
      : variantProp;

  // Stable string used for indicator geometry/styling and effect deps. A
  // responsive `variant` object falls back to the default look for the slider.
  const variantName = typeof variant === "string" ? variant : "underline";
  const isUnderline = variantName === "underline";
  const isPill = variantName === "pill";

  const indicatorRef = useRef<HTMLDivElement>(null);

  useSlidingIndicator({
    enabled: true,
    indicatorRef,
    activeSelector: '[aria-current="page"]',
    watchAttributes: ["aria-current"],
    itemSelector: "a",
    deps: [variantName],
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
    <TabNavRootSlot ref={ref} variant={variant} {...rest}>
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
        borderRadius={isUnderline ? "0" : isPill ? "full" : "200"}
        transition="transform 180ms ease, width 180ms ease, height 180ms ease, opacity 120ms ease"
        css={{
          "@media (prefers-reduced-motion: reduce)": {
            transition: "none",
          },
        }}
      />
      {children}
    </TabNavRootSlot>
  );
};

TabNavRoot.displayName = "TabNav.Root";
