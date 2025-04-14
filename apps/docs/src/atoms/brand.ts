import { atom } from "jotai";

/**
 * Atom to store the brand name.
 *
 * @type {string} The hardcoded brand name.
 * @default "Nimbus" The system name.
 */
export const brandNameAtom = atom<string>("Nimbus");
