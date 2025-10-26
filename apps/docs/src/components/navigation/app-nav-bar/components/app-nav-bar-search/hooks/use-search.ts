import { useMemo, useState, useEffect, useCallback } from "react";
import { useAtom, useAtomValue } from "jotai";
import { atomWithStorage } from "jotai/utils";
import {
  searchableDocItemsAtom,
  searchQueryAtom,
} from "@/atoms/searchable-docs";
import Fuse from "fuse.js";

// Search history atom (persisted to localStorage)
export const searchHistoryAtom = atomWithStorage<string[]>(
  "nimbus-search-history",
  []
);

// Search analytics
const logSearchAnalytics = (query: string, resultsCount: number) => {
  // In production, this would send to an analytics service
  console.log("[Search Analytics]", {
    query,
    resultsCount,
    timestamp: new Date().toISOString(),
  });
};

export type SearchFilters = {
  category?: string;
  tags?: string[];
};

export const useSearch = () => {
  const [query, setQuery] = useAtom(searchQueryAtom);
  const [history, setHistory] = useAtom(searchHistoryAtom);
  const searchableDocs = useAtomValue(searchableDocItemsAtom);
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});

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
        { name: "title", weight: 3 }, // Title is most important
        { name: "description", weight: 2 },
        { name: "content", weight: 1 },
        { name: "tags", weight: 1.5 },
      ],
    };

    return new Fuse(searchableDocs || [], fuseOptions);
  }, [searchableDocs]);

  // Perform search with fuzzy matching and filters
  const searchResults = useMemo(() => {
    if (!query.trim()) {
      return [];
    }

    let results = fuse.search(query).map((result) => ({
      item: result.item,
      matches: result.matches || [],
      score: result.score || 0,
    }));

    // Apply category filter
    if (filters.category) {
      results = results.filter((r) => r.item.category === filters.category);
    }

    // Apply tag filters
    if (filters.tags && filters.tags.length > 0) {
      results = results.filter((r) =>
        filters.tags!.some((tag) => r.item.tags?.includes(tag))
      );
    }

    return results;
  }, [query, fuse, filters]);

  const results = searchResults.map((r) => r.item);
  const highlightedResults = searchResults;

  // Add to search history when query changes
  useEffect(() => {
    if (query.trim() && results.length > 0) {
      const trimmedQuery = query.trim();
      // Add to history if not already present
      if (!history.includes(trimmedQuery)) {
        setHistory([trimmedQuery, ...history.slice(0, 9)]); // Keep last 10
      }
    }
  }, [query, results.length]);

  // Log analytics when search completes
  useEffect(() => {
    if (query.trim()) {
      logSearchAnalytics(query, results.length);
    }
  }, [query, results.length]);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, [setHistory]);

  const removeHistoryItem = useCallback(
    (queryToRemove: string) => {
      setHistory(history.filter((q) => q !== queryToRemove));
    },
    [history, setHistory]
  );

  return {
    results,
    highlightedResults,
    open,
    setOpen,
    query,
    setQuery,
    history,
    clearHistory,
    removeHistoryItem,
    filters,
    setFilters,
  };
};
