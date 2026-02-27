import { PageContentRoot, PageContentColumn } from "./components";

/**
 * PageContent
 * ============================================================
 * A layout component that provides max-width content containers with single
 * and multi-column layout support. Consolidates MC's `PageContentWide`,
 * `PageContentNarrow`, and `PageContentFull` into a single compound component.
 *
 * @example
 * ```tsx
 * // Single column
 * <PageContent.Root variant="wide">
 *   {children}
 * </PageContent.Root>
 *
 * // Multi-column with sticky sidebar
 * <PageContent.Root variant="wide" columns="2/1">
 *   <PageContent.Column>Main content</PageContent.Column>
 *   <PageContent.Column sticky>Sidebar</PageContent.Column>
 * </PageContent.Root>
 * ```
 */
export const PageContent = {
  /**
   * # PageContent.Root
   *
   * The root container that enforces width constraints and column layout.
   * Uses a CSS grid centering pattern with configurable min/max widths.
   *
   * @example
   * ```tsx
   * <PageContent.Root variant="narrow" columns="1/1">
   *   <PageContent.Column>Left</PageContent.Column>
   *   <PageContent.Column>Right</PageContent.Column>
   * </PageContent.Root>
   * ```
   */
  Root: PageContentRoot,
  /**
   * # PageContent.Column
   *
   * A column within a multi-column PageContent layout. Supports sticky
   * positioning for sidebar patterns. Use with `columns="1/1"` or
   * `columns="2/1"` on Root.
   *
   * @example
   * ```tsx
   * <PageContent.Root variant="wide" columns="2/1">
   *   <PageContent.Column>Main content</PageContent.Column>
   *   <PageContent.Column sticky top="400">Sidebar</PageContent.Column>
   * </PageContent.Root>
   * ```
   */
  Column: PageContentColumn,
};

export {
  PageContentRoot as _PageContentRoot,
  PageContentColumn as _PageContentColumn,
};
