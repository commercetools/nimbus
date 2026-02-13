/**
 * Detects which token category a set of completion entries belongs to
 * by computing overlap scores against known category fingerprints.
 */

import type { CategorySets } from "./token-data";

/** Names to exclude from fingerprint matching */
const EXCLUDED_PATTERNS = [
  /^\[/, // array-like entries
  /^currentBg$/,
  /^currentColor$/,
  /^colorPalette/,
  /^true$/,
  /^false$/,
  /!/, // entries with "!" (important modifiers)
  /^inherit$/,
  /^initial$/,
  /^unset$/,
  /^auto$/,
  /^none$/,
  /^transparent$/,
  /^current$/,
];

/**
 * Given a list of completion entry names from TS, determine which token
 * category they belong to by finding the category with the highest overlap.
 *
 * Returns the category name or undefined if no match exceeds the threshold.
 */
export function detectCategory(
  entryNames: string[],
  categorySets: CategorySets
): string | undefined {
  // Filter out non-token entries
  const filtered = entryNames.filter(
    (name) => !EXCLUDED_PATTERNS.some((pattern) => pattern.test(name))
  );

  if (filtered.length === 0) return undefined;

  const filteredSet = new Set(filtered);

  // Collect all candidates that exceed the overlap threshold
  const candidates: Array<{
    category: string;
    ratio: number;
    intersection: number;
  }> = [];

  for (const [category, tokenSet] of Object.entries(categorySets)) {
    let intersection = 0;
    for (const token of tokenSet) {
      if (filteredSet.has(token)) {
        intersection++;
      }
    }

    const ratio = intersection / tokenSet.size;

    // Require > 50% of the category's tokens to appear in completions
    if (ratio > 0.5) {
      candidates.push({ category, ratio, intersection });
    }
  }

  if (candidates.length === 0) return undefined;

  // When multiple categories match (e.g. fontWeights is a subset of spacing),
  // prefer the one with the most matching tokens (largest intersection).
  // If tied on intersection, prefer the higher ratio.
  candidates.sort((a, b) => {
    if (b.intersection !== a.intersection)
      return b.intersection - a.intersection;
    return b.ratio - a.ratio;
  });

  return candidates[0].category;
}
