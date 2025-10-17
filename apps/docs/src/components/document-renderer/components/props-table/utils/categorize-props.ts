import { PROP_GROUPS, matchesProp } from "../constants";
import type { PropCategory } from "../types";

/**
 * Categorizes a prop into one of the defined groups based on React Aria's grouping system
 * Checks each group in order and returns the first matching category
 * Falls back to "content" if no matches found
 */
export const categorizeProp = (propName: string): PropCategory => {
  // Check each group in order (by order property)
  const sortedGroups = [...PROP_GROUPS].sort((a, b) => a.order - b.order);

  for (const group of sortedGroups) {
    if (matchesProp(propName, group.matchers)) {
      return group.category;
    }
  }

  // Fallback to content if no matches found
  return "content";
};
