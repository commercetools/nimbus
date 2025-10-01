import type { SelectableSearchInputValue } from "../selectable-search-input.types";

/**
 * Check if the search text is empty or only whitespace
 */
export const isEmpty = (value: SelectableSearchInputValue): boolean => {
  return !value.text || value.text.trim().length === 0;
};
