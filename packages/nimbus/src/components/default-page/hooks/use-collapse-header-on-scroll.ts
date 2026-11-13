import { useLayoutEffect, useState } from "react";
import { HEADER_HEIGHT_VARIABLE, SCROLL_PAUSE_MS } from "../constants";
import { getNextHeaderForm, type HeaderForm } from "../utils";

export type UseCollapseHeaderOnScrollOptions = {
  /**
   * Turns the behavior on. When `false`, the hook adds no listeners and the
   * header keeps its full form.
   */
  isEnabled: boolean;
  /**
   * The page container. The hidden copy of the header is placed inside it for
   * measuring, and the header height variable is set on it.
   */
  containerElement: HTMLElement | null;
  /** The header that collapses. */
  headerElement: HTMLElement | null;
  /** The content area that scrolls under the header. */
  contentElement: HTMLElement | null;
  /**
   * Keeps the full header height in the page when the header collapses: a
   * bottom margin fills the space the header gives back, so nothing after the
   * header moves. Use it for a header that is pinned with `position: sticky`
   * inside the scrolling element. When `false`, the header gives the space
   * back and the scroll position is corrected instead.
   * @default false
   */
  keepSpace?: boolean;
  /**
   * Name of the CSS custom property that receives the header height.
   * @default "--default-page-header-height"
   */
  heightVariable?: string;
};

export type UseCollapseHeaderOnScrollResult = {
  /** `true` while the header shows its collapsed form. */
  isCollapsed: boolean;
};

const COLLAPSED_ATTRIBUTE = "data-collapsed";

type Heights = { full: number; collapsed: number };

/** The parent of a node in the flat tree: slot, then shadow host. */
const getFlatTreeParent = (node: Node): Node | null => {
  const slot = (node as Element).assignedSlot;
  if (slot) return slot;
  const parent = node.parentNode;
  if (parent && parent.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
    return (parent as ShadowRoot).host ?? null;
  }
  return parent;
};

/** Every shadow root between `node` and the document, along the flat tree. */
const getShadowRootsAbove = (node: Node): ShadowRoot[] => {
  const shadowRoots: ShadowRoot[] = [];
  let current: Node | null = node;
  while (current) {
    const slot: HTMLSlotElement | null = (current as Element).assignedSlot;
    const parent: Node | null = slot ?? current.parentNode;
    if (parent && parent.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
      shadowRoots.push(parent as ShadowRoot);
      current = (parent as ShadowRoot).host ?? null;
    } else {
      current = parent;
    }
  }
  return shadowRoots;
};

/** Whether `candidate` is an ancestor of `node` in the flat tree. */
const isFlatTreeAncestor = (candidate: Node, node: Node): boolean => {
  let current = getFlatTreeParent(node);
  while (current) {
    if (current === candidate) return true;
    current = getFlatTreeParent(current);
  }
  return false;
};

/** The element whose `scrollTop` a scroll event target controls. */
const toScrollingElement = (target: EventTarget | null): Element | null => {
  if (!target) return null;
  if ((target as Node).nodeType === Node.DOCUMENT_NODE) {
    return (target as Document).scrollingElement;
  }
  if ((target as Node).nodeType === Node.ELEMENT_NODE) return target as Element;
  return null;
};

/**
 * Measures the header height in the other form on a hidden copy. The copy is
 * placed inside the container, absolutely positioned at its start, so it does
 * not change the layout or the scrollable area. It is removed in the same
 * task, before paint. The live header and the scroll position are not touched.
 */
const measureCopyHeight = (
  header: HTMLElement,
  container: HTMLElement,
  collapsed: boolean
): number => {
  const copy = header.cloneNode(true) as HTMLElement;
  if (collapsed) copy.setAttribute(COLLAPSED_ATTRIBUTE, "true");
  else copy.removeAttribute(COLLAPSED_ATTRIBUTE);
  copy.setAttribute("aria-hidden", "true");
  copy.setAttribute("inert", "");
  const { width } = header.getBoundingClientRect();
  Object.assign(copy.style, {
    position: "absolute",
    visibility: "hidden",
    pointerEvents: "none",
    boxSizing: "border-box",
    width: `${width}px`,
    transition: "none",
    animation: "none",
  });
  container.insertBefore(copy, container.firstChild);
  const height = copy.getBoundingClientRect().height;
  copy.remove();
  return height;
};

