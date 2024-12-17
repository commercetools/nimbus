import { atom } from "jotai";
import { activeDocAtom } from "./active-doc.ts";

/**
 * Atom to store the table of contents (TOC) for the currently active document.
 * It derives its value from the activeDocAtom.
 */
export const tocAtom = atom((get) => {
  const activeDoc = get(activeDocAtom);
  // Return the TOC from the active document's metadata, or an empty array if not available
  return activeDoc?.meta.toc || [];
});
