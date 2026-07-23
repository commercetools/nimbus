import { useEffect, useMemo, useState } from "react";
import { useAtom, useAtomValue } from "jotai";
import { useDebounce } from "use-debounce";
import {
  searchableDocItemsAtom,
  searchQueryAtom,
  type SearchableDocItem,
} from "@/atoms/searchable-docs";
import { semanticEnabledAtom } from "@/atoms/semantic-search";
import Fuse from "fuse.js";
import {
  useSemanticSearch,
  type SemanticStatus,
} from "@/semantic-search/use-semantic-search";
import {
  categorize,
  getItemCategory,
  type SearchCategoryKey,
} from "../search-categories";

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
  const [selectedCategory, setSelectedCategory] =
    useState<SearchCategoryKey>("all");

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

  // A second, deliberately strict Fuse used only for the hybrid lexical rescue
  // (see `lexicalRescue` below). It searches *names only* (exportName + title),
  // location-anchored with a low threshold, so it returns genuine name matches —
  // exact, prefix, and small typos ("Bu" → "Button", "calender" → "Calendar") —
  // but NOT loose content/description fuzz. That fuzz (e.g. "divider" matching
  // "Nimbus provider", or "divides" buried in Separator's body) is exactly the
  // noise the lenient config scores as a perfect 0; matching meaning there is
  // semantic search's job, not the lexical pass's.
  const nameFuse = useMemo(
    () =>
      new Fuse(searchableDocs || [], {
        isCaseSensitive: false,
        ignoreLocation: false,
        shouldSort: true,
        ignoreFieldNorm: true,
        includeScore: true,
        minMatchCharLength: 2,
        threshold: 0.3,
        keys: [
          { name: "exportName", weight: 2 },
          { name: "title", weight: 1 },
        ],
      }),
    [searchableDocs]
  );

  // Pure fuzzy search (lenient, all fields). This is the result list used when
  // semantic search is off or has errored — the unchanged default behavior.
  const fuseResults = useMemo(() => {
    if (!query.trim()) {
      return EMPTY_RESULTS;
    }

    return fuse.search(query).map((result) => result.item);
  }, [query, fuse]);

  // Lexical rescue for the hybrid path: strict name matches that semantic search
  // fundamentally can't produce (it reads "Bu" as a word, not a prefix of
  // "Button"). Intentionally narrow — only these lead the hybrid list.
  const lexicalRescue = useMemo(() => {
    if (!query.trim()) {
      return EMPTY_RESULTS;
    }

    return nameFuse.search(query).map((result) => result.item);
  }, [query, nameFuse]);

  // Semantic path: only the debounced query reaches the worker.
  const [debouncedQuery] = useDebounce(query, SEMANTIC_DEBOUNCE_MS);
  const semantic = useSemanticSearch(
    semanticEnabled,
    searchableDocs || [],
    debouncedQuery
  );

  // Hybrid merge: strict name matches first, then semantic results.
  //
  // The two rankers produce incomparable scores — Fuse returns a distance in
  // [0,1] (lower is better), semantic returns cosine similarity (higher is
  // better) — so we don't blend raw scores. Instead we fuse by rank with a
  // domain rule: a genuine *name* match should always win (it's what semantic
  // can't do), so the strict `lexicalRescue` matches lead, then any semantic
  // results not already present (in similarity order), deduped by id. Crucially
  // the lead list is the strict name search, NOT the lenient `fuseResults` —
  // the lenient pass fuzzes against body text and would drag noise (e.g.
  // "divider" → "Nimbus provider") above strong semantic hits. Until the index
  // is ready `semantic.results` is empty, so this degrades to name-only while
  // the model downloads/indexes, then becomes hybrid.
  const mergedResults = useMemo(() => {
    const seen = new Set<string>();
    const merged: SearchableDocItem[] = [];
    for (const item of lexicalRescue) {
      if (seen.has(item.id)) continue;
      seen.add(item.id);
      merged.push(item);
    }
    for (const item of semantic.results) {
      if (seen.has(item.id)) continue;
      seen.add(item.id);
      merged.push(item);
    }
    // Preserve the stable empty-array reference (see EMPTY_RESULTS above).
    return merged.length === 0 ? EMPTY_RESULTS : merged;
  }, [lexicalRescue, semantic.results]);

  // Fall back to pure Fuse whenever semantic search is off or has errored;
  // otherwise serve the hybrid merge.
  const useFuse = !semanticEnabled || semantic.status === "error";
  const allResults = useFuse ? fuseResults : mergedResults;

  // Tally the full ranked result set by category to drive the tab bar (counts +
  // which tabs are visible). Empty categories don't get a tab.
  const { counts: categoryCounts, visible: visibleCategories } = useMemo(
    () => categorize(allResults),
    [allResults]
  );

  // Keep the selected tab valid: if it went empty after a keystroke (or results
  // cleared entirely), fall back to "all".
  useEffect(() => {
    if (!visibleCategories.includes(selectedCategory)) {
      setSelectedCategory("all");
    }
  }, [visibleCategories, selectedCategory]);

  // The displayed results are scoped to the selected tab. Keyboard navigation
  // and rendering downstream operate on this filtered list.
  const results = useMemo(
    () =>
      selectedCategory === "all"
        ? allResults
        : allResults.filter(
            (item) => getItemCategory(item) === selectedCategory
          ),
    [allResults, selectedCategory]
  );

  return {
    results,
    open,
    setOpen,
    query,
    setQuery,
    // Category-tab state.
    selectedCategory,
    setSelectedCategory,
    categoryCounts,
    visibleCategories,
    // Semantic-search status surfaced for the dialog's progress/error UI.
    semanticEnabled,
    semanticStatus: semantic.status as SemanticStatus,
    semanticDownloadPercent: semantic.downloadPercent,
    semanticDocCount: semantic.docCount,
  };
};
