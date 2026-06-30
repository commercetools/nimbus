import { useLayoutEffect } from "react";
import type { RefObject } from "react";

/**
 * Bounding rectangles passed to {@link SlidingIndicatorOptions.getGeometry}.
 */
export interface SlidingIndicatorRects {
  /** Bounding rect of the positioned container the indicator lives in. */
  container: DOMRect;
  /** Bounding rect of the currently active item. */
  active: DOMRect;
}

/**
 * Geometry the indicator should adopt, in pixels, relative to the container's
 * top-left. `width` / `height` are optional — omit one to leave it controlled
 * by CSS (e.g. a fixed-thickness bar).
 */
export interface SlidingIndicatorGeometry {
  x: number;
  y: number;
  width?: number;
  height?: number;
}

export interface SlidingIndicatorOptions {
  /**
   * Whether the indicator is active. When `false` the hook is a complete no-op:
   * it does not measure, observe, or mutate the indicator.
   */
  enabled: boolean;
  /**
   * Ref to the indicator element. Its positioned parent
   * (`indicator.parentElement`) is used as the measurement container, so the
   * indicator must be `position: absolute` inside a positioned ancestor.
   */
  indicatorRef: RefObject<HTMLElement | null>;
  /** CSS selector (queried within the container) for the active item. */
  activeSelector: string;
  /**
   * Attribute names whose mutation anywhere in the container should trigger a
   * re-measure (e.g. `["aria-selected"]` or `["aria-current"]`).
   */
  watchAttributes: string[];
  /**
   * CSS selector for the items to observe for size changes (in addition to the
   * container). Defaults to {@link activeSelector}'s tag-agnostic siblings via
   * the container only when omitted.
   */
  itemSelector?: string;
  /** Maps the container + active rects to the indicator's geometry. */
  getGeometry: (rects: SlidingIndicatorRects) => SlidingIndicatorGeometry;
  /**
   * Extra dependencies that should tear down and re-run the effect (e.g. a
   * changed orientation or variant that alters `getGeometry`).
   */
  deps?: unknown[];
}

/**
 * Positions an absolutely-placed "indicator" element over the active item inside
 * a container and keeps it in sync.
 *
 * The hook is DOM-driven: it measures with `getBoundingClientRect` inside
 * `useLayoutEffect` (so the indicator is placed before paint — no first-frame
 * flash), re-measures when the active item changes (`MutationObserver` on
 * {@link SlidingIndicatorOptions.watchAttributes}) and when the layout changes
 * (`ResizeObserver`), and hides the indicator (opacity 0) when there is no
 * active item. The caller owns the indicator's appearance and transition; this
 * hook only writes `opacity`, `width`/`height` (per `getGeometry`), and
 * `transform`. The very first placement is applied with the transition
 * momentarily suppressed so the indicator snaps to the active item instead of
 * sliding in from the container corner on initial render.
 *
 * Note: scroll is **not** tracked. Geometry is computed in container
 * coordinates, so if the container is itself scrollable the indicator only
 * re-aligns on the next selection change or resize, not on scroll. Today's
 * callers (`Tabs`/`TabNav`) don't scroll their item strip, so this is a
 * non-issue; a future scrollable caller would need to observe scroll itself.
 *
 * Used to drive the animated active-highlight on `Tabs` and `TabNav`, where
 * `getGeometry` encodes whether the indicator is an edge bar (bottom or inner
 * side) or a filled highlight.
 */
export function useSlidingIndicator({
  enabled,
  indicatorRef,
  activeSelector,
  watchAttributes,
  itemSelector,
  getGeometry,
  deps = [],
}: SlidingIndicatorOptions): void {
  useLayoutEffect(() => {
    if (!enabled) return;
    const indicator = indicatorRef.current;
    const container = indicator?.parentElement;
    if (!indicator || !container) return;

    // Mark the container as JS-enhanced so the recipe suppresses its static
    // marker and lets the sliding indicator own the highlight. Setting this on
    // mount (not in server markup) keeps the static marker as the SSR /
    // pre-hydration / no-JS fallback; the swap happens before paint, so there
    // is no flash.
    container.setAttribute("data-animated", "true");

    // The indicator is authored at the container's top-left (`top/left: 0`, no
    // transform). The *first* placement must jump straight to the active item:
    // without this, the caller's `transition` would animate the indicator in
    // from the corner (translate(0,0) → target) on initial render. Subsequent
    // updates slide normally. Because this lives in the effect closure, a
    // re-run (e.g. a variant/orientation change via `deps`) also snaps rather
    // than sliding from a now-stale position.
    let hasPositioned = false;

    const update = () => {
      const active = container.querySelector<HTMLElement>(activeSelector);
      if (!active) {
        // No active item — hide the highlight entirely.
        indicator.style.opacity = "0";
        return;
      }
      const containerRect = container.getBoundingClientRect();
      const activeRect = active.getBoundingClientRect();
      const geometry = getGeometry({
        container: containerRect,
        active: activeRect,
      });

      // Suppress the transition for the initial jump, restoring whatever inline
      // transition was set (normally none — the caller's transition is a class).
      const prevTransition = indicator.style.transition;
      if (!hasPositioned) indicator.style.transition = "none";

      indicator.style.opacity = "1";
      if (geometry.width != null) indicator.style.width = `${geometry.width}px`;
      if (geometry.height != null) {
        indicator.style.height = `${geometry.height}px`;
      }
      indicator.style.transform = `translate(${geometry.x}px, ${geometry.y}px)`;

      if (!hasPositioned) {
        // Force a synchronous reflow to commit the jump, then re-enable the
        // transition so the next selection change slides.
        void indicator.offsetWidth;
        indicator.style.transition = prevTransition;
        hasPositioned = true;
      }
    };

    // Measure synchronously before paint so the highlight appears in place.
    update();

    // Re-measure when the active item changes (watched attribute toggles).
    const mutationObserver = new MutationObserver(update);
    mutationObserver.observe(container, {
      attributes: true,
      subtree: true,
      attributeFilter: watchAttributes,
    });

    // Re-measure when the container or its items change size.
    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(container);
    if (itemSelector) {
      container
        .querySelectorAll<HTMLElement>(itemSelector)
        .forEach((item) => resizeObserver.observe(item));
    }

    return () => {
      mutationObserver.disconnect();
      resizeObserver.disconnect();
      container.removeAttribute("data-animated");
    };
    // `getGeometry` is intentionally excluded — callers pass an inline closure;
    // `deps` is the explicit re-run signal for geometry-affecting inputs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, indicatorRef, activeSelector, itemSelector, ...deps]);
}
