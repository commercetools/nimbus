/**
 * Turns the menu tree (built from the route manifest) into the navigation the
 * docs app shows: the sections in the top bar and the rows in the sidebar.
 *
 * Only the navigation changes. Every page keeps its URL, and the breadcrumb
 * still follows the page's `menu` frontmatter.
 */

/** A menu item as built from the route manifest. */
export type MenuTreeItem = {
  id: string;
  label: string;
  /** Route without a leading slash. */
  route: string;
  order?: number;
  children?: MenuTreeItem[];
};

/** An item of the shaped navigation. */
export type NavigationItem = {
  id: string;
  label: string;
  /**
   * Route without a leading slash. A group without a page of its own (such as
   * "Getting Started", or a section built from other groups) is not a link;
   * use `firstPageRoute` to link to it.
   */
  route: string;
  /** Whether a page exists at `route`. */
  hasPage: boolean;
  order?: number;
  children: NavigationItem[];
};

/** A top-level section built from groups that live in other sections. */
export type NavigationSection = {
  id: string;
  label: string;
  /** Position among the top-level sections (lower comes first). */
  order: number;
  /** Routes of the groups to move into this section, in display order. */
  groups: string[];
  /**
   * Route of a page that becomes the section's own page (its overview). The
   * pages below it come first in the sidebar, followed by `groups`.
   */
  page?: string;
};

export type NavigationConfig = {
  /** Routes left out of the navigation, together with everything below them. */
  hidden: string[];
  /** Routes of groups that are removed; their pages move up one level. */
  merged: string[];
  /** Labels to show instead of the menu label, by route. */
  labels: Record<string, string>;
  /** Top-level sections built from groups of other sections. */
  sections: NavigationSection[];
};

const DEFAULT_ORDER = 999;

// Locale-aware, so case does not decide the order ("Sizing" comes before
// "SVG") and numbers sort by value ("ADR2" comes before "ADR10").
const collator = new Intl.Collator("en", {
  numeric: true,
  sensitivity: "base",
});

const compareByLabel = (a: { label: string }, b: { label: string }) =>
  collator.compare(a.label, b.label);

export const compareByOrderAndLabel = (
  a: { label: string; order?: number },
  b: { label: string; order?: number }
) =>
  (a.order ?? DEFAULT_ORDER) - (b.order ?? DEFAULT_ORDER) ||
  compareByLabel(a, b);

/** Whether `route` is `parentRoute` or a page below it. */
export const isRouteWithin = (route: string, parentRoute: string) =>
  route === parentRoute || route.startsWith(`${parentRoute}/`);

/** The route of the item's own page, or else of the first page below it. */
export const firstPageRoute = (item: NavigationItem): string | undefined => {
  if (item.hasPage) return item.route;
  for (const child of item.children) {
    const route = firstPageRoute(child);
    if (route) return route;
  }
  return undefined;
};

/** Length of the longest page route in `item` that contains `route`, or -1. */
const longestMatch = (item: NavigationItem, route: string): number => {
  const own =
    item.hasPage && isRouteWithin(route, item.route) ? item.route.length : -1;
  return Math.max(own, ...item.children.map((c) => longestMatch(c, route)));
};

/**
 * The top-level section the route belongs to: the one with the most specific
 * page route that contains it. Pages that are hidden from the navigation still
 * belong to the section whose route contains them.
 */
export const findActiveSection = (
  sections: NavigationItem[],
  route: string
): NavigationItem | undefined => {
  let best: { section: NavigationItem; length: number } | undefined;
  for (const section of sections) {
    const length = longestMatch(section, route);
    if (length >= 0 && length > (best?.length ?? -1)) {
      best = { section, length };
    }
  }
  return best?.section;
};

/** Removes the item at `route` from the tree and returns it. */
const takeItem = (
  items: NavigationItem[],
  route: string
): { items: NavigationItem[]; taken?: NavigationItem } => {
  let taken: NavigationItem | undefined;
  const walk = (list: NavigationItem[]): NavigationItem[] =>
    list.flatMap((item) => {
      if (item.route === route) {
        taken = item;
        return [];
      }
      return [{ ...item, children: walk(item.children) }];
    });
  return { items: walk(items), taken };
};

const sortTree = (items: NavigationItem[]): NavigationItem[] =>
  [...items]
    .sort(compareByOrderAndLabel)
    .map((item) => ({ ...item, children: sortTree(item.children) }));

/**
 * Shapes the menu tree into the navigation, following `config`.
 *
 * @param menu - The menu tree built from the route manifest.
 * @param pageRoutes - Routes (without a leading slash) that have a page.
 * @param config - What to hide, merge, relabel and regroup.
 */
export const shapeNavigation = (
  menu: MenuTreeItem[],
  pageRoutes: ReadonlySet<string>,
  config: NavigationConfig
): NavigationItem[] => {
  const hidden = new Set(config.hidden);
  const merged = new Set(config.merged);

  const shapeItems = (items: MenuTreeItem[]): NavigationItem[] =>
    items.flatMap((item) => {
      if (hidden.has(item.route)) return [];
      const children = shapeItems(item.children ?? []);
      if (merged.has(item.route)) return children;
      return [
        {
          id: item.id,
          label: config.labels[item.route] ?? item.label,
          route: item.route,
          hasPage: pageRoutes.has(item.route),
          order: item.order,
          children,
        },
      ];
    });

  let sections = shapeItems(menu);

  for (const section of config.sections) {
    const groups: NavigationItem[] = [];
    let overview: NavigationItem | undefined;
    if (section.page) {
      const result = takeItem(sections, section.page);
      sections = result.items;
      overview = result.taken;
    }
    for (const route of section.groups) {
      const result = takeItem(sections, route);
      sections = result.items;
      if (result.taken) groups.push(result.taken);
    }
    if (groups.length === 0 && !overview) continue;
    sections.push({
      id: section.id,
      label: section.label,
      route: overview?.route ?? groups[0].route,
      hasPage: overview?.hasPage ?? false,
      order: section.order,
      children: [
        // The overview's own pages are sorted; the groups keep the
        // configured order, and only their pages are sorted.
        ...sortTree(overview?.children ?? []),
        ...groups.map((group) => ({
          ...group,
          children: sortTree(group.children),
        })),
      ],
    });
  }

  const builtSections = new Set(config.sections.map(({ id }) => id));

  return [...sections]
    .sort(compareByOrderAndLabel)
    .map((section) =>
      builtSections.has(section.id)
        ? section
        : { ...section, children: sortTree(section.children) }
    );
};
