import { useLayoutEffect, useState } from "react";
import { HEADER_HEIGHT_VARIABLE } from "../constants";
import {
  BACK_ICON_INSET_VARIABLE,
  COLLAPSE_DISTANCE_VARIABLE,
  SCROLL_DRIVEN_ATTRIBUTE,
  measureHeaderForm,
  planHeaderPartMotions,
  planScrollDrivenHeader,
  setHeaderPartsAtRest,
  startHeaderPartAnimations,
  type HeaderMotion,
} from "../utils";

export type UseScrollDrivenHeaderOptions = {
  /** Turns the behavior on. */
  isEnabled: boolean;
  /** `DefaultPage.Root`: holds the hidden copies and the height variable. */
  containerElement: HTMLElement | null;
  /** The header. */
  headerElement: HTMLElement | null;
  /** The content area: it scrolls in the constrained layout. */
  contentElement: HTMLElement | null;
  /**
   * `"flexible"`: the header is sticky in the scrolling area and moves up by
   * itself. `"constrained"`: only the content area scrolls; the header moves
   * up with its scroll position, and the content area reaches up under it.
   */
  layout: "flexible" | "constrained";
  /**
   * Name of the CSS custom property that receives the pinned header height.
   * @default "--default-page-header-height"
   */
  heightVariable?: string;
};

/**
 * Where the header is on its way from the full to the collapsed form:
 * `"full"` at rest at the start, `"collapsing"` in between, `"pinned"` at
 * rest at the end.
 */
export type ScrollDrivenHeaderState = "full" | "collapsing" | "pinned";

export type UseScrollDrivenHeaderResult = {
  state: ScrollDrivenHeaderState;
};

/** How long the header stays at the top before its animations are removed. */
const REST_AT_START_DELAY_MS = 500;

/** Keys that scroll the page. */
const SCROLL_KEYS = new Set([
  "ArrowDown",
  "ArrowUp",
  "PageDown",
  "PageUp",
  "Home",
  "End",
  " ",
]);

/**
 * EXPERIMENT ("scroll-driven"): the sticky header follows the scroll
 * position. See `utils/scroll-driven-header.ts`.
 *
 * Measures the full and the collapsed form, and plans how the header parts
 * change. Flexible layout: sets the header's sticky `top` to minus the
 * collapse distance. Constrained layout: the header's top margin and the
 * content area's top padding change with the scroll position (see
 * `HeaderMotion["drivers"]`). Does
 * it again when the header changes size. Adds no scroll listeners: an
 * `IntersectionObserver` reports how much of the header is visible, which
 * tells the state.
 *
 * At rest, the parts have no animations, so the browser draws their text at
 * its real size (sharp): when pinned, they get their end look as fixed
 * styles; at the start, after a short pause at the top, they have no inline
 * styles. A new animation takes effect one frame later, so:
 * - leaving the pinned form, the fixed styles stay until the animations take
 *   effect, so nothing jumps back meanwhile;
 * - at the start, input that usually comes before scrolling (wheel, touch,
 *   scroll keys, pointer down) starts the animations ahead of the scroll.
 *   Without such input (a link to an anchor, a script), the parts lag for
 *   the first frame or two.
 *
 * The height variable receives the pinned height.
 */
