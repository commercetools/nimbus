import { useEffect, useState } from "react";
import {
  getShadowRootsAlongFlatTree,
  isRelatedScrollTarget,
} from "../utils/flat-tree";
import {
  getNextHeaderForm,
  type HeaderForm,
} from "../utils/get-next-header-form";
import { getScrollDistance } from "../utils/get-scroll-distance";
import { measureCollapsedHeaderHeight } from "../utils/measure-collapsed-header-height";
import { applyHeaderFormChange } from "../utils/scroll-correction";

export const COLLAPSE_HEADER_PAUSE_MS = 150;

const SCROLL_LISTENER_OPTIONS: AddEventListenerOptions = {
  capture: true,
  passive: true,
};

export type UseCollapseHeaderOnScrollOptions = {
  /** When `false` the hook does nothing and the header stays in its full form. */
  enabled: boolean;
  header: HTMLElement | null;
  content: HTMLElement | null;
  /** Page root, used to walk the flat tree for shadow roots and ancestors. */
  root: HTMLElement | null;
  /**
   * Collapsed header height in CSS pixels. When omitted, the hook measures it
   * on a hidden copy of the header. Tests can pass a value to skip the copy.
   */
  collapsedHeight?: number | null;
};

export type UseCollapseHeaderOnScrollResult = {
  form: HeaderForm;
  /** Current header height in CSS pixels, or `null` before the first measurement. */
  headerHeight: number | null;
};

/**
 * Tracks the DefaultPage header form from scroll distance.
 *
 * Listens for `scroll` in the capture phase on the document and on every
 * shadow root between Root and the document. Form changes wait for a 150ms
 * pause, and are held while the pointer is over the header.
 */
export const useCollapseHeaderOnScroll = ({
  enabled,
  header,
  content,
  root,
  collapsedHeight,
}: UseCollapseHeaderOnScrollOptions): UseCollapseHeaderOnScrollResult => {
  const [form, setForm] = useState<HeaderForm>("full");
  const [headerHeight, setHeaderHeight] = useState<number | null>(null);

  useEffect(() => {
    if (!enabled) {
      setForm("full");
      setHeaderHeight(null);
      return;
    }

    if (!header || !content || !root) {
      setHeaderHeight(null);
      return;
    }

    let currentForm: HeaderForm = "full";
    let pointerOverHeader = false;
    let pauseTimer: ReturnType<typeof setTimeout> | undefined;
    let measuredCollapsedHeight =
      collapsedHeight ?? measureCollapsedHeaderHeight(header, root);
    let lastDistance: number | null = null;
    let lastChangeWasJump = false;
    let lastScrollTarget: EventTarget | null = null;
    const loadedCollapsed =
      getNextHeaderForm({
        currentForm: "full",
        distance: getScrollDistance(header, content),
        fullHeight: header.getBoundingClientRect().height,
        collapsedHeight: measuredCollapsedHeight,
      }) === "collapsed";

    const publishHeight = () => {
      setHeaderHeight(header.getBoundingClientRect().height);
    };

    const applyForm = () => {
      const fullHeight = header.getBoundingClientRect().height;
      const distance = getScrollDistance(header, content);
      const next = getNextHeaderForm({
        currentForm,
        distance,
        fullHeight,
        collapsedHeight: measuredCollapsedHeight,
      });

      if (next !== currentForm) {
        applyHeaderFormChange({
          header,
          content,
          lastScrollTarget,
          next,
          lastChangeWasJump,
          isFirstMeasurement: loadedCollapsed && currentForm === "full",
        });
        currentForm = next;
        setForm(next);
      }
      publishHeight();
    };

    publishHeight();

    const scheduleApply = () => {
      if (pauseTimer != null) {
        clearTimeout(pauseTimer);
      }
      pauseTimer = setTimeout(() => {
        pauseTimer = undefined;
        if (pointerOverHeader) {
          return;
        }
        applyForm();
      }, COLLAPSE_HEADER_PAUSE_MS);
    };

    const onScroll = (event: Event) => {
      if (!isRelatedScrollTarget(event.target, root, content)) {
        return;
      }
      lastScrollTarget = event.target;
      const distance = getScrollDistance(header, content);
      const spaceGivenBack =
        header.getBoundingClientRect().height - measuredCollapsedHeight;
      lastChangeWasJump =
        lastDistance != null &&
        Number.isFinite(spaceGivenBack) &&
        Math.abs(distance - lastDistance) > spaceGivenBack;
      lastDistance = distance;
      scheduleApply();
    };

    const onPointerEnter = () => {
      pointerOverHeader = true;
    };

    const onPointerLeave = () => {
      pointerOverHeader = false;
      applyForm();
    };

    const onWheel = () => {
      pointerOverHeader = false;
    };

    const scrollTargets: EventTarget[] = [
      document,
      ...getShadowRootsAlongFlatTree(root),
    ];

    for (const target of scrollTargets) {
      target.addEventListener("scroll", onScroll, SCROLL_LISTENER_OPTIONS);
    }

    header.addEventListener("pointerenter", onPointerEnter);
    header.addEventListener("pointerleave", onPointerLeave);
    header.addEventListener("wheel", onWheel, { passive: true });

    const resizeObserver = new ResizeObserver((entries) => {
      if (
        collapsedHeight == null &&
        currentForm === "full" &&
        entries.some((entry) => entry.target === header)
      ) {
        measuredCollapsedHeight = measureCollapsedHeaderHeight(header, root);
      }
      scheduleApply();
      publishHeight();
    });
    resizeObserver.observe(header, { box: "border-box" });
    resizeObserver.observe(content, { box: "border-box" });

    return () => {
      if (pauseTimer != null) {
        clearTimeout(pauseTimer);
      }
      for (const target of scrollTargets) {
        target.removeEventListener("scroll", onScroll, SCROLL_LISTENER_OPTIONS);
      }
      header.removeEventListener("pointerenter", onPointerEnter);
      header.removeEventListener("pointerleave", onPointerLeave);
      header.removeEventListener("wheel", onWheel);
      resizeObserver.disconnect();
    };
  }, [enabled, header, content, root, collapsedHeight]);

  return {
    form: enabled ? form : "full",
    headerHeight: enabled ? headerHeight : null,
  };
};
