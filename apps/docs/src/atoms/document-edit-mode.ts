import { atomWithStorage } from "jotai/utils";

/**
 * Atom to store if the document-edit mode is currently active.
 *
 * @type {boolean} - The state of the document-edit mode.
 * @default false - The default state is inactive (false).
 */
export const documentEditModeAtom = atomWithStorage<boolean>(
  "documentEditMode",
  false
);
