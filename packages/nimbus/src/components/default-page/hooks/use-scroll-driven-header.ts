import { useLayoutEffect, useState } from "react";
import { HEADER_HEIGHT_VARIABLE } from "../constants";
import {
  BACK_ICON_INSET_VARIABLE,
  createScrollDrivenHeaderAnimations,
  measureHeaderForm,
  planScrollDrivenHeader,
} from "../utils";

export type UseScrollDrivenHeaderOptions = {
  /** Turns the behavior on. */
  isEnabled: boolean;
  /** `DefaultPage.Root`: holds the hidden copies and the height variable. */
  containerElement: HTMLElement | null;
  /** The sticky header. */
  headerElement: HTMLElement | null;
  /**
   * Name of the CSS custom property that receives the pinned header height.
   * @default "--default-page-header-height"
   */
  heightVariable?: string;
};

export type UseScrollDrivenHeaderResult = {
  /** `true` while the header is pinned in its collapsed form. */
  isPinned: boolean;
};

/**
 * EXPERIMENT ("scroll-driven"): the sticky header follows the scroll
 * position. See `utils/scroll-driven-header.ts`.
 *
 * Measures the full and the collapsed form, sets the header's sticky `top`
 * to minus the collapse distance, and creates the scroll-driven animations
 * of the header parts. Does it again when the header changes size. Adds no
 * scroll listeners: an `IntersectionObserver` reports when the header is
 * pinned in its collapsed form (only its pinned height is visible).
 *
 * The height variable receives the pinned height.
 */
export function useScrollDrivenHeader({
  isEnabled,
  containerElement,
  headerElement,
  heightVariable = HEADER_HEIGHT_VARIABLE,
}: UseScrollDrivenHeaderOptions): UseScrollDrivenHeaderResult {
  const [isPinned, setIsPinned] = useState(false);

  useLayoutEffect(() => {
    if (!isEnabled || !containerElement || !headerElement) return;
    const container = containerElement;
    const header = headerElement;
    let animations: Animation[] = [];
    let pinObserver: IntersectionObserver | null = null;
    let lastSize = "";

    const setUp = () => {
      const { width, height } = header.getBoundingClientRect();
      const size = `${width}x${height}`;
      if (size === lastSize) return;
      lastSize = size;

      for (const animation of animations) animation.cancel();
      pinObserver?.disconnect();
      pinObserver = null;

      const full = measureHeaderForm(header, container, false);
      const collapsed = measureHeaderForm(header, container, true);
      const plan = planScrollDrivenHeader(full, collapsed);

      header.style.top = `${-plan.distance}px`;
      header.style.setProperty(
        BACK_ICON_INSET_VARIABLE,
        `${plan.backIconInset}px`
      );
      container.style.setProperty(heightVariable, `${plan.pinnedHeight}px`);
      animations = createScrollDrivenHeaderAnimations({
        header,
        root: container,
        full,
        collapsed,
        plan,
      });

      if (plan.distance < 1 || full.height <= 0) {
        setIsPinned(false);
        return;
      }
      // Pinned: no more of the header is visible than its pinned height
      // (with half a pixel of tolerance). Only the ratio is used: Chrome
      // reports `isIntersecting: false` below the first threshold even when
      // part of the header is visible.
      const threshold = Math.min(1, (plan.pinnedHeight + 0.5) / full.height);
      pinObserver = new IntersectionObserver(
        ([entry]) =>
          setIsPinned(
            entry.intersectionRatio > 0 && entry.intersectionRatio < threshold
          ),
        { threshold: [threshold] }
      );
      pinObserver.observe(header);
    };

    setUp();
    // Transforms and opacity do not change the header size, and the compact
    // back link keeps its outer size, so this does not run while scrolling.
    const resizeObserver = new ResizeObserver(setUp);
    resizeObserver.observe(header, { box: "border-box" });

    return () => {
      resizeObserver.disconnect();
      pinObserver?.disconnect();
      for (const animation of animations) animation.cancel();
      header.style.top = "";
      header.style.removeProperty(BACK_ICON_INSET_VARIABLE);
      container.style.removeProperty(heightVariable);
      setIsPinned(false);
    };
  }, [isEnabled, containerElement, headerElement, heightVariable]);

  return { isPinned: isEnabled && isPinned };
}
