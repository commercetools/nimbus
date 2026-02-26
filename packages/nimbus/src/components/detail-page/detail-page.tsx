import {
  DetailPageRoot,
  DetailPageHeader,
  DetailPageBackLink,
  DetailPageTitle,
  DetailPageSubtitle,
  DetailPageContent,
  DetailPageFooter,
} from "./components";

/**
 * DetailPage
 * ============================================================
 * A compound component providing a page skeleton for detail views
 * with back navigation, header, content area, and optional footer.
 *
 * Replaces the structural layout of MC's `form-detail-page`,
 * `info-detail-page`, `tabular-detail-page`, and `custom-form-detail-page`.
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/layout/detail-page}
 * @example
 * ```tsx
 * <DetailPage.Root>
 *   <DetailPage.Header>
 *     <DetailPage.BackLink href="/products">Back to products</DetailPage.BackLink>
 *     <DetailPage.Title>Product Details</DetailPage.Title>
 *     <DetailPage.Subtitle>SKU-12345</DetailPage.Subtitle>
 *   </DetailPage.Header>
 *   <DetailPage.Content>
 *     Main content here
 *   </DetailPage.Content>
 *   <DetailPage.Footer>
 *     Footer actions here
 *   </DetailPage.Footer>
 * </DetailPage.Root>
 * ```
 */
export const DetailPage = {
  /**
   * # DetailPage.Root
   *
   * The root container that provides context and styling for the detail page.
   * Must wrap all detail page parts.
   *
   * @example
   * ```tsx
   * <DetailPage.Root>
   *   <DetailPage.Header>...</DetailPage.Header>
   *   <DetailPage.Content>...</DetailPage.Content>
   * </DetailPage.Root>
   * ```
   */
  Root: DetailPageRoot,
  /**
   * # DetailPage.Header
   *
   * The header section containing the back link, title, and subtitle.
   *
   * @example
   * ```tsx
   * <DetailPage.Header>
   *   <DetailPage.BackLink href="/products">Back</DetailPage.BackLink>
   *   <DetailPage.Title>Product Name</DetailPage.Title>
   * </DetailPage.Header>
   * ```
   */
  Header: DetailPageHeader,
  /**
   * # DetailPage.BackLink
   *
   * A navigation link that takes the user back to the parent page.
   * Requires an `href` prop for the navigation target.
   *
   * @example
   * ```tsx
   * <DetailPage.BackLink href="/products">Back to products</DetailPage.BackLink>
   * ```
   */
  BackLink: DetailPageBackLink,
  /**
   * # DetailPage.Title
   *
   * The main page title heading. Renders as an `h1` element.
   *
   * @example
   * ```tsx
   * <DetailPage.Title>Product Details</DetailPage.Title>
   * ```
   */
  Title: DetailPageTitle,
  /**
   * # DetailPage.Subtitle
   *
   * An optional subtitle displayed below the title.
   *
   * @example
   * ```tsx
   * <DetailPage.Subtitle>SKU-12345</DetailPage.Subtitle>
   * ```
   */
  Subtitle: DetailPageSubtitle,
  /**
   * # DetailPage.Content
   *
   * The main content area. The content width is controlled by the
   * `contentVariant` prop on `DetailPage.Root` (`wide`, `narrow`, `full`).
   *
   * @example
   * ```tsx
   * <DetailPage.Root contentVariant="narrow">
   *   <DetailPage.Content>
   *     Form fields here
   *   </DetailPage.Content>
   * </DetailPage.Root>
   * ```
   */
  Content: DetailPageContent,
  /**
   * # DetailPage.Footer
   *
   * Optional footer section, typically used for form action bars.
   * Omit for info/read-only pages.
   *
   * @example
   * ```tsx
   * <DetailPage.Footer>
   *   <Button>Save</Button>
   *   <Button variant="ghost">Cancel</Button>
   * </DetailPage.Footer>
   * ```
   */
  Footer: DetailPageFooter,
};

export {
  DetailPageRoot as _DetailPageRoot,
  DetailPageHeader as _DetailPageHeader,
  DetailPageBackLink as _DetailPageBackLink,
  DetailPageTitle as _DetailPageTitle,
  DetailPageSubtitle as _DetailPageSubtitle,
  DetailPageContent as _DetailPageContent,
  DetailPageFooter as _DetailPageFooter,
};