/**
 * Collapses a pinned page header while the content is scrolled away from the
 * top, and returns it to its full form at the top.
 *
 * - The scroll distance is `content.scrollTop` plus how far the top edge of
 *   the content is above the bottom edge of the header. This covers a content
 *   area that scrolls, a sticky header in an outer scrolling element, and host
 *   CSS that changes which element scrolls. With `keepSpace`, the bottom edge
 *   is that of the space the header keeps (its full height).
 * - The header collapses at a distance of at least the space it gives back
 *   plus 8px (with `keepSpace`: 8px, as it gives no space back), and returns
 *   to its full form below 1px (`getNextHeaderForm`).
 * - A form change waits until no scroll event has happened for 150ms, and
 *   until the mouse pointer leaves the header (or the wheel is used over it).
 * - Without `keepSpace`, the content is scrolled by the space given back when
 *   the header collapses after a scroll, so the text the user reads stays
 *   still. With `keepSpace`, nothing after the header moves, so no correction
 *   is needed.
 * - The form changes at once (one step).
 * - The current header height is published as a CSS custom property on the
 *   container.
 *
 * The hook writes `data-collapsed="true"` on the header directly, so the
 * layout changes in the same task as the scroll correction or the margin.
 * Render the same attribute from `isCollapsed` so React keeps it.
 */
