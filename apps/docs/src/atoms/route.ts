import { atom } from "jotai";

/** The currently active browser route*/
export const activeRouteAtom = atom(window.location.pathname.slice(1));
