import { atom } from "jotai";
import { documentationAtom } from "./documentation";
import { activeRouteAtom } from "./route";
import { MdxFileFrontmatter } from "../types";

/**
 * Atom to store the ID of the active document.
 */
export const activeDocIdAtom = atom<string>("Home");

/**
 * Atom to derive the active document based on the active route.
 *
 * @param get - Function to get the value of other atoms.
 * @returns The frontmatter of the active document or undefined if not found.
 */
export const activeDocAtom = atom<MdxFileFrontmatter | undefined>((get) => {
  const activeRoute = get(activeRouteAtom); // Get the current active route
  const docs = get(documentationAtom); // Get the documentation object

  // Find the document that matches the active route
  const doc: MdxFileFrontmatter | undefined = Object.keys(docs)
    .map((key) => docs[key])
    .find((v) => v.meta.route === activeRoute);

  return doc;
});
