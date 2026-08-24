import { BreadcrumbsRoot, BreadcrumbsItem } from "./components";

/**
 * Breadcrumbs
 * ============================================================
 * A navigation component that displays the hierarchical path to the current
 * page as an ordered list of links. Built on React Aria Components'
 * `Breadcrumbs`/`Breadcrumb`; the last item is treated as the current page
 * automatically (non-interactive text with `aria-current="page"`).
 *
 * Renders proper navigation semantics (`<nav>` landmark, `<ol>`/`<li>`
 * structure, `<a>` elements, `aria-current="page"`) for WCAG 2.1 AA compliant
 * page navigation.
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/navigation/breadcrumbs}
 *
 * @example
 * ```tsx
 * <Breadcrumbs.Root aria-label="Breadcrumb">
 *   <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
 *   <Breadcrumbs.Item href="/orders">Orders</Breadcrumbs.Item>
 *   <Breadcrumbs.Item>Order #123</Breadcrumbs.Item>
 * </Breadcrumbs.Root>
 * ```
 */
export const Breadcrumbs = {
  /**
   * # Breadcrumbs.Root
   *
   * The root container for the breadcrumbs. Renders a `<nav>` landmark wrapping
   * an ordered list of `Breadcrumbs.Item` links. Provide an `aria-label` (e.g.
   * `"Breadcrumb"`) and an optional `separator` node. Accepts compound
   * `Breadcrumbs.Item` children or a declarative `items` array.
   *
   * @example
   * ```tsx
   * <Breadcrumbs.Root aria-label="Breadcrumb" separator="/">
   *   <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
   *   <Breadcrumbs.Item>Settings</Breadcrumbs.Item>
   * </Breadcrumbs.Root>
   * ```
   */
  Root: BreadcrumbsRoot,
  /**
   * # Breadcrumbs.Item
   *
   * An individual breadcrumb. Renders an `<li>` containing an `<a>` link. The
   * last item in a `Breadcrumbs.Root` automatically becomes the current page
   * (non-interactive text with `aria-current="page"`) — there is no `isCurrent`
   * prop.
   *
   * @example
   * ```tsx
   * <Breadcrumbs.Item href="/orders">Orders</Breadcrumbs.Item>
   * <Breadcrumbs.Item>Order #123</Breadcrumbs.Item>
   * ```
   */
  Item: BreadcrumbsItem,
};

export type {
  BreadcrumbsProps,
  BreadcrumbsItemProps,
} from "./breadcrumbs.types";

/**
 * todo: get rid of this, this is needed for the react-docgen-typescript script
 * that is parsing the typescript types for our documentation. The _ underscores
 * serve as a reminder that this exports are awkward and should not be used.
 */
export {
  BreadcrumbsRoot as _BreadcrumbsRoot,
  BreadcrumbsItem as _BreadcrumbsItem,
};
