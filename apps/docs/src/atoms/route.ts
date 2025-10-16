import { atom } from "jotai";

/**
 * Represents the currently active browser route.
 *
 * @type {string} The current path of the browser without the leading slash.
 *
 * NOTE: Initialized as empty string to avoid SSR/build issues.
 * The actual route is set by RouterProvider on mount.
 */
export const activeRouteAtom = atom<string>("");
