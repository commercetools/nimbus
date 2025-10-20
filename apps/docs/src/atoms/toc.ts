import { atom } from "jotai";
import { documentationAtom } from "./documentation";
import { activeRouteAtom } from "./route";

/**
 * Atom to store the table of contents (TOC) for the currently active document.
 * Uses direct lookup to avoid race conditions with derived activeDocAtom.
 */
export const tocAtom = atom(async (get) => {
  const documentation = await get(documentationAtom);
  const activeRoute = get(activeRouteAtom);

  // Look up document directly instead of using derived activeDocAtom
  const activeDoc = Object.values(documentation).find(
    (doc) => doc.meta.route === activeRoute
  );

  // Return the TOC from the active document's metadata, or an empty array if not available
  return activeDoc?.meta.toc || [];
});
