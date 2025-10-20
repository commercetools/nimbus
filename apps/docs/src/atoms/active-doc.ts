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
 * Since documentationAtom is async, this atom automatically becomes async too.
 *
 * Route normalization (trailing slash removal, empty route handling) is performed
 * by activeRouteAtom, ensuring consistent matching.
 *
 * @param get - Function to get the value of other atoms.
 * @returns The frontmatter of the active document or undefined if not found.
 */
export const activeDocAtom = atom<Promise<MdxFileFrontmatter | undefined>>(
  async (get) => {
    const activeRoute = get(activeRouteAtom); // Get the normalized active route
    const docs = await get(documentationAtom); // Await the async documentation object

    // Find the document that matches the active route
    const doc: MdxFileFrontmatter | undefined = Object.keys(docs)
      .map((key) => docs[key])
      .find((v) => v.meta.route === activeRoute);

    return doc;
  }
);
