import { atom } from "jotai";

/**
 * Represents the currently active browser route.
 *
 * @type {string} The current path of the browser without the leading slash.
 */
export const activeRouteAtom = atom<string>(window.location.pathname.slice(1));
