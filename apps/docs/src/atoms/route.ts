import { atom } from "jotai";

/**
 * Normalizes a route by removing leading/trailing slashes and handling empty routes.
 * @param route - The route string to normalize
 * @returns Normalized route string
 */
const normalizeRoute = (route: string): string => {
  // Remove leading and trailing slashes
  const cleaned = route.replace(/^\/+|\/+$/g, "");
  // Empty route becomes "home"
  return cleaned || "home";
};

/**
 * Represents the currently active browser route.
 * Initializes from window.location.pathname and normalizes it for consistent matching.
 *
 * @type {string} The current path of the browser without leading/trailing slashes.
 */
export const activeRouteAtom = atom<string>(
  normalizeRoute(window.location.pathname)
);
