import type { PropItem, GroupedProps } from "../types";
import { categorizeProp } from "./categorize-props";
import { filterStyleProps } from "./filter-props";

/**
 * Groups props array into categorized objects based on React Aria's grouping system
 * Automatically filters out Chakra UI style props
 * Sorts props alphabetically within each category
 */
export const groupProps = (props: PropItem[]): GroupedProps => {
  const grouped: GroupedProps = {
    content: [],
    selection: [],
    value: [],
    labeling: [],
    validation: [],
    overlay: [],
    events: [],
    links: [],
    styling: [],
    forms: [],
    accessibility: [],
    advanced: [],
  };

  // Filter out style props before categorizing
  const filteredProps = filterStyleProps(props);

  // Categorize each prop
  filteredProps.forEach((prop) => {
    const category = categorizeProp(prop.name);
    grouped[category].push(prop);
  });

  // Sort props alphabetically within each category
  Object.keys(grouped).forEach((key) => {
    const category = key as keyof GroupedProps;
    grouped[category].sort((a, b) => a.name.localeCompare(b.name));
  });

  return grouped;
};
