import {
  MainPageRoot,
  MainPageHeader,
  MainPageTitle,
  MainPageSubtitle,
  MainPageActions,
  MainPageContent,
  MainPageFooter,
} from "./components";

/**
 * MainPage
 * ============================================================
 * A page skeleton compound component providing title, header actions,
 * content area, and optional footer. Replaces MC's FormMainPage,
 * InfoMainPage, TabularMainPage, and CustomFormMainPage with a single
 * composable component.
 *
 * @example
 * ```tsx
 * // Info page (no footer)
 * <MainPage.Root>
 *   <MainPage.Header>
 *     <MainPage.Title>Products</MainPage.Title>
 *     <MainPage.Subtitle>Manage your catalog</MainPage.Subtitle>
 *     <MainPage.Actions>
 *       <Button>Add Product</Button>
 *     </MainPage.Actions>
 *   </MainPage.Header>
 *   <MainPage.Content>
 *     {content}
 *   </MainPage.Content>
 * </MainPage.Root>
 *
 * // Form page (with footer)
 * <MainPage.Root>
 *   <MainPage.Header>
 *     <MainPage.Title>Settings</MainPage.Title>
 *   </MainPage.Header>
 *   <MainPage.Content>
 *     {form fields}
 *   </MainPage.Content>
 *   <MainPage.Footer>
 *     <Button variant="ghost">Cancel</Button>
 *     <Button>Save</Button>
 *   </MainPage.Footer>
 * </MainPage.Root>
 * ```
 */
export const MainPage = {
  /**
   * # MainPage.Root
   *
   * The root page container using CSS grid layout with
   * `grid-template-rows: auto 1fr auto` for header, content, and footer.
   *
   * @example
   * ```tsx
   * <MainPage.Root>
   *   <MainPage.Header>...</MainPage.Header>
   *   <MainPage.Content>...</MainPage.Content>
   * </MainPage.Root>
   * ```
   */
  Root: MainPageRoot,
  /**
   * # MainPage.Header
   *
   * The header section using a two-column grid. Title, Subtitle, and
   * any other content flow into the left column. Actions spans all
   * rows on the right.
   *
   * @example
   * ```tsx
   * <MainPage.Header>
   *   <MainPage.Title>Page Title</MainPage.Title>
   *   <MainPage.Subtitle>Optional subtitle</MainPage.Subtitle>
   *   <MainPage.Actions>
   *     <Button>Action</Button>
   *   </MainPage.Actions>
   * </MainPage.Header>
   * ```
   */
  Header: MainPageHeader,
  /**
   * # MainPage.Title
   *
   * The page title rendered as an h1. Accepts children for full
   * flexibility — pass a string or custom JSX.
   *
   * @example
   * ```tsx
   * <MainPage.Title>Products</MainPage.Title>
   * ```
   */
  Title: MainPageTitle,
  /**
   * # MainPage.Subtitle
   *
   * Optional subtitle displayed below the title in secondary text.
   *
   * @example
   * ```tsx
   * <MainPage.Subtitle>Manage your catalog</MainPage.Subtitle>
   * ```
   */
  Subtitle: MainPageSubtitle,
  /**
   * # MainPage.Actions
   *
   * Container for header action buttons, positioned on the right side
   * of the header.
   *
   * @example
   * ```tsx
   * <MainPage.Actions>
   *   <Button>Add Product</Button>
   * </MainPage.Actions>
   * ```
   */
  Actions: MainPageActions,
  /**
   * # MainPage.Content
   *
   * The main content area with scrollable overflow and margin-based spacing.
   * Uses margin (not padding) to preserve sticky positioning for child
   * components like DataTable.
   *
   * @example
   * ```tsx
   * <MainPage.Content>
   *   {content}
   * </MainPage.Content>
   * ```
   */
  Content: MainPageContent,
  /**
   * # MainPage.Footer
   *
   * Optional footer for page-level actions. Omit for info/read-only pages.
   *
   * @example
   * ```tsx
   * <MainPage.Footer>
   *   <Button variant="ghost">Cancel</Button>
   *   <Button>Save</Button>
   * </MainPage.Footer>
   * ```
   */
  Footer: MainPageFooter,
};

export {
  MainPageRoot as _MainPageRoot,
  MainPageHeader as _MainPageHeader,
  MainPageTitle as _MainPageTitle,
  MainPageSubtitle as _MainPageSubtitle,
  MainPageActions as _MainPageActions,
  MainPageContent as _MainPageContent,
  MainPageFooter as _MainPageFooter,
};
