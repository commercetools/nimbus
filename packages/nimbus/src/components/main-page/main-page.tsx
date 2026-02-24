import {
  MainPageRoot,
  MainPageHeader,
  MainPageTitle,
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
 *     <MainPage.Actions>
 *       <Button>Add Product</Button>
 *     </MainPage.Actions>
 *   </MainPage.Header>
 *   <MainPage.Content variant="wide">
 *     {content}
 *   </MainPage.Content>
 * </MainPage.Root>
 *
 * // Form page (with footer)
 * <MainPage.Root>
 *   <MainPage.Header>
 *     <MainPage.Title>Settings</MainPage.Title>
 *   </MainPage.Header>
 *   <MainPage.Content variant="narrow">
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
   *   <MainPage.Content variant="wide">...</MainPage.Content>
   * </MainPage.Root>
   * ```
   */
  Root: MainPageRoot,
  /**
   * # MainPage.Header
   *
   * The header section with flex layout for title and actions.
   *
   * @example
   * ```tsx
   * <MainPage.Header>
   *   <MainPage.Title>Page Title</MainPage.Title>
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
   * The page title rendered as an h1 element.
   *
   * @example
   * ```tsx
   * <MainPage.Title>Products</MainPage.Title>
   * ```
   */
  Title: MainPageTitle,
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
   * The main content area that wraps PageContent.Root internally.
   * Forwards `variant` and `columns` props for width constraints.
   *
   * @example
   * ```tsx
   * <MainPage.Content variant="wide" columns="2/1">
   *   <PageContent.Column>Main</PageContent.Column>
   *   <PageContent.Column>Sidebar</PageContent.Column>
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
  MainPageActions as _MainPageActions,
  MainPageContent as _MainPageContent,
  MainPageFooter as _MainPageFooter,
};
