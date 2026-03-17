import {
  ModalPageRoot,
  ModalPageTopBar,
  ModalPageHeader,
  ModalPageTitle,
  ModalPageActions,
  ModalPageContent,
  ModalPageFooter,
} from "./components";
import { PageContent } from "../page-content/page-content";

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
 *     <ModalPage.Title title="Edit Product" subtitle="Update the product details" />
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
   *   <ModalPage.Title title="Edit Product" />
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
   * Renders an h2 heading and optional subtitle.
   *
   * @example
   * ```tsx
   * <ModalPage.Title title="Edit Product" subtitle="Fill in the product details" />
   * ```
   */
  Title: ModalPageTitle,
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
   * # ModalPage.Content
   *
   * Scrollable content area. Wraps PageContent.Root.
   *
   * @example
   * ```tsx
   * <ModalPage.Content variant="wide" columns="1">
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
  /**
   * # ModalPage.Column
   *
   * Re-export of PageContent.Column for multi-column content layouts.
   *
   * @example
   * ```tsx
   * <ModalPage.Content variant="wide" columns="2/1">
   *   <ModalPage.Column>Main form</ModalPage.Column>
   *   <ModalPage.Column sticky>Sidebar</ModalPage.Column>
   * </ModalPage.Content>
   * ```
   */
  Column: PageContent.Column,
};

// Internal named exports for react-docgen
export {
  ModalPageRoot as _ModalPageRoot,
  ModalPageTopBar as _ModalPageTopBar,
  ModalPageHeader as _ModalPageHeader,
  ModalPageTitle as _ModalPageTitle,
  ModalPageActions as _ModalPageActions,
  ModalPageContent as _ModalPageContent,
  ModalPageFooter as _ModalPageFooter,
};
