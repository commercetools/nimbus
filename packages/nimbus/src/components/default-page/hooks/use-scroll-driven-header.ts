import { useLayoutEffect, useState } from "react";
import { flushSync } from "react-dom";
import { HEADER_HEIGHT_VARIABLE } from "../constants";
import {
  BACK_ICON_INSET_VARIABLE,
  COLLAPSE_DISTANCE_VARIABLE,
  SCROLL_DRIVEN_ATTRIBUTE,
  getScrollDrivenHeaderState,
  createScrollDrivenMarkers,
  measureHeaderForm,
  planHeaderPartMotions,
  planScrollDrivenHeader,
  removeScrollDrivenMarkers,
  setHeaderPartsAtRest,
  startHeaderPartAnimations,
  type HeaderForm,
  type HeaderFormLayout,
  type HeaderMotion,
  type ScrollDrivenHeaderState,
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
  /**
   * Renders the page content of one form (`"full"` or `"collapsed"`) in the
   * header, or the live content (`null`). Called inside `flushSync`, so the
   * header has the content of that form when it is measured.
   */
  setMeasuredForm?: (form: HeaderForm | null) => void;
};

export type { ScrollDrivenHeaderState };

export type UseScrollDrivenHeaderResult = {
  state: ScrollDrivenHeaderState;
};

