import type { PropItem, GroupedProps } from "../types";
import { categorizeProp } from "./categorize-props";

/**
 * Groups props array into categorized objects based on React Aria's grouping system
 * Props are pre-filtered at documentation generation time
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

  // Categorize each prop (props are already filtered upstream)
  props.forEach((prop) => {
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
