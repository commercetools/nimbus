import { useMemo, useState } from "react";
import { useAtom, useAtomValue } from "jotai";
import {
  searchableDocItemsAtom,
  searchQueryAtom,
} from "@/src/atoms/searchable-docs";
import Fuse from "fuse.js";

export const useSearch = () => {
  const [query, setQuery] = useAtom(searchQueryAtom);
  const searchableDocs = useAtomValue(searchableDocItemsAtom);

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
      keys: ["title", "description", "content"],
    };

    return new Fuse(searchableDocs || [], fuseOptions);
  }, [searchableDocs]);

  const results = fuse.search(query).map((v) => v.item);

  const [open, setOpen] = useState(false);

  return {
    results,
    open,
    setOpen,
    query,
    setQuery,
  };
};
