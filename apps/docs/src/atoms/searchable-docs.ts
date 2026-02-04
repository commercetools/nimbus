import { atom } from "jotai";

export type SearchableDocItem = {
  id: string;
  title: string;
  exportName?: string;
  description: string;
  tags: string[];
  route: string;
  menu: string[];
  content: string; // Truncated content for search
};

/**
 * Atom to load the search index
 * Loads from search-index.json which contains lightweight search data
 */
const searchIndexAtom = atom<Promise<SearchableDocItem[]>>(async () => {
  const module = await import("./../data/search-index.json");
  return module.default as SearchableDocItem[];
});

/**
 * Atom to manage searchable documentation items
 * Derives from the search index instead of the full documentation
 */
export const searchableDocItemsAtom = atom(async (get) => {
  const searchIndex = await get(searchIndexAtom);
  return searchIndex;
});

/**
 * Atom for the current search query
 */
export const searchQueryAtom = atom("");
