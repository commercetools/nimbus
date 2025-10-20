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
 * This atom handles route normalization to ensure consistent matching:
 * - Empty routes are treated as "home"
 * - Routes are normalized for consistent comparison
 *
 * @param get - Function to get the value of other atoms.
 * @returns The frontmatter of the active document or undefined if not found.
 */
export const activeDocAtom = atom<Promise<MdxFileFrontmatter | undefined>>(
  async (get) => {
    const activeRoute = get(activeRouteAtom); // Get the current active route
    const docs = await get(documentationAtom); // Await the async documentation object

    // Normalize route: empty route becomes "home"
    const normalizedRoute = activeRoute || "home";

    // Find the document that matches the active route
    const doc: MdxFileFrontmatter | undefined = Object.keys(docs)
      .map((key) => docs[key])
      .find((v) => v.meta.route === normalizedRoute);

    return doc;
  }
);
