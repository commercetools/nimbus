import type { IconEntry } from "./use-icon-data";

/**
 * Tag-based "similar icons" scoring — a small, dependency-free engine that ranks
 * the whole icon corpus against one selected icon by how much meaningful tag
 * vocabulary they share.
 *
 * Each icon is a bag of tags. A tag's weight is its inverse document frequency
 * (`ln(N / (1 + df))`), so ubiquitous tags (`outline`, `button`, `ui`, `shape`)
 * contribute ~0 while rare, meaningful tags (`translate`, `globe`) dominate.
 * Similarity is the cosine between two icons' IDF-weighted tag vectors (binary
 * term frequency — a tag is present or not), with a small boost when the two
 * icons share a category and popularity as the tiebreak.
 *
 * This is the always-on baseline used by the icon detail dialog; it needs no
 * model, no worker, and no opt-in. A future embedding-based signal can be fused
 * on top when the semantic index is warm (see the dialog).
 */

/** One corpus entry with its similarity fields precomputed once. */
interface IndexedEntry {
  name: string;
  /** Distinct tags for this icon (deduped from the source list). */
  tagSet: Set<string>;
  /** L2 norm of the icon's IDF-weighted tag vector: `sqrt(Σ idf(t)²)`. */
  norm: number;
  categories: string[];
  popularity: number;
}

/** Precomputed structures shared across every `computeSimilarIcons` call. */
export interface SimilarityIndex {
  /** IDF weight per tag: rare tags weigh a lot, near-ubiquitous ones ~0. */
  idf: Map<string, number>;
  /** Every icon, keyed by export name, with its tag set + vector norm. */
  byName: Map<string, IndexedEntry>;
}

/** Multiplier applied when a candidate shares a category with the selected icon. */
const CATEGORY_BOOST = 1.1;

/**
 * Precompute the similarity index over the full icon corpus.
 *
 * One pass builds each icon's tag set and the document frequency per tag; a
 * second derives the IDF weights and each icon's vector norm. Overall O(total
 * tag occurrences) — a few tens of thousands for the ~2,100-icon set. Memoize on
 * `entries` identity: rebuild only when the corpus changes (i.e. when the lazy
 * metadata chunk resolves), never per selected icon.
 */
export function buildSimilarityIndex(entries: IconEntry[]): SimilarityIndex {
  const n = entries.length;

  // Pass 1: per-icon distinct tag sets + document frequency per tag (a tag
  // counts once per icon even if the source listed it twice).
  const tagSets: Array<Set<string>> = new Array(n);
  const df = new Map<string, number>();
  entries.forEach((e, i) => {
    const set = new Set(e.tags);
    tagSets[i] = set;
    for (const t of set) df.set(t, (df.get(t) ?? 0) + 1);
  });

  // IDF per tag. The `1 +` smoothing keeps a tag present on every icon at ~0
  // (its weight is squared everywhere below, so the sign never matters).
  const idf = new Map<string, number>();
  for (const [t, freq] of df) idf.set(t, Math.log(n / (1 + freq)));

  // Pass 2: each icon's vector norm over its IDF-weighted tags.
  const byName = new Map<string, IndexedEntry>();
  entries.forEach((e, i) => {
    const tagSet = tagSets[i];
    let sumSq = 0;
    for (const t of tagSet) {
      const w = idf.get(t) ?? 0;
      sumSq += w * w;
    }
    byName.set(e.name, {
      name: e.name,
      tagSet,
      norm: Math.sqrt(sumSq),
      categories: e.categories,
      popularity: e.popularity,
    });
  });

  return { idf, byName };
}

/** Internal candidate carrying the fields the final sort needs. */
interface ScoredIcon {
  name: string;
  score: number;
  popularity: number;
}

/**
 * Rank the corpus against `name` and return the top `limit` most-similar icon
 * names, most similar first. The selected icon itself is always excluded.
 *
 * Returns `[]` when the icon is unknown or carries no usable tags (e.g. before
 * the metadata chunk has loaded, when every entry is name-only) — the caller
 * hides the section in that case.
 */
export function computeSimilarIcons(
  name: string,
  index: SimilarityIndex,
  limit = 12
): string[] {
  const self = index.byName.get(name);
  if (!self || self.norm === 0) return [];

  const selfCats = new Set(self.categories);
  const scored: ScoredIcon[] = [];

  for (const cand of index.byName.values()) {
    if (cand.name === name || cand.norm === 0) continue;

    // Dot product of the two IDF-weighted tag vectors = Σ idf(t)² over shared
    // tags. Iterate the smaller set and test membership in the larger.
    const [small, large] =
      self.tagSet.size <= cand.tagSet.size
        ? [self.tagSet, cand.tagSet]
        : [cand.tagSet, self.tagSet];
    let dot = 0;
    for (const t of small) {
      if (large.has(t)) {
        const w = index.idf.get(t) ?? 0;
        dot += w * w;
      }
    }
    if (dot <= 0) continue;

    let score = dot / (self.norm * cand.norm);
    // Nudge icons from the same category family ahead of loosely-related ones.
    if (cand.categories.some((c) => selfCats.has(c))) score *= CATEGORY_BOOST;

    scored.push({ name: cand.name, score, popularity: cand.popularity });
  }

  // Most similar first; break ties toward the more recognizable (popular) icon.
  scored.sort((a, b) => b.score - a.score || b.popularity - a.popularity);

  return scored.slice(0, limit).map((s) => s.name);
}
