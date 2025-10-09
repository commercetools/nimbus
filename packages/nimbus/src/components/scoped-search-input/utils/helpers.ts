import type { ScopedSearchInputValue } from "../scoped-search-input.types";

/**
 * Check if the search text is empty or only whitespace
 */
export const isEmpty = (value: ScopedSearchInputValue): boolean => {
  return !value.text || value.text.trim().length === 0;
};
