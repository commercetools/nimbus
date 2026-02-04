import { useMemo, useState } from "react";
import { useAtom, useAtomValue } from "jotai";
import {
  searchableDocItemsAtom,
  searchQueryAtom,
} from "@/atoms/searchable-docs";
import Fuse from "fuse.js";

export const useSearch = () => {
  const [query, setQuery] = useAtom(searchQueryAtom);
  const searchableDocs = useAtomValue(searchableDocItemsAtom);
  const [open, setOpen] = useState(false);

  const fuse = useMemo(() => {
    const fuseOptions = {
      isCaseSensitive: false,
      ignoreLocation: true,
      shouldSort: true,
      ignoreFieldNorm: true,
      includeMatches: true,
      findAllMatches: true,
      useExtendedSearch: false,
      minMatchCharLength: 1,
      threshold: 0.4, // More lenient for better fuzzy matching
      keys: [
        { name: "exportName", weight: 4 }, // Highest priority for exact component names
        { name: "title", weight: 3 },
        { name: "description", weight: 2 },
        { name: "content", weight: 1 },
        { name: "tags", weight: 1.5 },
      ],
    };

    return new Fuse(searchableDocs || [], fuseOptions);
  }, [searchableDocs]);

  // Perform search with fuzzy matching
  const results = useMemo(() => {
    if (!query.trim()) {
      return [];
    }

    return fuse.search(query).map((result) => result.item);
  }, [query, fuse]);

  return {
    results,
    open,
    setOpen,
    query,
    setQuery,
  };
};