/** A style value held inline while the drivers are swapped. */
type Hold = {
  element: HTMLElement;
  property: "marginTop" | "paddingTop";
  /** The value held now. */
  held: string;
  /** The element's own inline value, put back at the release. */
  own: string;
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
 * Scroll-driven collapse: the header follows the scroll position. See
 * `utils/scroll-driven-header.ts`.
 *
 * Measures the full and the collapsed form, and plans how the header parts
 * change. Flexible layout: sets the header's sticky `top` to minus the
 * collapse distance. Constrained layout: the header's top margin and the
 * content area's top padding change with the scroll position (see
 * `HeaderMotion["drivers"]`). Does
 * it again when the header changes size. Adds no scroll listeners: an
 * `IntersectionObserver` reports which markers inside the header are in
 * view (its top edge, the collapse distance, the edge below it), which tells
 * the state whatever clips the header at its bottom edge.
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
  setMeasuredForm,
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
    // Constrained layout: the values the drivers give to the header's top
    // margin and the scroller's top padding, held inline while the drivers are
    // swapped, so nothing jumps for the frame before the new drivers run.
    // Each entry keeps the element's own inline value for the release.
    let holds: Hold[] = [];
    let restTimer: ReturnType<typeof setTimeout> | null = null;
    const doc = header.ownerDocument;
    // The markers that tell the state are positioned inside the header.
    const ownPosition = header.style.position;
    if (getComputedStyle(header).position === "static") {
      header.style.position = "relative";
    }

    const stopAnimations = () => {
      change += 1;
      for (const animation of animations) animation.cancel();
      animations = [];
    };

    /** Writes the held value, or the element's own inline value, to every hold. */
    const applyHolds = (value: "held" | "own") => {
      for (const hold of holds) hold.element.style[hold.property] = hold[value];
    };

    const releaseHolds = () => {
      applyHolds("own");
      holds = [];
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
      // The form the header has now. It is shown again at the end, so the
      // hidden parts do not come back for the frames until the observer reports.
      const previous = current;

      cancelRestAtStart();
      stopAnimations();
      if (scroller && holds.length === 0 && driverAnimations.length > 0) {
        // The drivers move the header's margin and the scroller's padding.
        // Without them both jump for a frame: keep what they give now until
        // the new drivers run.
        for (const [element, property] of [
          [header, "marginTop"],
          [scroller, "paddingTop"],
        ] as const) {
          holds.push({
            element,
            property,
            own: element.style[property],
            held: getComputedStyle(element)[property],
          });
        }
        applyHolds("held");
      }
      for (const animation of driverAnimations) animation.cancel();
      driverAnimations = [];
      if (motion) setHeaderPartsAtRest(motion, "start");
      motion = null;
      stateObserver?.disconnect();
      stateObserver = null;
      removeScrollDrivenMarkers(header);

      // Measure and read the page's own values without the holds.
      applyHolds("own");
      // Each form is measured with the page content that it renders: the
      // content can depend on `isCollapsed`. Both passes and the restore
      // finish before paint.
      const measure = (form: HeaderForm) => {
        flushSync(() => setMeasuredForm?.(form));
        return measureHeaderForm(header, container, form === "collapsed");
      };
      let full: HeaderFormLayout;
      let collapsed: HeaderFormLayout;
      try {
        full = measure("full");
        collapsed = measure("collapsed");
      } finally {
        flushSync(() => setMeasuredForm?.(null));
      }
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
      const baseOffsets = scroller
        ? {
            headerMarginTop:
              parseFloat(getComputedStyle(header).marginTop) || 0,
            scrollerPaddingTop:
              parseFloat(getComputedStyle(scroller).paddingTop) || 0,
          }
        : undefined;
      applyHolds("held");
      motion = planHeaderPartMotions({
        header,
        root: container,
        scroller,
        baseOffsets,
        full,
        collapsed,
        plan,
      });

      if (!motion || full.height <= 0) {
        releaseHolds();
        show("full");
        return;
      }
      const markers = createScrollDrivenMarkers(header, plan.distance);
      const markerElements = [markers.start, markers.collapse, markers.end];
      const shown = new Map<Element, boolean>();
      const observer = new IntersectionObserver((entries) => {
        for (const entry of entries)
          shown.set(entry.target, entry.isIntersecting);
        // The first report has every marker.
        if (shown.size < markerElements.length) return;
        const next = getScrollDrivenHeaderState(
          {
            start: shown.get(markers.start) === true,
            collapse: shown.get(markers.collapse) === true,
            end: shown.get(markers.end) === true,
          },
          current
        );
        if (next !== current) show(next);
      });
      stateObserver = observer;
      const observeMarkers = () => {
        for (const marker of markerElements) observer.observe(marker);
      };
      driverAnimations = motion.drivers.map((driver) =>
        driver.element.animate(driver.keyframes, motion!.timing)
      );
      // The new drivers take effect a frame later: release the holds then.
      void Promise.all(
        driverAnimations.map((animation) => animation.ready)
      ).then(
        () => {
          releaseHolds();
          // The first report can come before the new drivers take effect, and
          // the observer reports only changes after it: ask for a new first
          // report on the markers as they are now.
          if (stateObserver === observer) {
            for (const marker of markerElements) observer.unobserve(marker);
            observeMarkers();
          }
        },
        () => {
          // Cancelled by a newer change, which keeps or releases the holds.
        }
      );
      // The first report applies the state again on the new measurements.
      current = previous;
      show(previous);
      observeMarkers();
    };

    // Transforms and opacity do not change the header size, and the compact
    // back link keeps its outer size, so this does not run while scrolling.
    // The first report comes before the first paint. It also runs the first
    // measurement: `flushSync` is not flushed inside a layout effect.
    const resizeObserver = new ResizeObserver(setUp);
    resizeObserver.observe(header, { box: "border-box" });
    for (const type of intentEvents) {
      doc.addEventListener(type, handleScrollIntent, intentOptions);
    }

    return () => {
      resizeObserver.disconnect();
      stateObserver?.disconnect();
      removeScrollDrivenMarkers(header);
      header.style.position = ownPosition;
      for (const type of intentEvents) {
        doc.removeEventListener(type, handleScrollIntent, intentOptions);
      }
      cancelRestAtStart();
      stopAnimations();
      for (const animation of driverAnimations) animation.cancel();
      releaseHolds();
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
    setMeasuredForm,
  ]);

  return { state: isEnabled ? state : "full" };
}
