import {
  ModalPageRoot,
  ModalPageTopBar,
  ModalPageHeader,
  ModalPageTitle,
  ModalPageSubtitle,
  ModalPageActions,
  ModalPageTabNav,
  ModalPageContent,
  ModalPageFooter,
} from "./components";

/**
 * ModalPage
 * ============================================================
 * A fullscreen modal overlay used for form, info, and tabular page patterns.
 * Wraps Drawer internally with right-side placement and near-full-width layout.
 *
 * Used for the ~29 modal page patterns in Merchant Center (form/info/tabular).
 *
 * @example
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 *
 * <ModalPage.Root isOpen={isOpen} onClose={() => setIsOpen(false)}>
 *   <ModalPage.TopBar
 *     previousPathLabel="Products"
 *     currentPathLabel="Edit Product"
 *   />
 *   <ModalPage.Header>
 *     <ModalPage.Title>Edit Product</ModalPage.Title>
 *     <ModalPage.Subtitle>Update the product details</ModalPage.Subtitle>
 *     <ModalPage.Actions>
 *       <Button>Save</Button>
 *     </ModalPage.Actions>
 *   </ModalPage.Header>
 *   <ModalPage.Content>
 *     <p>Form content here</p>
 *   </ModalPage.Content>
 *   <ModalPage.Footer>
 *     <Button slot="close" variant="outline">Cancel</Button>
 *     <Button variant="solid">Save</Button>
 *   </ModalPage.Footer>
 * </ModalPage.Root>
 * ```
 */
export const ModalPage = {
  /**
   * # ModalPage.Root
   *
   * The root container. Renders a fullscreen right-side Drawer.
   * Controlled-only: requires `isOpen` and `onClose`.
   *
   * @example
   * ```tsx
   * <ModalPage.Root isOpen={isOpen} onClose={() => setIsOpen(false)}>
   *   <ModalPage.TopBar previousPathLabel="Products" currentPathLabel="Edit Product" />
   *   <ModalPage.Header>...</ModalPage.Header>
   *   <ModalPage.Content>...</ModalPage.Content>
   * </ModalPage.Root>
   * ```
   */
  Root: ModalPageRoot,
  /**
   * # ModalPage.TopBar
   *
   * Breadcrumb navigation row with a back button and current path label.
   *
   * @example
   * ```tsx
   * <ModalPage.TopBar
   *   previousPathLabel="Products"
   *   currentPathLabel="Edit Product"
   * />
   * ```
   */
  TopBar: ModalPageTopBar,
  /**
   * # ModalPage.Header
   *
   * Header section with a 2-column grid layout for Title and Actions.
   *
   * @example
   * ```tsx
   * <ModalPage.Header>
   *   <ModalPage.Title>Edit Product</ModalPage.Title>
   *   <ModalPage.Actions>
   *     <Button>Save</Button>
   *   </ModalPage.Actions>
   * </ModalPage.Header>
   * ```
   */
  Header: ModalPageHeader,
  /**
   * # ModalPage.Title
   *
   * The main page title heading. Renders as an `h2` element.
   *
   * @example
   * ```tsx
   * <ModalPage.Title>Edit Product</ModalPage.Title>
   * ```
   */
  Title: ModalPageTitle,
  /**
   * # ModalPage.Subtitle
   *
   * An optional subtitle displayed below the title.
   *
   * @example
   * ```tsx
   * <ModalPage.Subtitle>Fill in the product details</ModalPage.Subtitle>
   * ```
   */
  Subtitle: ModalPageSubtitle,
  /**
   * # ModalPage.Actions
   *
   * Container for action buttons in the header.
   *
   * @example
   * ```tsx
   * <ModalPage.Actions>
   *   <Button variant="outline">Preview</Button>
   * </ModalPage.Actions>
   * ```
   */
  Actions: ModalPageActions,
  /**
   * # ModalPage.TabNav
   *
   * Layout container for tab navigation in the header.
   * Positions itself in the header grid's last row at full width.
   * Place inside `ModalPage.Header`.
   *
   * Wrap a `TabNav.Root` inside, or use `as={TabNav.Root}` for a flatter DOM.
   *
   * @example
   * ```tsx
   * <ModalPage.Header>
   *   <ModalPage.Title>Order Details</ModalPage.Title>
   *   <ModalPage.TabNav>
   *     <TabNav.Root aria-label="Order sections">
   *       <TabNav.Item href="/general" isCurrent>General</TabNav.Item>
   *       <TabNav.Item href="/items">Items</TabNav.Item>
   *     </TabNav.Root>
   *   </ModalPage.TabNav>
   * </ModalPage.Header>
   * ```
   */
  TabNav: ModalPageTabNav,
  /**
   * # ModalPage.Content
   *
   * Scrollable content area.
   *
   * @example
   * ```tsx
   * <ModalPage.Content>
   *   <FormField.Root>...</FormField.Root>
   * </ModalPage.Content>
   * ```
   */
  Content: ModalPageContent,
  /**
   * # ModalPage.Footer
   *
   * Footer slot for action buttons (save/cancel).
   *
   * @example
   * ```tsx
   * <ModalPage.Footer>
   *   <Button slot="close" variant="outline">Cancel</Button>
   *   <Button variant="solid">Save</Button>
   * </ModalPage.Footer>
   * ```
   */
  Footer: ModalPageFooter,
};

// Internal named exports for react-docgen
export {
  ModalPageRoot as _ModalPageRoot,
  ModalPageTopBar as _ModalPageTopBar,
  ModalPageHeader as _ModalPageHeader,
  ModalPageTitle as _ModalPageTitle,
  ModalPageSubtitle as _ModalPageSubtitle,
  ModalPageActions as _ModalPageActions,
  ModalPageTabNav as _ModalPageTabNav,
  ModalPageContent as _ModalPageContent,
  ModalPageFooter as _ModalPageFooter,
};
