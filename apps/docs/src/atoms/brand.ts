import { atomWithStorage } from "jotai/utils";

/**
 * Atom to store the currently active brand name in local storage.
 *
 * @type {string} The key used for local storage is "brand".
 * @default "@nimbus" The default value if no value is found in local storage.
 */
export const brandNameAtom = atomWithStorage<string>("brand", "@nimbus");