export function useCollapseHeaderOnScroll({
  isEnabled,
  containerElement,
  headerElement,
  contentElement,
  keepSpace = false,
  heightVariable = HEADER_HEIGHT_VARIABLE,
}: UseCollapseHeaderOnScrollOptions): UseCollapseHeaderOnScrollResult {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useLayoutEffect(() => {
    if (!isEnabled || !containerElement || !headerElement || !contentElement) {
      return;
    }
    const container = containerElement;
    const header = headerElement;
    const content = contentElement;
    const doc = header.ownerDocument;

    let form: HeaderForm = "full";
    // Assigned in closures, so not narrowed to `null` here.
    let heights = null as Heights | null;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let lastScrollTarget: EventTarget | null = null;
    let lastDistance: number | null = null;
    let jumped = false;
    let isPointerOver = false;
    let isHoldReleased = false;
    // Keep the space: the bottom margin of the collapsed header.
    let reservedSpace = 0;

    const readDistance = (): number | null => {
      const headerRect = header.getBoundingClientRect();
      if (headerRect.height <= 0) return null;
      const contentRect = content.getBoundingClientRect();
      // Keep the space: measure against the space the header keeps (its full
      // height), so the header expands only when the page is back at the top.
      const headerBottom = keepSpace
        ? headerRect.top + (heights?.full ?? headerRect.height)
        : headerRect.bottom;
      return content.scrollTop + Math.max(0, headerBottom - contentRect.top);
    };

    /** The next form for a distance. */
    const nextFormFor = (distance: number | null) =>
      getNextHeaderForm({
        current: form,
        distance,
        fullHeight: heights?.full ?? null,
        // Keep the space: collapsing gives no space back to the layout, so
        // the header collapses 8px after the content scrolls under it.
        collapsedHeight: keepSpace
          ? (heights?.full ?? null)
          : (heights?.collapsed ?? null),
      });

    const spaceGivenBack = () =>
      heights ? Math.max(0, heights.full - heights.collapsed) : 0;

    const measureHeights = () => {
      const live = header.getBoundingClientRect().height;
      if (live <= 0) {
        heights = null;
        return;
      }
      const other = measureCopyHeight(header, container, form === "full");
      heights =
        form === "full"
          ? { full: live, collapsed: other }
          : { full: other, collapsed: live };
    };

    const publishHeight = () => {
      const height = header.getBoundingClientRect().height;
      if (height > 0) {
        container.style.setProperty(heightVariable, `${height}px`);
      } else {
        container.style.removeProperty(heightVariable);
      }
    };

    /** Screen position of the start of the content. */
    const readReferencePoint = () =>
      content.getBoundingClientRect().top - content.scrollTop;

    /** The element to correct: the content when it scrolls, else the last scroll target. */
    const getScroller = (): Element | null => {
      if (lastScrollTarget === content || content.scrollTop > 0) return content;
      return toScrollingElement(lastScrollTarget);
    };

    /** Keep the space: change the form with no layout effect outside the header. */
    const applyKeepingSpace = (next: HeaderForm) => {
      const fromHeight = header.getBoundingClientRect().height;
      const fullHeight =
        next === "collapsed" ? (heights?.full ?? fromHeight) : fromHeight;
      // Write the form and the margin together, from the measured heights,
      // with no layout read in between: a read while the page is briefly
      // shorter lets scroll anchoring move the scroller.
      reservedSpace =
        next === "collapsed" && heights
          ? Math.max(0, fullHeight - heights.collapsed)
          : 0;
      if (next === "collapsed") {
        header.setAttribute(COLLAPSED_ATTRIBUTE, "true");
      } else {
        header.removeAttribute(COLLAPSED_ATTRIBUTE);
      }
      header.style.marginBottom = reservedSpace ? `${reservedSpace}px` : "";
      const toHeight = header.getBoundingClientRect().height;
      // Correct a small difference between the copy and the live header.
      if (next === "collapsed") {
        const exact = Math.max(0, fullHeight - toHeight);
        if (Math.abs(exact - reservedSpace) > 0.5) {
          reservedSpace = exact;
          header.style.marginBottom = `${reservedSpace}px`;
        }
      }

      form = next;
      setIsCollapsed(next === "collapsed");
      publishHeight();
      lastDistance = readDistance();
    };

    const apply = (next: HeaderForm, correct: boolean) => {
      if (keepSpace) {
        applyKeepingSpace(next);
        return;
      }
      const scroller = getScroller();
      if (next === "collapsed") {
        const before = readReferencePoint();
        header.setAttribute(COLLAPSED_ATTRIBUTE, "true");
        const after = readReferencePoint();
        const delta = after - before;
        if (correct && scroller && Math.abs(delta) >= 0.5) {
          scroller.scrollBy({ top: delta, behavior: "instant" });
        }
      } else {
        // Scroll anchoring can move the scrolling element when content sits
        // above the page in the same scroller. Keep its offset.
        const savedScrollTop = scroller ? scroller.scrollTop : null;
        header.removeAttribute(COLLAPSED_ATTRIBUTE);
        header.getBoundingClientRect();
        if (
          scroller &&
          savedScrollTop !== null &&
          scroller.scrollTop !== savedScrollTop
        ) {
          scroller.scrollTo({ top: savedScrollTop, behavior: "instant" });
        }
      }
      form = next;
      setIsCollapsed(next === "collapsed");
      publishHeight();
      lastDistance = readDistance();
    };

    const evaluate = () => {
      timer = null;
      if (isPointerOver && !isHoldReleased) return;
      const next = nextFormFor(readDistance());
      if (next !== form) {
        apply(
          next,
          next === "collapsed" && !jumped && lastScrollTarget !== null
        );
      }
      jumped = false;
    };

    const schedule = () => {
      if (timer !== null) clearTimeout(timer);
      timer = setTimeout(evaluate, SCROLL_PAUSE_MS);
    };

    const isRelevantTarget = (target: EventTarget | null) => {
      if (!target) return false;
      if (target === doc || target === content) return true;
      return (
        (target as Node).nodeType === Node.ELEMENT_NODE &&
        isFlatTreeAncestor(target as Node, container)
      );
    };

    const handleScroll = (event: Event) => {
      if (!isRelevantTarget(event.target)) return;
      lastScrollTarget = event.target;
      const distance = readDistance();
      if (
        distance !== null &&
        lastDistance !== null &&
        heights !== null &&
        Math.abs(distance - lastDistance) > spaceGivenBack()
      ) {
        jumped = true;
      }
      lastDistance = distance;
      schedule();
    };

    const handlePointerEnter = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      isPointerOver = true;
      isHoldReleased = false;
    };

    const handlePointerLeave = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      isPointerOver = false;
      isHoldReleased = false;
      // A change that waited for the pointer applies now, unless the user is
      // still scrolling (then the pause timer applies it).
      if (timer === null) evaluate();
    };

    // Scrolling with the wheel over the header releases the hold. In the
    // constrained layout the wheel over the header scrolls nothing, so the
    // wheel itself restarts the pause timer.
    const handleWheel = () => {
      isHoldReleased = true;
      schedule();
    };

    const resizeObserver = new ResizeObserver((entries) => {
      if (entries.some((entry) => entry.target === header)) {
        measureHeights();
        publishHeight();
        if (keepSpace && form === "collapsed" && heights) {
          reservedSpace = Math.max(0, heights.full - heights.collapsed);
          header.style.marginBottom = `${reservedSpace}px`;
        }
      }
      // Never change the form here: a change resizes the observed elements
      // again in the same frame. Go through the pause timer instead.
      schedule();
    });

    const scrollListenerTargets: (Document | ShadowRoot)[] = [
      doc,
      ...getShadowRootsAbove(container),
    ];
    const listenerOptions = { capture: true, passive: true } as const;

    // First measurement: no fade, no scroll correction.
    measureHeights();
    publishHeight();
    lastDistance = readDistance();
    const initial = nextFormFor(lastDistance);
    if (initial !== form) apply(initial, false);

    for (const target of scrollListenerTargets) {
      target.addEventListener("scroll", handleScroll, listenerOptions);
    }
    header.addEventListener("pointerenter", handlePointerEnter);
    header.addEventListener("pointerleave", handlePointerLeave);
    header.addEventListener("wheel", handleWheel, { passive: true });
    resizeObserver.observe(header, { box: "border-box" });
    resizeObserver.observe(content, { box: "border-box" });

    return () => {
      if (timer !== null) clearTimeout(timer);
      if (keepSpace) header.style.marginBottom = "";
      for (const target of scrollListenerTargets) {
        target.removeEventListener("scroll", handleScroll, listenerOptions);
      }
      header.removeEventListener("pointerenter", handlePointerEnter);
      header.removeEventListener("pointerleave", handlePointerLeave);
      header.removeEventListener("wheel", handleWheel);
      resizeObserver.disconnect();
      header.removeAttribute(COLLAPSED_ATTRIBUTE);
      container.style.removeProperty(heightVariable);
      setIsCollapsed(false);
    };
  }, [
    isEnabled,
    containerElement,
    headerElement,
    contentElement,
    keepSpace,
    heightVariable,
  ]);

  return { isCollapsed: isEnabled && isCollapsed };
}
