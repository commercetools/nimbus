import { BreadcrumbsRoot, BreadcrumbsItem } from "./components";

/**
 * Breadcrumbs
 * ============================================================
 * Breadcrumbs display a hierarchy of links to the current page or resource,
 * helping users understand and navigate their location within an application.
 *
 * The last item represents the current page: omit its `href` and it renders as
 * static, non-interactive text (`aria-current="page"`).
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/navigation/breadcrumbs}
 *
 * @example
 * ```tsx
 * <Breadcrumbs.Root aria-label="Breadcrumbs">
 *   <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
 *   <Breadcrumbs.Item href="/reports">Reports</Breadcrumbs.Item>
 *   <Breadcrumbs.Item>Q3 Summary</Breadcrumbs.Item>
 * </Breadcrumbs.Root>
 * ```
 */
export const Breadcrumbs = {
  /**
   * # Breadcrumbs.Root
   *
   * The root component that renders the ordered list of breadcrumb items and
   * provides styling context to its parts. Supports both static children and
   * dynamic collections via the `items` prop. Place inside a navigation
   * landmark by providing an `aria-label`.
   *
   * @example
   * ```tsx
   * <Breadcrumbs.Root aria-label="Breadcrumbs" onAction={navigate}>
   *   <Breadcrumbs.Item id="home">Home</Breadcrumbs.Item>
   *   <Breadcrumbs.Item id="current">Details</Breadcrumbs.Item>
   * </Breadcrumbs.Root>
   * ```
   */
  Root: BreadcrumbsRoot,

  /**
   * # Breadcrumbs.Item
   *
   * A single entry in the breadcrumb trail. Provide an `href` to render a
   * navigable link, or omit it on the final item to mark the current page.
   * A decorative separator is rendered automatically after every item except
   * the current one.
   *
   * @example
   * ```tsx
   * <Breadcrumbs.Root aria-label="Breadcrumbs">
   *   <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
   *   <Breadcrumbs.Item>Current page</Breadcrumbs.Item>
   * </Breadcrumbs.Root>
   * ```
   */
  Item: BreadcrumbsItem,
};
