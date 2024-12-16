import { atomWithStorage } from "jotai/utils";

/**
 * Atom to store if the document-edit mode is currently active
 */
export const documentEditModeAtom = atomWithStorage<boolean>(
  "documentEditMode",
  false
);
