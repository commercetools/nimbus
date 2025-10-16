import { atom } from "jotai";
import { activeDocAtom } from "./active-doc";
import { documentationAtom } from "./documentation";
import { MdxFileFrontmatter } from "../types";

/**
 * Derived atom that filters and sorts documents in the same category as the active document.
 * This memoizes the filtering/sorting logic for better performance.
 *
 * @param get - Function to get the value of other atoms.
 * @returns Sorted array of documents in the same category, excluding the active document.
 */
export const categoryDocsAtom = atom<MdxFileFrontmatter[]>((get) => {
  const activeDoc = get(activeDocAtom);
  const documentation = get(documentationAtom);

  if (!activeDoc) {
    return [];
  }

  // Get the current category (first item in the menu array)
  const currentCategory = activeDoc.meta.menu[0];

  // If there's a second level in the menu, use that for a more specific category
  const subcategory =
    activeDoc.meta.menu.length > 1 ? activeDoc.meta.menu[1] : null;

  // Find all documents that are in the same category
  const categoryDocs = Object.values(documentation).filter((doc) => {
    // Make sure we're in the same top-level category
    if (doc.meta.menu[0] !== currentCategory) {
      return false;
    }
    // Don't include currently active document
    if (doc.meta.route === activeDoc.meta.route) {
      return false;
    }

    // If we're in a subcategory page, only show documents with the same first and second level
    if (subcategory && activeDoc.meta.menu.length > 1) {
      return doc.meta.menu.length > 1 && doc.meta.menu[1] === subcategory;
    }

    // If we're at the category root, only show direct subcategories
    return (
      doc.meta.menu.length === 2 && doc.meta.route !== activeDoc.meta.route
    );
  });

  // Sort the documents by their order property
  return categoryDocs.sort((a, b) => {
    return (a.meta.order || 999) - (b.meta.order || 999);
  });
});
