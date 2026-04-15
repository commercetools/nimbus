/**
 * Relevance scoring utilities for ranking search results by query match quality.
 *
 * Uses field-weighted scoring: title matches outweigh description/tag matches,
 * which outweigh content matches. Applies a Schwartzian transform so each item
 * is scored exactly once regardless of list size.
 */

import type { RelevanceFields, LoweredRelevanceFields } from "../types.js";

/** Field weights. Higher = more relevant when a query token matches this field. */
const WEIGHTS = { title: 8, description: 4, tags: 4, content: 1 } as const;

/**
 * Computes a relevance score for a set of fields against pre-parsed query tokens.
 * Call this when you need the raw score (e.g. to combine with other signals).
 *
 * Note: scores accumulate across all matching fields. A token present in both
 * title (weight 8) and description (weight 4) scores 12, while a token present
 * only in title scores 8. This intentionally rewards multi-field matches, but
 * means a partial match across two fields can outrank a stronger single-field hit.
 */
export function scoreRelevance(
  fields: RelevanceFields,
  tokens: string[]
): number {
  let score = 0;
  const title = fields.title.toLowerCase();
  const desc = fields.description.toLowerCase();
  const tags = fields.tags.toLowerCase();
  const content = fields.content?.toLowerCase() ?? "";
  for (const t of tokens) {
    if (title.includes(t)) score += WEIGHTS.title;
    if (desc.includes(t)) score += WEIGHTS.description;
    if (tags.includes(t)) score += WEIGHTS.tags;
    if (content.includes(t)) score += WEIGHTS.content;
  }
  return score;
}

/**
 * Sorts items by relevance to query tokens.
 *
 * Uses a Schwartzian transform: each item is scored exactly once, then the
 * list is sorted by score descending. This avoids the O(n log n) repeated
 * scoring that occurs when the score function is called inside the comparator.
 *
 * @param items - Items to rank.
 * @param tokens - Pre-parsed lowercase query tokens.
 * @param getFields - Extracts scoreable fields from an item.
 */
export function rankByRelevance<T>(
  items: T[],
  tokens: string[],
  getFields: (item: T) => RelevanceFields
): T[] {
  if (tokens.length === 0 || items.length === 0) return items;
  return items
    .map((item) => ({ item, score: scoreRelevance(getFields(item), tokens) }))
    .sort((a, b) => b.score - a.score)
    .map(({ item }) => item);
}

/**
 * Single-pass filter and rank: lowercases each field once, uses the same
 * lowercased values for both the "all tokens present" predicate and the
 * relevance score. More efficient than `rankByRelevance(items.filter(...))`.
 *
 * @param items - Items to filter and rank.
 * @param tokens - Pre-parsed lowercase query tokens.
 * @param getFields - Extracts scoreable fields from an item.
 */
export function filterAndRankByRelevance<T>(
  items: T[],
  tokens: string[],
  getFields: (item: T) => RelevanceFields
): T[] {
  if (items.length === 0) return items;
  if (tokens.length === 0) return items;

  const scored: Array<{ item: T; score: number }> = [];

  for (const item of items) {
    const fields = getFields(item);
    const title = fields.title.toLowerCase();
    const desc = fields.description.toLowerCase();
    const tags = fields.tags.toLowerCase();
    const content = fields.content?.toLowerCase() ?? "";

    // Filter: every token must appear in at least one field.
    const allPresent = tokens.every(
      (t) =>
        title.includes(t) ||
        desc.includes(t) ||
        tags.includes(t) ||
        content.includes(t)
    );
    if (!allPresent) continue;

    // Score using pre-lowercased values.
    let score = 0;
    for (const t of tokens) {
      if (title.includes(t)) score += WEIGHTS.title;
      if (desc.includes(t)) score += WEIGHTS.description;
      if (tags.includes(t)) score += WEIGHTS.tags;
      if (content.includes(t)) score += WEIGHTS.content;
    }

    scored.push({ item, score });
  }

  return scored.sort((a, b) => b.score - a.score).map(({ item }) => item);
}

