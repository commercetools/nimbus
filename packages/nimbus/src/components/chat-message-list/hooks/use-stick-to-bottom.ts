import { useCallback, useEffect, useRef, useState } from "react";

/**
 * How close to the bottom (in px) still counts as "at the bottom". A small
 * threshold absorbs sub-pixel rounding and lets a nearly-bottom user stay
 * pinned as content streams in.
 */
const BOTTOM_THRESHOLD_PX = 32;

export type UseStickToBottomOptions = {
  /**
   * When `true`, the viewport auto-pins to the newest content while the user is
   * at the bottom. When `false`, scroll position is still tracked (so callers
   * can reflect it in UI) but nothing scrolls automatically.
   */
  enabled: boolean;
};

export type UseStickToBottomReturn = {
  /** Attach to the scroll viewport (the `ScrollArea`'s `viewportRef`). */
  viewportRef: React.RefObject<HTMLDivElement | null>;
  /**
   * Attach to the growing content flow *inside* the viewport (the element that
   * holds the items). This is what a `ResizeObserver` must watch — the
   * `ScrollArea` locks its own content wrapper to the viewport height, so only
   * this inner flow actually grows as messages are appended or streamed.
   */
  contentRef: React.RefObject<HTMLDivElement | null>;
  /** Whether the viewport is currently pinned at (or near) the bottom. */
  isPinned: boolean;
  /** Scroll to the bottom and re-engage the pin; honors reduced-motion. */
  scrollToBottom: (behavior?: ScrollBehavior) => void;
};

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Stick-to-bottom scroll behavior for a chat transcript.
 *
 * Operates on the scroll viewport node (the element that actually scrolls —
 * `ScrollArea`'s `viewportRef`). While the user is at the bottom, appended and
 * streamed content keeps the newest message in view; once the user scrolls up
 * beyond a small threshold the pin releases so reading history is not
 * interrupted. Returning to the bottom (or calling `scrollToBottom`) re-engages
 * the pin.
 *
 * Content growth is observed with a `ResizeObserver` (streaming text growing the
 * last item) and a `MutationObserver` (new items appended), so a pinned view
 * follows both without the caller wiring anything up.
 */
export const useStickToBottom = ({
  enabled,
}: UseStickToBottomOptions): UseStickToBottomReturn => {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [isPinned, setIsPinned] = useState(true);

  // Mirror reactive values into refs so the observer callbacks (registered
  // once) always read the latest value without re-subscribing.
  const pinnedRef = useRef(true);
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;

  const setPinned = useCallback((next: boolean) => {
    pinnedRef.current = next;
    setIsPinned(next);
  }, []);

  const scrollToBottom = useCallback(
    (behavior: ScrollBehavior = "auto") => {
      const el = viewportRef.current;
      if (!el) return;
      const effective = prefersReducedMotion() ? "auto" : behavior;
      el.scrollTo({ top: el.scrollHeight, behavior: effective });
      setPinned(true);
    },
    [setPinned]
  );

  // Track the user's scroll position → derive whether we are pinned.
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const update = () => {
      const distanceFromBottom =
        el.scrollHeight - el.scrollTop - el.clientHeight;
      setPinned(distanceFromBottom <= BOTTOM_THRESHOLD_PX);
    };

    el.addEventListener("scroll", update, { passive: true });
    update();

    return () => el.removeEventListener("scroll", update);
  }, [setPinned]);

  // Follow content growth while pinned: streaming (last item grows) and
  // appends (new items) both keep the newest content in view.
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const stickIfPinned = () => {
      if (enabledRef.current && pinnedRef.current) {
        el.scrollTop = el.scrollHeight;
      }
    };

    // Start at the newest message. This effect runs after the scroll-tracking
    // effect (which may have derived `pinned=false` from the initial
    // scrollTop=0), so re-assert the pin here before observing growth.
    if (enabledRef.current) {
      el.scrollTop = el.scrollHeight;
      setPinned(true);
    }

    const resizeObserver = new ResizeObserver(stickIfPinned);
    resizeObserver.observe(el);
    // Observe the inner content flow, not the viewport (whose size is fixed) —
    // this is the element that grows as messages stream or are appended.
    const content = contentRef.current;
    if (content) resizeObserver.observe(content);

    // Catch mutations the ResizeObserver might miss between frames: appended
    // items (`childList`) and streamed text updates (`characterData`).
    const mutationObserver = new MutationObserver(stickIfPinned);
    mutationObserver.observe(el, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [setPinned]);

  return { viewportRef, contentRef, isPinned, scrollToBottom };
};
