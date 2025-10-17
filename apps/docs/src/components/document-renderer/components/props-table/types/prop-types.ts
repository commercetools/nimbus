import { ReactNode } from "react";

/**
 * Represents a single prop item extracted from component type definitions
 */
export interface PropItem {
  name: string;
  type?: {
    name?: string;
  };
  description: string;
  required: boolean;
  defaultValue: ReactNode | { value?: string | number | boolean | null };
}

/**
 * Categories for organizing props into logical groups
 * Based on React Aria's prop grouping system
 */
export type PropCategory =
  | "content"
  | "selection"
  | "value"
  | "labeling"
  | "validation"
  | "overlay"
  | "events"
  | "links"
  | "styling"
  | "forms"
  | "accessibility"
  | "advanced";

/**
 * Matcher type for categorizing props
 * Can be an exact string match or a RegExp pattern
 */
export type PropMatcher = string | RegExp;

/**
 * Configuration for a prop group
 */
export interface PropGroupConfig {
  /** Category name */
  category: PropCategory;
  /** Display name for the category */
  displayName: string;
  /** Array of matchers (strings or RegExp) to identify props in this category */
  matchers: PropMatcher[];
  /** Display order (lower numbers appear first) */
  order: number;
}

/**
 * Grouped props organized by category
 */
export interface GroupedProps {
  content: PropItem[];
  selection: PropItem[];
  value: PropItem[];
  labeling: PropItem[];
  validation: PropItem[];
  overlay: PropItem[];
  events: PropItem[];
  links: PropItem[];
  styling: PropItem[];
  forms: PropItem[];
  accessibility: PropItem[];
  advanced: PropItem[];
}