/**
 * Like filterAndRankByRelevance but accepts pre-lowercased fields,
 * avoiding repeated toLowerCase() calls on every search invocation.
 */
export function filterAndRankPreLowered<T>(
  items: T[],
  tokens: string[],
  getLowered: (item: T) => LoweredRelevanceFields
): T[] {
  if (items.length === 0 || tokens.length === 0) return items;

  const scored: Array<{ item: T; score: number }> = [];
  const tokenCount = tokens.length;

  // Fast path for single-token queries (most common case).
  if (tokenCount === 1) {
    const t = tokens[0];
    for (const item of items) {
      const { title, description, tags, content } = getLowered(item);
      let score = 0;
      if (title.includes(t)) score += WEIGHTS.title;
      if (description.includes(t)) score += WEIGHTS.description;
      if (tags.includes(t)) score += WEIGHTS.tags;
      if (content.includes(t)) score += WEIGHTS.content;
      if (score > 0) scored.push({ item, score });
    }
  } else {
    for (const item of items) {
      const fields = getLowered(item);
      const { title, description, tags, content, combined } = fields;

      // Check all tokens present using manual loop (avoids .every() overhead).
      let allPresent = true;
      for (let i = 0; i < tokenCount; i++) {
        if (!combined.includes(tokens[i])) {
          allPresent = false;
          break;
        }
      }
      if (!allPresent) continue;

      let score = 0;
      for (let i = 0; i < tokenCount; i++) {
        const t = tokens[i];
        if (title.includes(t)) score += WEIGHTS.title;
        if (description.includes(t)) score += WEIGHTS.description;
        if (tags.includes(t)) score += WEIGHTS.tags;
        if (content.includes(t)) score += WEIGHTS.content;
      }

      scored.push({ item, score });
    }
  }

  return scored.sort((a, b) => b.score - a.score).map(({ item }) => item);
}

/**
 * Scores relevance using pre-lowercased fields.
 */
export function scorePreLowered(
  fields: LoweredRelevanceFields,
  tokens: string[]
): number {
  let score = 0;
  for (const t of tokens) {
    if (fields.title.includes(t)) score += WEIGHTS.title;
    if (fields.description.includes(t)) score += WEIGHTS.description;
    if (fields.tags.includes(t)) score += WEIGHTS.tags;
    if (fields.content.includes(t)) score += WEIGHTS.content;
  }
  return score;
}

/**
 * Lightweight Levenshtein distance (bounded). Returns -1 if distance exceeds
 * maxDist, avoiding full matrix computation for clearly non-matching strings.
 * O(min(n,m) * maxDist) time, O(min(n,m)) space.
 */
export function boundedLevenshtein(
  a: string,
  b: string,
  maxDist: number
): number {
  if (Math.abs(a.length - b.length) > maxDist) return -1;
  if (a === b) return 0;

  // Ensure a is the shorter string for the single-row optimization.
  if (a.length > b.length) [a, b] = [b, a];
  const m = a.length;
  const n = b.length;

  let prev = new Array(m + 1);
  let curr = new Array(m + 1);
  for (let i = 0; i <= m; i++) prev[i] = i;

  for (let j = 1; j <= n; j++) {
    curr[0] = j;
    let rowMin = j;
    for (let i = 1; i <= m; i++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[i] = Math.min(prev[i] + 1, curr[i - 1] + 1, prev[i - 1] + cost);
      if (curr[i] < rowMin) rowMin = curr[i];
    }
    if (rowMin > maxDist) return -1;
    [prev, curr] = [curr, prev];
  }
  return prev[m] <= maxDist ? prev[m] : -1;
}

