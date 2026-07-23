import { useEffect, useMemo, useState } from "react";
import * as icons from "@commercetools/nimbus-icons";
import type { IconMeta } from "./custom-icons-meta";

/** A searchable icon: its export name plus the metadata we match against. */
export interface IconEntry {
  name: string;
  tags: string[];
  categories: string[];
  popularity: number;
}

export const ALL_ICON_NAMES = Object.keys(icons);

/** Sentinel for the "no category filter" state (also the `/icons` root slug). */
export const ALL_CATEGORIES = "all";

/** "common actions" -> "Common Actions" */
export const titleCase = (s: string) =>
  s.replace(/\b\w/g, (ch) => ch.toUpperCase());

/** "common actions" -> "common-actions" for use as a URL segment. */
export const slugifyCategory = (category: string) =>
  category.toLowerCase().replace(/\s+/g, "-");

type CategoryFacet = { name: string; count: number };

interface IconData {
  metadata: Record<string, IconMeta> | null;
  entries: IconEntry[];
  categories: CategoryFacet[];
}

/**
 * Lazily loads the (~900KB) icon metadata as a separate chunk on mount, and
 * derives the searchable entries + category facets from it. Until it resolves,
 * `metadata` is null, entries are name-only, and there are no category facets —
 * callers degrade gracefully to name-only matching.
 */
export const useIconData = (): IconData => {
  const [metadata, setMetadata] = useState<Record<string, IconMeta> | null>(
    null
  );

  useEffect(() => {
    let cancelled = false;
    import("./icon-meta").then((mod) => {
      if (!cancelled) setMetadata(mod.iconMetadata);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const entries = useMemo<IconEntry[]>(
    () =>
      ALL_ICON_NAMES.map((name) => {
        const meta = metadata?.[name];
        return {
          name,
          tags: meta?.tags ?? [],
          categories: meta?.categories ?? [],
          popularity: meta?.popularity ?? 0,
        };
      }),
    [metadata]
  );

  // Category facets (name + count), most-populated first.
  const categories = useMemo<CategoryFacet[]>(() => {
    const counts = new Map<string, number>();
    for (const entry of entries) {
      for (const cat of entry.categories) {
        counts.set(cat, (counts.get(cat) ?? 0) + 1);
      }
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));
  }, [entries]);

  return { metadata, entries, categories };
};
