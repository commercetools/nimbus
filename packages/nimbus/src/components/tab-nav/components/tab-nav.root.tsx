import { useRef } from "react";
import { useSlidingIndicator } from "@/hooks";
import type { SlidingIndicatorRects } from "@/hooks";
import { TabNavRootSlot, TabNavIndicatorSlot } from "../tab-nav.slots";
import type { TabNavProps } from "../tab-nav.types";

/** Thickness of the sliding bar used by the `line` variant. */
const LINE_BAR_PX = 2;

/** Deprecated variant aliases → their replacement. */
const VARIANT_ALIASES: Record<string, "line" | "rounded" | "pill"> = {
  tabs: "line",
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
 * @supportsStyleProps
 */
export const TabNavRoot = (props: TabNavProps) => {
  const { variant: variantProp, children, ref, ...rest } = props;

  // Resolve deprecated aliases (e.g. `tabs` → `line`) to the real variant.
  const variant =
    typeof variantProp === "string"
      ? (VARIANT_ALIASES[variantProp] ?? variantProp)
      : variantProp;

  // Stable string used for indicator geometry/styling and effect deps. A
  // responsive `variant` object falls back to the default look for the slider.
  const variantName = typeof variant === "string" ? variant : "line";
  const isLine = variantName === "line";

  const indicatorRef = useRef<HTMLDivElement>(null);

  // Drive the sliding active-item marker: an `aria-hidden`, non-focusable
  // element rendered inside the root and DOM-positioned over the current item (a
  // bar for `line`, a full-height highlight for `rounded`/`pill`). The recipe's
  // static marker is the SSR/no-JS fallback, suppressed via `data-animated` once
  // this hook activates; the slide respects `prefers-reduced-motion`.
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
      if (isLine) {
        // Pin a thin bar to the active item's bottom edge.
        return {
          x,
          y: y + active.height - LINE_BAR_PX,
          width: active.width,
          height: LINE_BAR_PX,
        };
      }
      // Full-height highlight behind the label.
      return { x, y, width: active.width, height: active.height };
    },
  });

  return (
    <TabNavRootSlot ref={ref} variant={variant} {...rest}>
      <TabNavIndicatorSlot ref={indicatorRef} aria-hidden="true" />
      {children}
    </TabNavRootSlot>
  );
};

TabNavRoot.displayName = "TabNav.Root";
