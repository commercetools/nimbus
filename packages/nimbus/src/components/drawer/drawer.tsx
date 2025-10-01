import { DrawerRoot } from "./components/drawer.root";
import { DrawerTrigger } from "./components/drawer.trigger";
import { DrawerContent } from "./components/drawer.content";
import { DrawerHeader } from "./components/drawer.header";
import { DrawerBody } from "./components/drawer.body";
import { DrawerFooter } from "./components/drawer.footer";
import { DrawerTitle } from "./components/drawer.title";
import { DrawerCloseTrigger } from "./components/drawer.close-trigger";

// Re-export types
export type * from "./drawer.types";

/**
 * Drawer
 * ============================================================
 * A foundational drawer component for overlays that require user attention.
 * Built for accessibility and WCAG 2.1 AA compliance.
 *
 * Features:
 * - Controlled and uncontrolled modes
 * - Customizable placement, size, and animations
 * - Focus management and keyboard navigation
 * - Click-outside and Escape key dismissal
 * - Portal rendering support
 * - Backdrop overlay with animations
 *
 * @example
 * ```tsx
 * <Drawer.Root>
 *   <Drawer.Trigger>Open Drawer</Drawer.Trigger>
 *   <Drawer.Content size="md" placement="center">
 *     <Drawer.Header>
 *       <Drawer.Title>Drawer Title</Drawer.Title>
 *       <Drawer.CloseTrigger>×</Drawer.CloseTrigger>
 *     </Drawer.Header>
 *     <Drawer.Body>
 *       Drawer content goes here
 *     </Drawer.Body>
 *     <Drawer.Footer>
 *       <button>Cancel</button>
 *       <button>Save</button>
 *     </Drawer.Footer>
 *   </Drawer.Content>
 * </Drawer.Root>
 * ```
 * @see https://nimbus-documentation.vercel.app/components/feedback/drawer
 */
export const Drawer = {
  /**
   * # Drawer.Root
   *
   * The root component that provides context and state management for the drawer.
   * Handles accessibility and keyboard interaction.
   *
   * This component must wrap all drawer parts (Trigger, Content, etc.) and provides
   * the drawer open/close state and variant styling context.
   *
   * @example
   * ```tsx
   * <Drawer.Root>
   *   <Drawer.Trigger>Open Drawer</Drawer.Trigger>
   *   <Drawer.Content>
   *     <Drawer.Header>
   *       <Drawer.Title>Drawer Title</Drawer.Title>
   *     </Drawer.Header>
   *     <Drawer.Body>Drawer content</Drawer.Body>
   *   </Drawer.Content>
   * </Drawer.Root>
   * ```
   */
  Root: DrawerRoot,
  /**
   * # Drawer.Trigger
   *
   * The trigger element that opens the drawer when activated.
   * Provides accessibility and keyboard support.
   *
   * @example
   * ```tsx
   * <Drawer.Root>
   *   <Drawer.Trigger>Open Drawer</Drawer.Trigger>
   *   <Drawer.Content>...</Drawer.Content>
   * </Drawer.Root>
   * ```
   */
  Trigger: DrawerTrigger,
  /**
   * # Drawer.Content
   *
   * The main drawer content container that handles portalling, backdrop,
   * positioning, and content styling.
   *
   * This component creates the drawer overlay, positions the content, and provides
   * accessibility features like focus management and keyboard dismissal.
   *
   * @example
   * ```tsx
   * <Drawer.Root>
   *   <Drawer.Trigger>Open Drawer</Drawer.Trigger>
   *   <Drawer.Content size="md" placement="center">
   *     <Drawer.Header>
   *       <Drawer.Title>Title</Drawer.Title>
   *     </Drawer.Header>
   *     <Drawer.Body>Content</Drawer.Body>
   *     <Drawer.Footer>Actions</Drawer.Footer>
   *   </Drawer.Content>
   * </Drawer.Root>
   * ```
   */
  Content: DrawerContent,
  /**
   * # Drawer.Header
   *
   * The header section of the drawer content.
   * Typically contains the title and close button.
   *
   * @example
   * ```tsx
   * <Drawer.Content>
   *   <Drawer.Header>
   *     <Drawer.Title>Drawer Title</Drawer.Title>
   *     <Drawer.CloseTrigger />
   *   </Drawer.Header>
   *   <Drawer.Body>...</Drawer.Body>
   * </Drawer.Content>
   * ```
   */
  Header: DrawerHeader,
  /**
   * # Drawer.Body
   *
   * The main body content section of the drawer.
   * Contains the primary drawer content and handles overflow/scrolling.
   *
   * @example
   * ```tsx
   * <Drawer.Content>
   *   <Drawer.Header>...</Drawer.Header>
   *   <Drawer.Body>
   *     <p>This is the main content of the drawer.</p>
   *   </Drawer.Body>
   *   <Drawer.Footer>...</Drawer.Footer>
   * </Drawer.Content>
   * ```
   */
  Body: DrawerBody,
  /**
   * # Drawer.Footer
   *
   * The footer section of the drawer, typically containing action buttons.
   * Provides consistent spacing and alignment for drawer actions.
   *
   * @example
   * ```tsx
   * <Drawer.Content>
   *   <Drawer.Header>...</Drawer.Header>
   *   <Drawer.Body>...</Drawer.Body>
   *   <Drawer.Footer>
   *     <Button variant="outline">Cancel</Button>
   *     <Button>Confirm</Button>
   *   </Drawer.Footer>
   * </Drawer.Content>
   * ```
   */
  Footer: DrawerFooter,
  /**
   * # Drawer.Title
   *
   * The accessible title element for the drawer.
   * Provides proper accessibility and screen reader support.
   *
   * @example
   * ```tsx
   * <Drawer.Content>
   *   <Drawer.Header>
   *     <Drawer.Title>Confirm Action</Drawer.Title>
   *   </Drawer.Header>
   *   <Drawer.Body>...</Drawer.Body>
   * </Drawer.Content>
   * ```
   */
  Title: DrawerTitle,
  /**
   * # Drawer.CloseTrigger
   *
   * A button that closes the drawer when activated.
   * Displays an IconButton with a close (X) icon by default.
   *
   * The component automatically handles the close behavior,
   * so no additional onPress handler is needed.
   *
   * @example
   * ```tsx
   * <Drawer.Root>
   *   <Drawer.Trigger>Open Drawer</Drawer.Trigger>
   *   <Drawer.Content>
   *     <Drawer.Header>
   *       <Drawer.Title>Title</Drawer.Title>
   *       <Drawer.CloseTrigger aria-label="Close drawer" />
   *     </Drawer.Header>
   *     <Drawer.Body>Content</Drawer.Body>
   *   </Drawer.Content>
   * </Drawer.Root>
   * ```
   */
  CloseTrigger: DrawerCloseTrigger,
};

// Internal exports for react-docgen
export {
  DrawerRoot as _DrawerRoot,
  DrawerTrigger as _DrawerTrigger,
  DrawerContent as _DrawerContent,
  DrawerHeader as _DrawerHeader,
  DrawerBody as _DrawerBody,
  DrawerFooter as _DrawerFooter,
  DrawerTitle as _DrawerTitle,
  DrawerCloseTrigger as _DrawerCloseTrigger,
};
