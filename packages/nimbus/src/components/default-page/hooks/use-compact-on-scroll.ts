import { useEffect, useRef, useState } from "react";
import type { DefaultPageCompactHeader } from "../default-page.types";

/**
 * One step of visible area. The observer only reports when the visible
 * fraction crosses a listed threshold. A sentinel wider or taller than the
 * viewport never reaches 0.9, so two thresholds would leave it compact after
 * the user scrolls back to the top.
 */
const THRESHOLD_STEP = 0.01;

export const OBSERVER_THRESHOLDS = Array.from(
  { length: Math.round(1 / THRESHOLD_STEP) + 1 },
  (_, index) => index * THRESHOLD_STEP
);

const EDGE_PX = 1;

export type SentinelBox = {
  top: number;
  bottom: number;
  rootTop: number;
  rootBottom: number;
};

/**
 * Compacts when the sentinel has left through the top of the viewport.
 * Restores when its top edge is back in view, including when the box is
 * clipped by width or by a short viewport. Anything between holds.
 * A sentinel still entirely below the viewport stays expanded.
 */
export function nextPhase(
  prev: DefaultPageCompactHeader,
  box: SentinelBox | null
): DefaultPageCompactHeader {
  if (!box) return prev;
  if (box.bottom <= box.rootTop + EDGE_PX) return "compact";
  if (box.top >= box.rootBottom - EDGE_PX) return "idle";
  if (box.top >= box.rootTop - EDGE_PX) return "idle";
  return prev;
}

/**
 * Decodes the public `stickyHeader` prop. The string value only counts in
 * flexible layout, so a cast that skips the types cannot mount the sentinel.
 */
export function parseStickyHeader(
  layout: "constrained" | "flexible" | undefined,
  stickyHeader: boolean | "compact-on-scroll" | undefined
): { sticky: boolean; compactOnScroll: boolean } {
  if (stickyHeader === "compact-on-scroll") {
    const compactOnScroll = layout === "flexible";
    return { sticky: compactOnScroll, compactOnScroll };
  }
  return { sticky: stickyHeader === true, compactOnScroll: false };
}

function boxOf(entry: IntersectionObserverEntry): SentinelBox | null {
  const root = entry.rootBounds;
  if (!root) return null;
  return {
    top: entry.boundingClientRect.top,
    bottom: entry.boundingClientRect.bottom,
    rootTop: root.top,
    rootBottom: root.bottom,
  };
}

/**
 * Tracks whether the page has scrolled past its header.
 *
 * The observer root is the viewport (`null`), so the browser clips the sentinel
 * against every scrolling ancestor. The scroll container can be any element
 * outside Nimbus, and the hook never needs to find it.
 */
export function useCompactOnScroll(enabled: boolean) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<DefaultPageCompactHeader>("idle");

  useEffect(() => {
    if (!enabled) setPhase("idle");
  }, [enabled]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!enabled || !sentinel || typeof IntersectionObserver === "undefined") {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1];
        setPhase((prev) => nextPhase(prev, boxOf(entry)));
      },
      { root: null, threshold: OBSERVER_THRESHOLDS }
    );
    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [enabled]);

  return { sentinelRef, phase };
}
