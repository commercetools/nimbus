import {
  DefaultPageRoot,
  DefaultPageHeader,
  DefaultPageActions,
  DefaultPageBackLink,
  DefaultPageTitle,
  DefaultPageSubtitle,
  DefaultPageContent,
  DefaultPageFooter,
  DefaultPageTabNav,
} from "./components";

/**
 * DefaultPage
 * ============================================================
 * A compound component providing a flexible page skeleton for both main-level
 * and detail views. Supports an optional back navigation link, header, content
 * area, and optional footer.
 *
 * Consolidates `MainPage` and `DetailPage` into a single component. Use
 * `DefaultPage.BackLink` when the page represents a detail view that needs
 * back navigation; omit it for top-level pages.
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/layout/default-page}
 * @example
 * ```tsx
 * // Detail view (with back link)
 * <DefaultPage.Root>
 *   <DefaultPage.Header>
 *     <DefaultPage.BackLink href="/products">Back to products</DefaultPage.BackLink>
 *     <DefaultPage.Title>Product Details</DefaultPage.Title>
 *     <DefaultPage.Actions>
 *       <Button>Edit</Button>
 *     </DefaultPage.Actions>
 *     <DefaultPage.Subtitle>SKU-12345</DefaultPage.Subtitle>
 *   </DefaultPage.Header>
 *   <DefaultPage.Content>
 *     Main content here
 *   </DefaultPage.Content>
 *   <DefaultPage.Footer>
 *     Footer actions here
 *   </DefaultPage.Footer>
 * </DefaultPage.Root>
 *
 * // Main view (without back link)
 * <DefaultPage.Root>
 *   <DefaultPage.Header>
 *     <DefaultPage.Title>Products</DefaultPage.Title>
 *     <DefaultPage.Actions>
 *       <Button>Add product</Button>
 *     </DefaultPage.Actions>
 *   </DefaultPage.Header>
 *   <DefaultPage.Content>
 *     Main content here
 *   </DefaultPage.Content>
 * </DefaultPage.Root>
 * ```
 */
export const DefaultPage = {
  /**
   * # DefaultPage.Root
   *
   * The root container that provides context and styling for the default page.
   * Must wrap all default page parts.
   *
   * @example
   * ```tsx
   * <DefaultPage.Root>
   *   <DefaultPage.Header>...</DefaultPage.Header>
   *   <DefaultPage.Content>...</DefaultPage.Content>
   * </DefaultPage.Root>
   * ```
   */
  Root: DefaultPageRoot,
  /**
   * # DefaultPage.Header
   *
   * The header section containing the optional back link, title, subtitle,
   * actions, and optional tab navigation.
   *
   * @example
   * ```tsx
   * <DefaultPage.Header>
   *   <DefaultPage.BackLink href="/products">Back</DefaultPage.BackLink>
   *   <DefaultPage.Title>Product Name</DefaultPage.Title>
   * </DefaultPage.Header>
   * ```
   */
  Header: DefaultPageHeader,
  /**
   * # DefaultPage.BackLink
   *
   * A navigation link that takes the user back to the parent page.
   * Requires an `href` prop for the navigation target.
   * When present, the `Actions` slot automatically shifts down to align
   * with the title row.
   *
   * @example
   * ```tsx
   * <DefaultPage.BackLink href="/products">Back to products</DefaultPage.BackLink>
   * ```
   */
  BackLink: DefaultPageBackLink,
  /**
   * # DefaultPage.Title
   *
   * The main page title heading. Renders as an `h1` element.
   *
   * @example
   * ```tsx
   * <DefaultPage.Title>Product Details</DefaultPage.Title>
   * ```
   */
  Title: DefaultPageTitle,
  /**
   * # DefaultPage.Subtitle
   *
   * An optional subtitle displayed below the title.
   *
   * @example
   * ```tsx
   * <DefaultPage.Subtitle>SKU-12345</DefaultPage.Subtitle>
   * ```
   */
  Subtitle: DefaultPageSubtitle,
  /**
   * # DefaultPage.Actions
   *
   * A container for action buttons displayed alongside the title.
   * Place inside `DefaultPage.Header` — the grid layout positions it
   * automatically next to the title (or next to the title row when
   * a `BackLink` is present).
   *
   * @example
   * ```tsx
   * <DefaultPage.Actions>
   *   <Button>Save</Button>
   *   <Button variant="ghost">Delete</Button>
   * </DefaultPage.Actions>
   * ```
   */
  Actions: DefaultPageActions,
  /**
   * # DefaultPage.Content
   *
   * The main content area of the default page.
   *
   * @example
   * ```tsx
   * <DefaultPage.Content>
   *   Form fields here
   * </DefaultPage.Content>
   * ```
   */
  Content: DefaultPageContent,
  /**
   * # DefaultPage.Footer
   *
   * Optional footer section, typically used for form action bars.
   * Omit for info/read-only pages.
   *
   * @example
   * ```tsx
   * <DefaultPage.Footer>
   *   <Button>Save</Button>
   *   <Button variant="ghost">Cancel</Button>
   * </DefaultPage.Footer>
   * ```
   */
  Footer: DefaultPageFooter,
  /**
   * # DefaultPage.TabNav
   *
   * Layout container for tab navigation in the header.
   * Positions itself in the header grid's last row at full width.
   * Place inside `DefaultPage.Header`.
   *
   * Wrap a `TabNav.Root` inside, or use `as={TabNav.Root}` for a flatter DOM.
   *
   * @example
   * ```tsx
   * <DefaultPage.Header>
   *   <DefaultPage.Title>Customer Details</DefaultPage.Title>
   *   <DefaultPage.TabNav>
   *     <TabNav.Root aria-label="Customer sections">
   *       <TabNav.Item href="/general" isCurrent>General</TabNav.Item>
   *       <TabNav.Item href="/addresses">Addresses</TabNav.Item>
   *     </TabNav.Root>
   *   </DefaultPage.TabNav>
   * </DefaultPage.Header>
   * ```
   */
  TabNav: DefaultPageTabNav,
};

export {
  DefaultPageRoot as _DefaultPageRoot,
  DefaultPageHeader as _DefaultPageHeader,
  DefaultPageActions as _DefaultPageActions,
  DefaultPageBackLink as _DefaultPageBackLink,
  DefaultPageTitle as _DefaultPageTitle,
  DefaultPageSubtitle as _DefaultPageSubtitle,
  DefaultPageContent as _DefaultPageContent,
  DefaultPageFooter as _DefaultPageFooter,
  DefaultPageTabNav as _DefaultPageTabNav,
};
