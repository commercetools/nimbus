import { atomWithStorage } from "jotai/utils";

/**
 * Atom to store the user's preference for displaying absolute
 * dimensional CSS values in px (or, if false, in rem)
 */
export const preferPxAtom = atomWithStorage<boolean>("prefer-px", true);
