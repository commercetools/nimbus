import { useSyncExternalStore } from "react";
import { supportsScrollDrivenHeader } from "../utils";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

const subscribe = (onChange: () => void) => {
  if (typeof window === "undefined" || !window.matchMedia) return () => {};
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

const getSnapshot = () =>
  supportsScrollDrivenHeader(typeof window === "undefined" ? null : window);

// Server rendering and hydration: the one-step change. The first render's
// markup is the same in both techniques.
const getServerSnapshot = () => false;

/**
 * Whether the header can use the scroll-driven collapse: the browser supports
 * view and scroll timelines, and the user does not prefer reduced motion.
 * Updates when the reduced-motion preference changes.
 */
export const useScrollDrivenSupport = (): boolean =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
