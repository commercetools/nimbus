import { TabNavRoot, TabNavItem } from "./components";

/**
 * TabNav
 * ============================================================
 * A tab-styled navigation component for route-based navigation links.
 * Renders proper navigation semantics (`<nav>` landmark, `<a>` elements,
 * `aria-current="page"`) for WCAG 2.1 AA compliant page navigation.
 *
 * Unlike the `Tabs` component (which uses `role="tablist"` and roving tabindex
 * for content-switching), `TabNav` uses standard sequential Tab key navigation
 * and is appropriate for navigating between routes or page views.
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/navigation/tab-nav}
 *
 * @example
 * ```tsx
 * <TabNav.Root>
 *   <TabNav.Item href="/orders/123/general" isCurrent>
 *     General
 *   </TabNav.Item>
 *   <TabNav.Item href="/orders/123/items">Items</TabNav.Item>
 *   <TabNav.Item href="/orders/123/shipping">Shipping</TabNav.Item>
 * </TabNav.Root>
 * ```
 */
export const TabNav = {
  /**
   * # TabNav.Root
   *
   * The root container for the tab navigation. Renders a `<nav>` landmark
   * with the tab strip underline styling.
   *
   * @example
   * ```tsx
   * <TabNav.Root variant="tabs">
   *   <TabNav.Item href="/general" isCurrent>General</TabNav.Item>
   *   <TabNav.Item href="/items">Items</TabNav.Item>
   * </TabNav.Root>
   * ```
   */
  Root: TabNavRoot,
  /**
   * # TabNav.Item
   *
   * An individual tab-styled navigation link. Renders as an `<a>` element.
   * Use `isCurrent` to mark the active navigation item.
   *
   * @example
   * ```tsx
   * <TabNav.Item href="/orders/123/general" isCurrent>
   *   General
   * </TabNav.Item>
   * ```
   */
  Item: TabNavItem,
};

export type { TabNavProps, TabNavItemProps } from "./tab-nav.types";

/**
 * todo: get rid of this, this is needed for the react-docgen-typescript script
 * that is parsing the typescript types for our documentation. The _ underscores
 * serve as a reminder that this exports are awkward and should not be used.
 */
export { TabNavRoot as _TabNavRoot, TabNavItem as _TabNavItem };
