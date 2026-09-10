import { useEffect, useRef } from "react";

/**
 * Auto-hide tuning. Internal on purpose — there is no consumer-facing prop for
 * this. Change these values to switch strategy without touching the machine:
 *
 * - **Pure scroll-only** (the bar shows only while scrolling): set
 *   `revealOnEnter: false`.
 * - **Movement always reveals** (macOS overlay style — any mouse move brings it
 *   back, even after it hid): set `revealOnMoveAlways: true`.
 * - **Tune the wait**: change `hideDelay`.
 */
const AUTO_HIDE = {
  /** Milliseconds of no activity (no move, no scroll) before the bar hides. */
  hideDelay: 600,
  /** Show the bar briefly when the mouse first enters the area. */
  revealOnEnter: true,
  /**
   * After the entry reveal has ended once (the mouse stopped moving), keep
   * revealing on any further mouse movement. `false` = for the rest of the
   * visit only scrolling reveals the bar — the reading-friendly default, so a
   * resting reader who nudges the mouse does not keep flashing the bar.
   */
  revealOnMoveAlways: false,
} as const;

/**
 * Attribute written on the ScrollArea root while the bar should be visible. The
 * recipe's `hover` variant keys the scrollbar/corner opacity off it.
 */
export const SCROLLBAR_VISIBLE_ATTR = "data-scrollbar-visible";

export type UseScrollbarAutoHideOptions = {
  /**
   * When `false` the hook does nothing. Used for the `always` variant, whose
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
 * 3. Mouse stops for `hideDelay` → hide; movement no longer reveals the bar.
 * 4. Only scrolling reveals it again (then it hides after scrolling stops).
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
  // "armed" = mouse movement still reveals the bar (a fresh visit).
  // "scroll-only" = the entry reveal has ended; only scrolling reveals it now.
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
    // scroll-only phase so further movement is ignored until the mouse leaves.
    const bump = () => {
      show();
      clearTimer();
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        hide();
        phaseRef.current = "scroll-only";
      }, AUTO_HIDE.hideDelay);
    };

    const onMouseEnter = () => {
      if (AUTO_HIDE.revealOnEnter) {
        phaseRef.current = "armed";
        bump();
      } else {
        // Pure scroll-only: movement must never reveal, so start locked out.
        phaseRef.current = "scroll-only";
      }
    };

    const onMouseMove = () => {
      if (AUTO_HIDE.revealOnMoveAlways || phaseRef.current === "armed") bump();
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