export function useScrollDrivenHeader({
  isEnabled,
  containerElement,
  headerElement,
  contentElement,
  layout,
  heightVariable = HEADER_HEIGHT_VARIABLE,
}: UseScrollDrivenHeaderOptions): UseScrollDrivenHeaderResult {
  const [state, setState] = useState<ScrollDrivenHeaderState>("full");

  useLayoutEffect(() => {
    if (!isEnabled || !containerElement || !headerElement) return;
    if (layout === "constrained" && !contentElement) return;
    const container = containerElement;
    const header = headerElement;
    const scroller = layout === "constrained" ? contentElement! : undefined;
    let motion: HeaderMotion | null = null;
    let animations: Animation[] = [];
    // Constrained layout: what moves the header itself, always running.
    let driverAnimations: Animation[] = [];
    // Increases with every change, so a late `ready` does not undo a newer one.
    let change = 0;
    let current: ScrollDrivenHeaderState = "full";
    let stateObserver: IntersectionObserver | null = null;
    let lastSize = "";
    let restTimer: ReturnType<typeof setTimeout> | null = null;
    const doc = header.ownerDocument;

    const stopAnimations = () => {
      change += 1;
      for (const animation of animations) animation.cancel();
      animations = [];
    };

    const cancelRestAtStart = () => {
      if (restTimer !== null) clearTimeout(restTimer);
      restTimer = null;
    };

    /** At the top, removes the animations after a short pause. */
    const scheduleRestAtStart = () => {
      cancelRestAtStart();
      restTimer = setTimeout(() => {
        restTimer = null;
        if (current !== "full" || !motion) return;
        stopAnimations();
        setHeaderPartsAtRest(motion, "start");
      }, REST_AT_START_DELAY_MS);
    };

    const startAnimations = () => {
      if (!motion || animations.length > 0) return;
      const started = startHeaderPartAnimations(motion);
      animations = started;
      const thisChange = ++change;
      const restingMotion = motion;
      // A new animation takes effect one frame later: keep the current fixed
      // look until then, so the parts do not jump meanwhile.
      void Promise.all(started.map((animation) => animation.ready)).then(
        () => {
          if (thisChange === change) {
            setHeaderPartsAtRest(restingMotion, "start");
          }
        },
        () => {
          // Cancelled by a newer change.
        }
      );
    };

    const show = (next: ScrollDrivenHeaderState) => {
      current = next;
      setState(next);
      if (!motion) return;
      if (next === "pinned") {
        cancelRestAtStart();
        stopAnimations();
        setHeaderPartsAtRest(motion, "end");
        return;
      }
      startAnimations();
      if (next === "full") scheduleRestAtStart();
      else cancelRestAtStart();
    };

    /** Input that usually comes before scrolling: get the animations ready. */
    const handleScrollIntent = (event: Event) => {
      if (current !== "full" || !motion) return;
      if (event.type === "wheel" && (event as WheelEvent).deltaY === 0) return;
      if (
        event.type === "keydown" &&
        !SCROLL_KEYS.has((event as KeyboardEvent).key)
      ) {
        return;
      }
      startAnimations();
      scheduleRestAtStart();
    };
    const intentEvents = ["wheel", "touchstart", "keydown", "pointerdown"];
    const intentOptions = { capture: true, passive: true } as const;

    const setUp = () => {
      const { width, height } = header.getBoundingClientRect();
      const size = `${width}x${height}`;
      if (size === lastSize) return;
      lastSize = size;

      cancelRestAtStart();
      stopAnimations();
      for (const animation of driverAnimations) animation.cancel();
      driverAnimations = [];
      if (motion) setHeaderPartsAtRest(motion, "start");
      motion = null;
      stateObserver?.disconnect();
      stateObserver = null;

      const full = measureHeaderForm(header, container, false);
      const collapsed = measureHeaderForm(header, container, true);
      const plan = planScrollDrivenHeader(full, collapsed);

      if (scroller) {
        container.style.setProperty(
          COLLAPSE_DISTANCE_VARIABLE,
          `${plan.distance}px`
        );
      } else {
        header.style.top = `${-plan.distance}px`;
      }
      container.setAttribute(SCROLL_DRIVEN_ATTRIBUTE, layout);
      header.style.setProperty(
        BACK_ICON_INSET_VARIABLE,
        `${plan.backIconInset}px`
      );
      container.style.setProperty(heightVariable, `${plan.pinnedHeight}px`);
      motion = planHeaderPartMotions({
        header,
        root: container,
        scroller,
        // Read now, while no driver runs: the page's own values.
        baseOffsets: scroller
          ? {
              headerMarginTop:
                parseFloat(getComputedStyle(header).marginTop) || 0,
              scrollerPaddingTop:
                parseFloat(getComputedStyle(scroller).paddingTop) || 0,
            }
          : undefined,
        full,
        collapsed,
        plan,
      });

      if (!motion || full.height <= 0) {
        show("full");
        return;
      }
      driverAnimations = motion.drivers.map((driver) =>
        driver.element.animate(driver.keyframes, motion!.timing)
      );
      // The visible part of the header tells the state: all of it at the
      // start, only the pinned height at the end (half a pixel of tolerance
      // each). Only the ratio is used: Chrome reports `isIntersecting: false`
      // below the first threshold even when part of the header is visible.
      const fullThreshold = (full.height - 0.5) / full.height;
      const pinnedThreshold = Math.min(
        fullThreshold,
        (plan.pinnedHeight + 0.5) / full.height
      );
      stateObserver = new IntersectionObserver(
        ([entry]) => {
          const ratio = entry.intersectionRatio;
          // Not visible at all (scrolled away with an outer scroller): keep.
          if (ratio <= 0) return;
          const next =
            ratio >= fullThreshold
              ? "full"
              : ratio < pinnedThreshold
                ? "pinned"
                : "collapsing";
          if (next !== current) show(next);
        },
        { threshold: [pinnedThreshold, fullThreshold] }
      );
      // The first report applies the state again on the new measurements.
      current = "full";
      show("full");
      stateObserver.observe(header);
    };

    setUp();
    // Transforms and opacity do not change the header size, and the compact
    // back link keeps its outer size, so this does not run while scrolling.
    const resizeObserver = new ResizeObserver(setUp);
    resizeObserver.observe(header, { box: "border-box" });
    for (const type of intentEvents) {
      doc.addEventListener(type, handleScrollIntent, intentOptions);
    }

    return () => {
      resizeObserver.disconnect();
      stateObserver?.disconnect();
      for (const type of intentEvents) {
        doc.removeEventListener(type, handleScrollIntent, intentOptions);
      }
      cancelRestAtStart();
      stopAnimations();
      for (const animation of driverAnimations) animation.cancel();
      if (motion) setHeaderPartsAtRest(motion, "start");
      header.style.top = "";
      header.style.removeProperty(BACK_ICON_INSET_VARIABLE);
      container.style.removeProperty(COLLAPSE_DISTANCE_VARIABLE);
      container.removeAttribute(SCROLL_DRIVEN_ATTRIBUTE);
      container.style.removeProperty(heightVariable);
      setState("full");
    };
  }, [
    isEnabled,
    containerElement,
    headerElement,
    contentElement,
    layout,
    heightVariable,
  ]);

  return { state: isEnabled ? state : "full" };
}
