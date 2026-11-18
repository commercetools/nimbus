import { useEffect, type RefObject } from "react";
import { getScrollParent, isIOS, isWebKit } from "@react-aria/utils";
import type { DragAndDropHooks } from "react-aria-components";

/**
 * How close to the top or bottom edge of the scroll area, in pixels, the
 * pointer must be to scroll it. The scroll speed in pixels per frame is how far
 * the pointer is inside this band, so it is at most this size. Both are the
 * same as in React Aria's own auto-scroll.
 */
export const DRAG_AUTO_SCROLL_EDGE = 20;

/**
 * Whether the browser scrolls a scroll area by itself while something is
 * dragged near its edge. Safari on macOS does not
 * (https://bugs.webkit.org/show_bug.cgi?id=222636). Safari on iOS does. The
 * check is React Aria's, from its auto-scroll.
 */
export const hasNativeDragAutoScroll = () => !isWebKit() || isIOS();

type UseDroppableCollection = NonNullable<
  DragAndDropHooks["useDroppableCollection"]
>;

/**
 * Wraps React Aria's `useDroppableCollection` so that its auto-scroll never
 * runs. Use it together with `useDragAutoScroll`, in the browsers that have no
 * native auto-scroll.
 *
 * React Aria's auto-scroll is wrong for a table: it measures the pointer from
 * the top of the table and compares it with the size of the scroll area. The
 * two only match while the area is not scrolled. After that it scrolls down
 * faster and faster and never up
 * (https://github.com/adobe/react-spectrum/issues/9421). It starts from the
 * `dragover` handler, by requesting an animation frame, so the handler runs
 * here without animation frames. Nothing else in the handler requests one.
 */
export const withoutReactAriaAutoScroll =
  (useDroppableCollection: UseDroppableCollection): UseDroppableCollection =>
  (props, state, ref) => {
    const result = useDroppableCollection(props, state, ref);
    const { onDragOver } = result.collectionProps;
    if (!onDragOver) return result;
    return {
      ...result,
      collectionProps: {
        ...result.collectionProps,
        onDragOver: (event) => {
          const requestAnimationFrame = window.requestAnimationFrame;
          // 0 is not a frame: React Aria checks the id before it cancels it.
          window.requestAnimationFrame = () => 0;
          try {
            onDragOver(event);
          } finally {
            window.requestAnimationFrame = requestAnimationFrame;
          }
        },
      },
    };
  };

/**
 * The scroll speed, in pixels per frame, for a pointer at `y`. Negative scrolls
 * up, 0 does not scroll.
 *
 * @param y - The vertical position of the pointer in the viewport
 * @param top - The top edge of the visible area, inside the border
 * @param bottom - The bottom edge of the visible area, inside the border
 */
export const getDragAutoScrollSpeed = (
  y: number,
  top: number,
  bottom: number
) => {
  if (y < top + DRAG_AUTO_SCROLL_EDGE) {
    return Math.max(y - (top + DRAG_AUTO_SCROLL_EDGE), -DRAG_AUTO_SCROLL_EDGE);
  }
  if (y > bottom - DRAG_AUTO_SCROLL_EDGE) {
    return Math.min(
      y - (bottom - DRAG_AUTO_SCROLL_EDGE),
      DRAG_AUTO_SCROLL_EDGE
    );
  }
  return 0;
};

type UseDragAutoScrollParams = {
  /** The table. The hook scrolls the element that scrolls the table. */
  tableRef: RefObject<HTMLTableElement | null>;
  /** Pass `false` in browsers that scroll by themselves. */
  isEnabled: boolean;
};

/**
 * Scrolls the table up or down while something is dragged near the top or
 * bottom edge of its scroll area, as Chrome and Firefox do by themselves. Rows
 * are reordered up and down, so it does not scroll sideways.
 *
 * It scrolls for every drag over the scroll area, as the browsers do. It stops
 * when the pointer leaves the edge or the scroll area, and when the drag ends.
 *
 * The listeners are on the document, in the capture phase: React Aria stops
 * the drag events of the table, and React Aria renders the table element
 * after the first commit, so it can be missing when this effect runs.
 */
export const useDragAutoScroll = ({
  tableRef,
  isEnabled,
}: UseDragAutoScrollParams) => {
  useEffect(() => {
    if (!isEnabled) return;

    // The area that scrolls right now, and how fast.
    let scroller: HTMLElement | undefined;
    let speed = 0;
    let frame: number | undefined;

    const step = () => {
      if (scroller) scroller.scrollTop += speed;
      frame = requestAnimationFrame(step);
    };

    const stop = () => {
      scroller = undefined;
      speed = 0;
      if (frame !== undefined) cancelAnimationFrame(frame);
      frame = undefined;
    };

    /** The element that scrolls the table, if `target` is inside it. */
    const getScrollArea = (target: EventTarget | null) => {
      const table = tableRef.current;
      if (!table || !(target instanceof Node)) return undefined;
      const area = getScrollParent(table) as HTMLElement;
      return area.contains(target) ? area : undefined;
    };

    const onDragOver = (event: DragEvent) => {
      const area = getScrollArea(event.target);
      if (!area) {
        stop();
        return;
      }
      const rect = area.getBoundingClientRect();
      const top = rect.top + area.clientTop;
      scroller = area;
      speed = getDragAutoScrollSpeed(
        event.clientY,
        top,
        top + area.clientHeight
      );
      if (speed === 0) stop();
      else if (frame === undefined) frame = requestAnimationFrame(step);
    };

    // No `dragover` follows when the pointer leaves the window. `dragleave`
    // also fires when the pointer moves from one element to the next, so only
    // a pointer outside the scroll area stops.
    const onDragLeave = (event: DragEvent) => {
      if (!scroller) return;
      const rect = scroller.getBoundingClientRect();
      const isOutside =
        event.clientX < rect.left ||
        event.clientX >= rect.right ||
        event.clientY < rect.top ||
        event.clientY >= rect.bottom;
      if (isOutside) stop();
    };

    document.addEventListener("dragover", onDragOver, true);
    document.addEventListener("dragleave", onDragLeave, true);
    document.addEventListener("drop", stop, true);
    document.addEventListener("dragend", stop, true);

    return () => {
      stop();
      document.removeEventListener("dragover", onDragOver, true);
      document.removeEventListener("dragleave", onDragLeave, true);
      document.removeEventListener("drop", stop, true);
      document.removeEventListener("dragend", stop, true);
    };
  }, [tableRef, isEnabled]);
};
