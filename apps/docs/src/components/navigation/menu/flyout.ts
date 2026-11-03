import { firstPageRoute, type NavigationItem } from "./shape-navigation";

/** Largest group whose pages are all listed in the flyout. */
export const FLYOUT_MAX_PAGES = 8;

/** One page link in a flyout. `href` starts with "/". */
export type FlyoutLink = { id: string; label: string; href: string };

/** One group in a flyout: a link to the group and, when short, its pages. */
export type FlyoutGroup = {
  id: string;
  label: string;
  /** Link to the group itself (its own page, or its first page below). */
  href: string;
  /** Pages of the group. Empty when the group has more than FLYOUT_MAX_PAGES pages below it, or is a single page. */
  pages: FlyoutLink[];
  /** Number of pages below the group (own page not counted). */
  pageCount: number;
};

/** Collects the pages below `item`, depth-first, in the given order. */
const collectPages = (item: NavigationItem): FlyoutLink[] =>
  item.children.flatMap((child) => [
    ...(child.hasPage
      ? [{ id: child.id, label: child.label, href: `/${child.route}` }]
      : []),
    ...collectPages(child),
  ]);

/**
 * Builds the groups of a section flyout.
 * Returns [] when the section has no children (the tab stays a plain link).
 * Groups without any page are skipped. The input is not changed.
 */
export const buildFlyout = (
  section: NavigationItem,
  maxPages: number = FLYOUT_MAX_PAGES
): FlyoutGroup[] =>
  section.children.flatMap((group) => {
    const route = firstPageRoute(group);
    if (!route) return [];
    const all = collectPages(group);
    return [
      {
        id: group.id,
        label: group.label,
        href: `/${route}`,
        pages: all.length > maxPages ? [] : all,
        pageCount: all.length,
      },
    ];
  });
