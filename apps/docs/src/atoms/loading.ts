import { atom } from "jotai";

/**
 * Atom to track loading state during route transitions.
 * True when navigating to a new route, false when content is ready.
 */
export const isLoadingAtom = atom<boolean>(false);
