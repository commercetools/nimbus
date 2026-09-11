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
 * How far outside a bar's painted box its clickable region still reaches: the
 * `_before` pseudo-element widens the hit area by the scrollbar margin
 * (`--scroll-area-scrollbar-margin` = `sizes.50` = 2px) on each side. The
 * "resting on the bar" check uses this so the hide stays suspended across the
 * whole clickable band, not just the painted box — otherwise a click in that
 * 2px strip would fall through. Kept in sync with the token by hand (a fixed
 * 2px; reading the custom property per event isn't worth it).
 */
const SCROLLBAR_HIT_MARGIN_PX = 2;

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
 * 3. Mouse stops for the idle delay → hide — unless the pointer is resting
 *    directly on a bar, in which case it stays shown (as on macOS/Radix) so it
 *    never vanishes mid-reach.
 * 4. After it hides, movement reveals it again only when the pointer is near a
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
    // Position of the last mouse move within the root. Used to tell whether the
    // pointer is resting on a bar — including when a reveal is driven by scroll,
    // which carries no coordinates of its own.
    let lastPointer: { x: number; y: number } | null = null;

    // Boxes of this root's own scrollbars that are currently laid out. Direct
    // children only (`:scope >`) so a nested ScrollArea's bars never count — the
    // mirror of the `> &` reveal selector in the recipe. A bar whose axis isn't
    // overflowing is `display: none` and reports a zero-size box, so it drops
    // out. Reading geometry (not the bar's own hover) is what lets this work
    // while the hidden bar is `pointer-events: none`, and it stays correct for
    // horizontal/vertical bars and RTL with no direction logic here.
    const scrollbarRects = (): DOMRect[] =>
      Array.from(
        root.querySelectorAll<HTMLElement>(':scope > [data-part="scrollbar"]')
      )
        .map((bar) => bar.getBoundingClientRect())
        .filter((rect) => rect.width !== 0 || rect.height !== 0);

    const withinBar = (x: number, y: number, margin: number): boolean =>
      scrollbarRects().some(
        (rect) =>
          x >= rect.left - margin &&
          x <= rect.right + margin &&
          y >= rect.top - margin &&
          y <= rect.bottom + margin
      );

    // The pointer is resting on a bar — within its clickable hit band, so this
    // matches where a click would actually land on the bar.
    const pointerOnBar = (): boolean =>
      lastPointer !== null &&
      withinBar(lastPointer.x, lastPointer.y, SCROLLBAR_HIT_MARGIN_PX);

    const scheduleHide = () => {
      clearTimer();
      timerRef.current = setTimeout(() => {
        // Don't hide out from under a pointer parked on the bar: it would vanish
        // mid-reach and the next click — which fires no `mousemove` first — would
        // fall through to the content. macOS/Radix/Windows all suspend the hide
        // while the pointer is over the bar. Re-checked on the same cadence (and
        // keyed on the last pointer position, so a scroll-driven arm respects it
        // too); a move off the bar lets it hide normally.
        if (pointerOnBar()) {
          scheduleHide();
          return;
        }
        timerRef.current = null;
        hide();
        phaseRef.current = "scroll-only";
      }, AUTO_HIDE_DELAY_MS);
    };

    const bump = () => {
      show();
      scheduleHide();
    };

    const onMouseEnter = (event: MouseEvent) => {
      // Seed the pointer position from the enter event: when the area slides
      // under a stationary cursor (page/ancestor scroll) some browsers fire
      // `mouseenter` with no following `mousemove`, and the rest-on-bar guard
      // would otherwise be blind for the whole first visit.
      lastPointer = { x: event.clientX, y: event.clientY };
      phaseRef.current = "armed";
      bump();
    };

    const onMouseMove = (event: MouseEvent) => {
      lastPointer = { x: event.clientX, y: event.clientY };
      // Armed → any movement keeps it up. Scroll-only → only movement within the
      // proximity halo of a bar reveals it, so a resting reader isn't distracted
      // but reaching for the thumb still works.
      if (
        phaseRef.current === "armed" ||
        withinBar(event.clientX, event.clientY, REVEAL_PROXIMITY_PX)
      ) {
        bump();
      }
    };

    const onScroll = () => {
      // Scrolling reveals in both phases (this is the one signal touch and
      // keyboard also produce).
      bump();
    };

    const onMouseLeave = () => {
      lastPointer = null;
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
