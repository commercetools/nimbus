import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import Fuse from "fuse.js";
import { useAtomValue } from "jotai";

import { semanticEnabledAtom } from "@/atoms/semantic-search";
import { useSemanticSearch } from "@/semantic-search/use-semantic-search";

import {
  createIconIndex,
  searchIcons,
  toWords,
  type IconMatch,
} from "./search-icons";
import {
  ALL_CATEGORIES,
  slugifyCategory,
  type IconEntry,
} from "./use-icon-data";
import { useIconRouteState } from "./use-icon-route-state";

/** Most keywords offered to narrow the results. */
const MAX_KEYWORDS = 16;

/** Shortest query that gets similar-spelling results when nothing matches. */
const FUZZY_MIN_LENGTH = 3;

type EntryMap = Map<string, IconEntry>;

const hasTag = (entries: EntryMap, name: string, tag: string) =>
  entries.get(name)?.tags.includes(tag) ?? false;

const isInCategory = (entries: EntryMap, name: string, slug: string) =>
  slug === ALL_CATEGORIES ||
  (entries.get(name)?.categories.some((cat) => slugifyCategory(cat) === slug) ??
    false);

export interface KeywordFacet {
  tag: string;
  count: number;
}

export interface IconSearchState {
  /** The text in the search field. Updates on every keystroke. */
  query: string;
  setQuery: (query: string) => void;
  /** True while the results still show an older query than the field. */
  isStale: boolean;
  /** The query the results are for. */
  appliedQuery: string;
  /** The icons to show: search, category and keyword applied. */
  results: IconMatch[];
  /** Results per category slug, with the search and keyword applied. */
  categoryCounts: Map<string, number>;
  /** Results in all categories, with the search and keyword applied. */
  allCategoriesCount: number;
  /**
   * Keywords that narrow the current results, most frequent first. Only
   * keywords that leave out at least one result are offered. The selected
   * keyword is always included, so it can be turned off.
   */
  keywords: KeywordFacet[];
  /**
   * True when no icon matches the query word for word, and the results are
   * icons with a similar spelling instead.
   */
  isFuzzy: boolean;
}

/**
 * The search, filters and counts of the icon browser.
 *
 * The search text is kept in the URL (`?search=`), but the field has a local
 * copy that updates at once: writing every keystroke through the router first
 * could drop keystrokes. The results read a deferred copy, so typing stays
 * fast, and the deferred value is written back to the URL.
 *
 * The query is matched word for word (`searchIcons`). When nothing matches, a
 * fuzzy search finds icons with a similar spelling (for typing errors). When
 * the global "Semantic search (beta)" switch is on, icons with a similar
 * meaning follow the word matches.
 */
