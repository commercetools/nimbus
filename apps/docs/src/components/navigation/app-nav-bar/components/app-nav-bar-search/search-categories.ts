import type { SearchableDocItem } from "@/atoms/searchable-docs";

/**
 * Curated, fixed set of parent categories the search results can be filtered
 * by. This is intentionally NOT auto-derived from the docs taxonomy — only
 * categories worth scoping a search to get a tab. Anything that doesn't map to
 * a named category falls into the catch-all `"docs"` bucket, and `"all"` shows
 * everything.
 */
export type SearchCategoryKey =
  | "all"
  | "components"
  | "patterns"
  | "hooks"
  | "design-tokens"
  | "style-props"
  | "docs";

/** Display labels for each tab. */
export const CATEGORY_LABELS: Record<SearchCategoryKey, string> = {
  all: "All",
  components: "Components",
  patterns: "Patterns",
  hooks: "Hooks",
  "design-tokens": "Design Tokens",
  "style-props": "Style Props",
  docs: "Docs",
};

/** Fixed left-to-right order the tabs render in. */
export const CATEGORY_ORDER: SearchCategoryKey[] = [
  "all",
  "components",
  "patterns",
  "hooks",
  "design-tokens",
  "style-props",
  "docs",
];

/**
 * Map a search item to its concrete category from the `menu` breadcrumb. The
 * top-level category is `menu[0]`; the `Home` bucket is split further on
 * `menu[1]`. Everything that isn't a named category (Getting Started,
 * Contribute, Playground, Icons, …) falls back to `"docs"`.
 */
export function getItemCategory(
  item: SearchableDocItem
): Exclude<SearchCategoryKey, "all"> {
  const [top, sub] = item.menu;
  if (top === "Components") return "components";
  if (top === "Patterns") return "patterns";
  if (top === "Hooks") return "hooks";
  if (top === "Home" && sub === "Design Tokens") return "design-tokens";
  if (top === "Home" && sub === "Style Props") return "style-props";
  return "docs";
}

export type CategorizedResults = {
  /** Result count per category. `counts.all` is the total. */
  counts: Record<SearchCategoryKey, number>;
  /**
   * Categories with at least one result, in `CATEGORY_ORDER`. `"all"` is only
   * present when there are any results, so the tab bar stays hidden on an empty
   * result set.
   */
  visible: SearchCategoryKey[];
};

/** Tally results by category and derive which tabs should be shown. */
export function categorize(items: SearchableDocItem[]): CategorizedResults {
  const counts: Record<SearchCategoryKey, number> = {
    all: items.length,
    components: 0,
    patterns: 0,
    hooks: 0,
    "design-tokens": 0,
    "style-props": 0,
    docs: 0,
  };

  for (const item of items) {
    counts[getItemCategory(item)] += 1;
  }

  const visible = CATEGORY_ORDER.filter((key) => counts[key] > 0);

  return { counts, visible };
}
