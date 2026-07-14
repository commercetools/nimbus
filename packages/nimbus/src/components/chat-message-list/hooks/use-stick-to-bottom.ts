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
   * Callback ref for the growing content flow *inside* the viewport (the element
   * that holds the items). This is what a `ResizeObserver` must watch — the
   * `ScrollArea` locks its own content wrapper to the viewport height, so only
   * this inner flow actually grows as messages are appended or streamed.
   *
   * It is a callback ref (not a `RefObject`) on purpose: the content flow is only
   * mounted once the list has items, so an empty transcript that receives its
   * first message attaches this element *after* mount. A callback ref lets the
   * observer bind the moment the node appears (and unbind when it goes away),
   * which a mount-once effect reading a `RefObject` would miss.
   */
  contentRef: React.RefCallback<HTMLDivElement>;
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
 * follows both without the caller wiring anything up. All growth-driven scrolling
 * is coalesced into a single `requestAnimationFrame` write per frame, so a burst
 * of streamed tokens does at most one layout read + one scroll write per frame
 * rather than one per mutation.
 */
export const useStickToBottom = ({
  enabled,
}: UseStickToBottomOptions): UseStickToBottomReturn => {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [isPinned, setIsPinned] = useState(true);

  // Mirror reactive values into refs so the observer callbacks (registered
  // once) always read the latest value without re-subscribing.
  const pinnedRef = useRef(true);
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;

  // The content flow node and the live ResizeObserver, tracked in refs so the
  // callback ref can (un)observe regardless of when the node mounts relative to
  // the observer-setup effect.
  const contentNodeRef = useRef<HTMLDivElement | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  // Coalescing + programmatic-scroll bookkeeping.
  const stickScheduledRef = useRef(false);
  const disposedRef = useRef(false);
  // A smooth/animated programmatic scroll is in flight: keep the pin engaged
  // (don't flicker the jump control) until we actually reach the bottom.
  const programmaticScrollRef = useRef(false);

  const setPinned = useCallback((next: boolean) => {
    pinnedRef.current = next;
    setIsPinned(next);
  }, []);

  // Follow content growth while pinned. Coalesced onto a microtask so a stream
  // burst that fires the Resize/Mutation observers many times performs a single
  // layout read + scrollTop write — while still running promptly and reliably
  // (unlike requestAnimationFrame, a microtask is not throttled when the tab is
  // hidden, which a background chat transcript still needs to follow).
  const scheduleStick = useCallback(() => {
    if (stickScheduledRef.current) return;
    stickScheduledRef.current = true;
    queueMicrotask(() => {
      stickScheduledRef.current = false;
      if (disposedRef.current) return;
      const el = viewportRef.current;
      if (!el) return;
      if (enabledRef.current && pinnedRef.current) {
        // Stick to the newest content. The resulting scroll event re-derives the
        // pin as `true` (we are at the bottom), so no feedback loop.
        el.scrollTop = el.scrollHeight;
      }
    });
  }, []);

  const scrollToBottom = useCallback(
    (behavior: ScrollBehavior = "auto") => {
      const el = viewportRef.current;
      if (!el) return;
      const effective = prefersReducedMotion() ? "auto" : behavior;
      // A smooth scroll animates over several frames; suppress pin-release for
      // its duration so the jump-to-latest control doesn't flicker back in.
      programmaticScrollRef.current = true;
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
      const atBottom = distanceFromBottom <= BOTTOM_THRESHOLD_PX;

      // While an intentional programmatic scroll animates toward the bottom, hold
      // the pin engaged (so the jump control doesn't flicker back) until we
      // arrive; then release the guard and resume normal position tracking.
      if (programmaticScrollRef.current) {
        if (!atBottom) return;
        programmaticScrollRef.current = false;
      }

      setPinned(atBottom);
    };

    el.addEventListener("scroll", update, { passive: true });
    update();

    return () => el.removeEventListener("scroll", update);
  }, [setPinned]);

  // Set up the growth observers once. The ResizeObserver watches the viewport
  // and (via the callback ref) the inner content flow; the MutationObserver
  // catches appended items / streamed text between frames. Both route through
  // `scheduleStick` so scrolling is coalesced.
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    disposedRef.current = false;

    // Start at the newest message. This effect runs after the scroll-tracking
    // effect (which may have derived `pinned=false` from the initial
    // scrollTop=0), so re-assert the pin here before observing growth.
    if (enabledRef.current) {
      el.scrollTop = el.scrollHeight;
      setPinned(true);
    }

    const resizeObserver = new ResizeObserver(scheduleStick);
    resizeObserverRef.current = resizeObserver;
    resizeObserver.observe(el);
    // Observe the inner content flow if it is already mounted (list started with
    // items). If the list started empty, the callback ref attaches it later.
    if (contentNodeRef.current) resizeObserver.observe(contentNodeRef.current);

    const mutationObserver = new MutationObserver(scheduleStick);
    mutationObserver.observe(el, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      disposedRef.current = true;
      resizeObserver.disconnect();
      resizeObserverRef.current = null;
      mutationObserver.disconnect();
    };
  }, [scheduleStick, setPinned]);

  // Attach/detach the content flow to the ResizeObserver as it mounts/unmounts.
  // This is what makes an empty → first-item transition observe correctly: the
  // viewport slot (and thus this node) only exists once the list has items.
  const contentRef = useCallback<React.RefCallback<HTMLDivElement>>((node) => {
    const ro = resizeObserverRef.current;
    if (contentNodeRef.current && ro) ro.unobserve(contentNodeRef.current);
    contentNodeRef.current = node;
    if (node && ro) ro.observe(node);
  }, []);

  return { viewportRef, contentRef, isPinned, scrollToBottom };
};