export const useIconSearch = (
  entries: IconEntry[],
  loading: boolean
): IconSearchState => {
  const { category, tag, search, setSearch } = useIconRouteState();

  // --- Search text: local field value <-> URL ------------------------------
  const [query, setQuery] = useState<string>(() => search);
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;

  // Every value written to the URL is remembered, so the URL -> field effect
  // can tell our own writes from navigation (Back, a link). Several writes can
  // be pending at once while typing fast.
  const ownWrites = useRef(new Set<string>());
  useEffect(() => {
    if (deferredQuery !== search) {
      ownWrites.current.add(deferredQuery);
      setSearch(deferredQuery);
    }
  }, [deferredQuery, search, setSearch]);

  useEffect(() => {
    if (ownWrites.current.has(search)) {
      ownWrites.current.delete(search);
      return;
    }
    setQuery(search);
  }, [search]);

  // --- Indexes --------------------------------------------------------------
  const index = useMemo(() => createIconIndex(entries), [entries]);

  const entryByName = useMemo(() => {
    const map = new Map<string, IconEntry>();
    for (const entry of entries) map.set(entry.name, entry);
    return map;
  }, [entries]);

  // Only for the fallback when nothing matches word for word.
  const fuse = useMemo(
    () =>
      new Fuse(entries, {
        ignoreLocation: true,
        threshold: 0.3,
        minMatchCharLength: 2,
        keys: [
          { name: "name", weight: 2 },
          { name: "tags", weight: 1 },
        ],
      }),
    [entries]
  );

  // --- Semantic search ------------------------------------------------------
  const semanticEnabled = useAtomValue(semanticEnabledAtom);

  // Build the semantic index only after the first search, so visitors who
  // only browse do not pay for it. Stays true after that, so clearing the
  // field does not rebuild it.
  const [hasSearched, setHasSearched] = useState(false);
  useEffect(() => {
    if (deferredQuery.trim()) setHasSearched(true);
  }, [deferredQuery]);

  // Every icon, not only the active category, so the index stays the same
  // when the category changes. Built after the metadata loads, so it is not
  // built twice.
  const iconDocs = useMemo(
    () =>
      loading
        ? []
        : entries.map((entry) => ({
            id: entry.name,
            title: entry.name,
            tags: [...entry.tags, ...entry.categories],
          })),
    [entries, loading]
  );

  // Uses the engine of the nav bar search. The "icons" namespace keeps this
  // index in its own IndexedDB database.
  const semantic = useSemanticSearch(
    semanticEnabled && hasSearched,
    iconDocs,
    deferredQuery,
    "icons"
  );

  // --- Ranked matches in all categories -------------------------------------
  const { ranked, isFuzzy } = useMemo(() => {
    const exact = searchIcons(index, deferredQuery);
    const hasQuery = toWords(deferredQuery).length > 0;

    if (
      hasQuery &&
      semanticEnabled &&
      semantic.status === "ready" &&
      semantic.results.length > 0
    ) {
      const seen = new Set(exact.map((match) => match.name));
      const similar = semantic.results
        .map((doc) => doc.id)
        .filter((name) => entryByName.has(name) && !seen.has(name))
        .map((name) => ({ name, matchedTag: null }));
      return { ranked: [...exact, ...similar], isFuzzy: false };
    }

    if (
      hasQuery &&
      exact.length === 0 &&
      deferredQuery.trim().length >= FUZZY_MIN_LENGTH
    ) {
      const similar = fuse
        .search(deferredQuery.trim())
        .map((result) => ({ name: result.item.name, matchedTag: null }));
      return { ranked: similar, isFuzzy: similar.length > 0 };
    }

    return { ranked: exact, isFuzzy: false };
  }, [
    index,
    deferredQuery,
    semanticEnabled,
    semantic.status,
    semantic.results,
    entryByName,
    fuse,
  ]);

  // A keyword click updates its highlight at once; the slower filtering reads
  // a deferred copy, so the click never blocks.
  const deferredTag = useDeferredValue(tag);

  // --- Category counts: search and keyword applied, any category ------------
  const { categoryCounts, allCategoriesCount } = useMemo(() => {
    const withTag = deferredTag
      ? ranked.filter((match) => hasTag(entryByName, match.name, deferredTag))
      : ranked;
    const counts = new Map<string, number>();
    for (const match of withTag) {
      for (const cat of entryByName.get(match.name)?.categories ?? []) {
        const slug = slugifyCategory(cat);
        counts.set(slug, (counts.get(slug) ?? 0) + 1);
      }
    }
    return { categoryCounts: counts, allCategoriesCount: withTag.length };
  }, [ranked, deferredTag, entryByName]);

  // --- Category applied; keywords are counted before the keyword filter -----
  const scoped = useMemo(
    () =>
      ranked.filter((match) => isInCategory(entryByName, match.name, category)),
    [ranked, category, entryByName]
  );

  const keywords = useMemo<KeywordFacet[]>(() => {
    const queryWords = new Set(toWords(deferredQuery));
    const counts = new Map<string, number>();
    for (const match of scoped) {
      for (const keyword of entryByName.get(match.name)?.tags ?? []) {
        counts.set(keyword, (counts.get(keyword) ?? 0) + 1);
      }
    }
    const facets = [...counts.entries()]
      // A keyword that every result has, or that only repeats the query, does
      // not narrow anything.
      .filter(
        ([keyword, count]) =>
          count < scoped.length &&
          !toWords(keyword).every((word) => queryWords.has(word))
      )
      .sort((a, b) => b[1] - a[1])
      .slice(0, MAX_KEYWORDS)
      .map(([keyword, count]) => ({ tag: keyword, count }));

    if (tag && !facets.some((facet) => facet.tag === tag)) {
      facets.unshift({ tag, count: counts.get(tag) ?? 0 });
    }
    return facets;
  }, [scoped, entryByName, deferredQuery, tag]);

  const results = useMemo(
    () =>
      deferredTag
        ? scoped.filter((match) => hasTag(entryByName, match.name, deferredTag))
        : scoped,
    [scoped, deferredTag, entryByName]
  );

  return {
    query,
    setQuery,
    isStale,
    appliedQuery: deferredQuery,
    results,
    categoryCounts,
    allCategoriesCount,
    keywords,
    isFuzzy,
  };
};
