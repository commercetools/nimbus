import { useMemo, useState } from "react";
import { useAtom, useAtomValue } from "jotai";
import { useDebounce } from "use-debounce";
import {
  searchableDocItemsAtom,
  searchQueryAtom,
  type SearchableDocItem,
} from "@/atoms/searchable-docs";
import { semanticEnabledAtom } from "@/atoms/semantic-search";
import Fuse from "fuse.js";
import { useSemanticSearch, type SemanticStatus } from "./use-semantic-search";

/** Debounce applied to the query before it reaches the embedding worker. */
const SEMANTIC_DEBOUNCE_MS = 180;

/**
 * Stable empty-results reference. Returning a fresh `[]` each render makes the
 * ComboBox (with `allowsEmptyCollection`) reprocess a "new" collection every
 * render, which can loop — so reuse this constant.
 */
const EMPTY_RESULTS: SearchableDocItem[] = [];

export const useSearch = () => {
  const [query, setQuery] = useAtom(searchQueryAtom);
  const searchableDocs = useAtomValue(searchableDocItemsAtom);
  const semanticEnabled = useAtomValue(semanticEnabledAtom);
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

  // Perform fuzzy search with Fuse.js (the default path). Skip the work entirely
  // when semantic search is active — otherwise Fuse would run on every keystroke
  // for results that are never shown.
  const fuseResults = useMemo(() => {
    if (semanticEnabled || !query.trim()) {
      return EMPTY_RESULTS;
    }

    return fuse.search(query).map((result) => result.item);
  }, [query, fuse, semanticEnabled]);

  // Semantic path: only the debounced query reaches the worker.
  const [debouncedQuery] = useDebounce(query, SEMANTIC_DEBOUNCE_MS);
  const semantic = useSemanticSearch(
    semanticEnabled,
    searchableDocs || [],
    debouncedQuery
  );

  // Fall back to Fuse whenever semantic search is off or has errored.
  const useFuse = !semanticEnabled || semantic.status === "error";
  const results = useFuse
    ? fuseResults
    : semantic.status === "ready" && query.trim()
      ? semantic.results
      : EMPTY_RESULTS;

  return {
    results,
    open,
    setOpen,
    query,
    setQuery,
    // Semantic-search status surfaced for the dialog's progress/error UI.
    semanticEnabled,
    semanticStatus: semantic.status as SemanticStatus,
    semanticDownloadPercent: semantic.downloadPercent,
    semanticDocCount: semantic.docCount,
  };
};