/**
 * Fuzzy-scores an entry's fields against query tokens using edit distance.
 * Returns a score > 0 if any token fuzzy-matches a word in any field.
 *
 * Only activated for tokens >= 3 chars (short tokens produce too many false
 * positives). Max edit distance scales with token length:
 *   3-4 chars → distance 1, 5-7 chars → distance 2, 8+ chars → distance 3.
 *
 * Fuzzy matches are weighted at half the exact-match weight to avoid
 * outranking precise results.
 */
export function fuzzyScorePreLowered(
  fields: LoweredRelevanceFields,
  tokens: string[]
): number {
  let score = 0;
  const FUZZY_WEIGHTS = {
    title: WEIGHTS.title / 2,
    description: WEIGHTS.description / 2,
    tags: WEIGHTS.tags / 2,
    content: WEIGHTS.content / 2,
  } as const;

  // Pre-compute noSpaces and words arrays once, falling back to runtime
  // computation if the pre-split fields aren't available.
  const fieldData = [
    {
      text: fields.title,
      noSpaces: fields.titleNoSpaces ?? fields.title.replace(/\s+/g, ""),
      words: fields.titleWords ?? fields.title.split(/\s+/).filter(Boolean),
      weight: FUZZY_WEIGHTS.title,
    },
    {
      text: fields.description,
      noSpaces:
        fields.descriptionNoSpaces ?? fields.description.replace(/\s+/g, ""),
      words:
        fields.descriptionWords ??
        fields.description.split(/\s+/).filter(Boolean),
      weight: FUZZY_WEIGHTS.description,
    },
    {
      text: fields.tags,
      noSpaces: fields.tagsNoSpaces ?? fields.tags.replace(/\s+/g, ""),
      words: fields.tagsWords ?? fields.tags.split(/\s+/).filter(Boolean),
      weight: FUZZY_WEIGHTS.tags,
    },
  ];

  for (const token of tokens) {
    if (token.length < 3) continue;
    const maxDist = token.length <= 4 ? 1 : token.length <= 7 ? 2 : 3;

    for (const { text, noSpaces, words, weight } of fieldData) {
      // Substring match (fast) — handles compound words like "datepicker" in "date picker"
      if (text.includes(token)) {
        score += weight;
        continue;
      }
      // Also try with spaces removed for compound matching
      if (noSpaces.includes(token)) {
        score += weight;
        continue;
      }
      // Word-level checks: Levenshtein + prefix matching
      let matched = false;
      for (const word of words) {
        if (boundedLevenshtein(token, word, maxDist) >= 0) {
          matched = true;
          break;
        }
        if (token.startsWith(word) || word.startsWith(token)) {
          matched = true;
          break;
        }
      }
      if (matched) score += weight;
    }
    // Skip content for fuzzy — too many words, too slow, too many false positives
  }
  return score;
}

/**
 * Resolves a single name against a list of candidates using Levenshtein
 * distance. Designed for "find the one best match" use cases like
 * `get_component` where you have a user-supplied name and need to find the
 * closest entry by title or alias.
 *
 * Returns the best-matching item, or undefined if no candidate is close
 * enough. Edit distance threshold scales with query length (same as
 * fuzzyScorePreLowered). Ties are broken by shortest edit distance, then
 * shortest candidate name (most specific match).
 */
export function fuzzyResolveName<T>(
  needle: string,
  candidates: T[],
  getNames: (item: T) => string[]
): T | undefined {
  if (needle.length < 2) return undefined;
  const lower = needle.toLowerCase();
  const maxDist = lower.length <= 4 ? 1 : lower.length <= 7 ? 2 : 3;

  let bestItem: T | undefined;
  let bestDist = maxDist + 1;
  let bestLen = Infinity;

  for (const item of candidates) {
    for (const name of getNames(item)) {
      const nameLower = name.toLowerCase();
      const dist = boundedLevenshtein(lower, nameLower, maxDist);
      if (
        dist >= 0 &&
        (dist < bestDist || (dist === bestDist && nameLower.length < bestLen))
      ) {
        bestDist = dist;
        bestLen = nameLower.length;
        bestItem = item;
      }
    }
  }

  return bestItem;
}
