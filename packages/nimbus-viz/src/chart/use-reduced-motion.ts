import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Shared motion tokens. Durations are in milliseconds. Use these ONLY behind
 * {@link useReducedMotion} so animation is opt-out for viewers who ask for
 * reduced motion. There is no motion in the library today — this establishes
 * the policy and the single source of durations/easings before the first
 * animated affordance is added, so charts don't each invent their own.
 */
export const MOTION = {
  duration: { fast: 120, base: 200, slow: 320 },
  easing: {
    standard: "cubic-bezier(0.2, 0, 0, 1)",
    emphasized: "cubic-bezier(0.3, 0, 0, 1)",
  },
} as const;

function prefersReduced(): boolean {
  if (
    typeof window === "undefined" ||
    typeof window.matchMedia !== "function"
  ) {
    return false;
  }
  return window.matchMedia(QUERY).matches;
}

/**
 * `true` when the viewer has asked the OS to reduce motion. Any chart
 * animation must gate on this. SSR / jsdom without `matchMedia` resolves to
 * `false` (motion assumed safe) and never throws.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState<boolean>(prefersReduced);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof window.matchMedia !== "function"
    ) {
      return;
    }
    const mql = window.matchMedia(QUERY);
    const onChange = () => setReduced(mql.matches);
    onChange();
    mql.addEventListener?.("change", onChange);
    return () => mql.removeEventListener?.("change", onChange);
  }, []);

  return reduced;
}
