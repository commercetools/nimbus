import { useEffect, useRef } from "react";

/**
 * Idle delay: milliseconds of no activity (no move, no scroll) before the bar
 * fades out. This is a fixed, universal part of the auto-hide behavior — there
 * is no consumer-facing prop for it. Exported so the hook's spec asserts timing
 * against the real value instead of a hand-copied literal.
 */
export const AUTO_HIDE_DELAY_MS = 1000;

/**
 * How near (in px) the pointer must come to a scrollbar — after the bar has
 * already idle-hidden — for movement alone to bring it back. This lets a user
 * reach for the thumb by moving toward the edge, while a reader whose pointer
 * rests in the content middle is left undisturbed (movement there never
 * re-flashes the bar). Measured geometrically against the scrollbar's box on
 * the root's `mousemove`, because the hidden bar is `pointer-events: none` and
 * so cannot report its own hover.
 */
const REVEAL_PROXIMITY_PX = 24;

/**
 * Attribute written on the ScrollArea root while the bar should be visible. The
 * recipe's `auto-hide` visibility variant keys the scrollbar/corner opacity (and
 * `pointer-events`) off it.
 */
export const SCROLLBAR_VISIBLE_ATTR = "data-scrollbar-visible";

export type UseScrollbarAutoHideOptions = {
  /**
   * When `false` the hook does nothing. Used for the `always` visibility, whose
   * bar is permanently visible via CSS regardless of this attribute.
   */
  enabled: boolean;
  /** The ScrollArea root element — receives mouse enter/leave/move. */
  rootRef: React.RefObject<HTMLDivElement | null>;
  /** The scrollable viewport element — receives the scroll event. */
  viewportRef: React.RefObject<HTMLDivElement | null>;
};

/**
 * Auto-hide the ScrollArea scrollbar when the user is idle.
 *
 * Per visit (from mouse enter to mouse leave):
 * 1. Mouse enters → show the bar, start an idle timer.
 * 2. Mouse keeps moving → stay shown; each move resets the idle timer.
 * 3. Mouse stops for the idle delay → hide.
 * 4. After that, movement reveals the bar again only when the pointer is near a
 *    scrollbar (reaching for the thumb); scrolling always reveals it.
 * 5. Mouse leaves → reset, so the next enter starts again at step 1.
 *
 * Touch and keyboard produce no mouse enter/move, so they get only the
 * scroll-driven reveal — the native expectation there.
 *
 * The visible state is written straight to the DOM as a data attribute (not
 * React state) on purpose: `mousemove` fires very often and must not re-render
 * the component on every event.
 */
export const useScrollbarAutoHide = ({
  enabled,
  rootRef,
  viewportRef,
}: UseScrollbarAutoHideOptions): void => {
  // Kept in refs so the listeners (registered once) always read the latest
  // value without needing to re-subscribe.
  const visibleRef = useRef(false);
  // "armed" = a fresh visit; any mouse movement reveals the bar.
  // "scroll-only" = the bar has idle-hidden; now only scrolling, or movement
  // near a scrollbar, reveals it.
  const phaseRef = useRef<"armed" | "scroll-only">("armed");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    const viewport = viewportRef.current;
    if (!enabled || !root || !viewport) return;

    const show = () => {
      if (visibleRef.current) return;
      visibleRef.current = true;
      root.setAttribute(SCROLLBAR_VISIBLE_ATTR, "");
    };

    const hide = () => {
      if (!visibleRef.current) return;
      visibleRef.current = false;
      root.removeAttribute(SCROLLBAR_VISIBLE_ATTR);
    };

    const clearTimer = () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };

    // Reveal + (re)arm the idle timer. When it fires, hide and drop into the
    // scroll-only phase.
    const bump = () => {
      show();
      clearTimer();
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        hide();
        phaseRef.current = "scroll-only";
      }, AUTO_HIDE_DELAY_MS);
    };

    // True when the pointer is within REVEAL_PROXIMITY_PX of any scrollbar that
    // is currently laid out. A scrollbar whose axis isn't overflowing is
    // `display: none` and reports a zero-size box, so it is skipped. Reading the
    // box geometry (rather than the bar's own hover) is what lets this work
    // while the hidden bar is `pointer-events: none`, and it stays correct for
    // horizontal/vertical bars and RTL without any direction logic here.
    const pointerNearScrollbar = (event: MouseEvent): boolean => {
      const scrollbars = Array.from(
        root.querySelectorAll<HTMLElement>('[data-part="scrollbar"]')
      );
      for (const bar of scrollbars) {
        const rect = bar.getBoundingClientRect();
        if (rect.width === 0 && rect.height === 0) continue;
        if (
          event.clientX >= rect.left - REVEAL_PROXIMITY_PX &&
          event.clientX <= rect.right + REVEAL_PROXIMITY_PX &&
          event.clientY >= rect.top - REVEAL_PROXIMITY_PX &&
          event.clientY <= rect.bottom + REVEAL_PROXIMITY_PX
        ) {
          return true;
        }
      }
      return false;
    };

    const onMouseEnter = () => {
      phaseRef.current = "armed";
      bump();
    };

    const onMouseMove = (event: MouseEvent) => {
      // Armed → any movement keeps it up. Scroll-only → only movement toward a
      // scrollbar reveals it, so a resting reader isn't distracted but reaching
      // for the thumb still works.
      if (phaseRef.current === "armed" || pointerNearScrollbar(event)) bump();
    };

    const onScroll = () => {
      // Scrolling reveals in both phases (this is the one signal touch and
      // keyboard also produce).
      bump();
    };

    const onMouseLeave = () => {
      clearTimer();
      hide();
      // Re-arm so the next enter gets a fresh entry reveal.
      phaseRef.current = "armed";
    };

    root.addEventListener("mouseenter", onMouseEnter);
    root.addEventListener("mousemove", onMouseMove, { passive: true });
    root.addEventListener("mouseleave", onMouseLeave);
    viewport.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      clearTimer();
      root.removeEventListener("mouseenter", onMouseEnter);
      root.removeEventListener("mousemove", onMouseMove);
      root.removeEventListener("mouseleave", onMouseLeave);
      viewport.removeEventListener("scroll", onScroll);
      hide();
    };
  }, [enabled, rootRef, viewportRef]);
};
