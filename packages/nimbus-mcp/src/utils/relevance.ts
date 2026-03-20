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

  for (const item of items) {
    const fields = getLowered(item);
    const { title, description, tags, content, combined } = fields;

    const allPresent = tokens.every((t) => combined.includes(t));
    if (!allPresent) continue;

    let score = 0;
    for (const t of tokens) {
      if (title.includes(t)) score += WEIGHTS.title;
      if (description.includes(t)) score += WEIGHTS.description;
      if (tags.includes(t)) score += WEIGHTS.tags;
      if (content.includes(t)) score += WEIGHTS.content;
    }

    scored.push({ item, score });
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
