import { DialogRoot } from "./components/dialog.root";
import { DialogTrigger } from "./components/dialog.trigger";
import { DialogContent } from "./components/dialog.content";
import { DialogHeader } from "./components/dialog.header";
import { DialogBody } from "./components/dialog.body";
import { DialogFooter } from "./components/dialog.footer";
import { DialogTitle } from "./components/dialog.title";
import { DialogCloseTrigger } from "./components/dialog.close-trigger";

/**
 * Dialog
 * ============================================================
 * A foundational dialog component for overlays that require user attention.
 * Built with React Aria Components for accessibility and WCAG 2.1 AA compliance.
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
 * <Dialog.Root>
 *   <Dialog.Trigger>Open Dialog</Dialog.Trigger>
 *   <Dialog.Content size="md" placement="center">
 *     <Dialog.Header>
 *       <Dialog.Title>Dialog Title</Dialog.Title>
 *       <Dialog.CloseTrigger>×</Dialog.CloseTrigger>
 *     </Dialog.Header>
 *     <Dialog.Body>
 *       Dialog content goes here
 *     </Dialog.Body>
 *     <Dialog.Footer>
 *       <button>Cancel</button>
 *       <button>Save</button>
 *     </Dialog.Footer>
 *   </Dialog.Content>
 * </Dialog.Root>
 * ```
 *
 * @see https://nimbus-documentation.vercel.app/components/feedback/dialog
 */
export const Dialog = {
  /**
   * # Dialog.Root
   *
   * The root component that provides context and state management for the dialog.
   * Uses React Aria's DialogTrigger for accessibility and keyboard interaction.
   *
   * This component must wrap all dialog parts (Trigger, Content, etc.) and provides
   * the dialog open/close state and variant styling context.
   *
   * @example
   * ```tsx
   * <Dialog.Root>
   *   <Dialog.Trigger>Open Dialog</Dialog.Trigger>
   *   <Dialog.Content>
   *     <Dialog.Header>
   *       <Dialog.Title>Dialog Title</Dialog.Title>
   *     </Dialog.Header>
   *     <Dialog.Body>Dialog content</Dialog.Body>
   *   </Dialog.Content>
   * </Dialog.Root>
   * ```
   */
  Root: DialogRoot,
  /**
   * # Dialog.Trigger
   *
   * The trigger element that opens the dialog when activated.
   * Uses React Aria's Button for accessibility and keyboard support.
   *
   * @example
   * ```tsx
   * <Dialog.Root>
   *   <Dialog.Trigger>Open Dialog</Dialog.Trigger>
   *   <Dialog.Content>...</Dialog.Content>
   * </Dialog.Root>
   * ```
   */
  Trigger: DialogTrigger,
  /**
   * # Dialog.Content
   *
   * The main dialog content container that wraps React Aria's Modal and Dialog.
   * Handles portalling, backdrop, positioning, and content styling.
   *
   * This component creates the dialog overlay, positions the content, and provides
   * accessibility features like focus management and keyboard dismissal.
   *
   * @example
   * ```tsx
   * <Dialog.Root>
   *   <Dialog.Trigger>Open Dialog</Dialog.Trigger>
   *   <Dialog.Content size="md" placement="center">
   *     <Dialog.Header>
   *       <Dialog.Title>Title</Dialog.Title>
   *     </Dialog.Header>
   *     <Dialog.Body>Content</Dialog.Body>
   *     <Dialog.Footer>Actions</Dialog.Footer>
   *   </Dialog.Content>
   * </Dialog.Root>
   * ```
   */
  Content: DialogContent,
  /**
   * # Dialog.Header
   *
   * The header section of the dialog content.
   * Typically contains the title and close button.
   *
   * @example
   * ```tsx
   * <Dialog.Content>
   *   <Dialog.Header>
   *     <Dialog.Title>Dialog Title</Dialog.Title>
   *     <Dialog.CloseTrigger />
   *   </Dialog.Header>
   *   <Dialog.Body>...</Dialog.Body>
   * </Dialog.Content>
   * ```
   */
  Header: DialogHeader,
  /**
   * # Dialog.Body
   *
   * The main body content section of the dialog.
   * Contains the primary dialog content and handles overflow/scrolling.
   *
   * @example
   * ```tsx
   * <Dialog.Content>
   *   <Dialog.Header>...</Dialog.Header>
   *   <Dialog.Body>
   *     <p>This is the main content of the dialog.</p>
   *   </Dialog.Body>
   *   <Dialog.Footer>...</Dialog.Footer>
   * </Dialog.Content>
   * ```
   */
  Body: DialogBody,
  /**
   * # Dialog.Footer
   *
   * The footer section of the dialog, typically containing action buttons.
   * Provides consistent spacing and alignment for dialog actions.
   *
   * @example
   * ```tsx
   * <Dialog.Content>
   *   <Dialog.Header>...</Dialog.Header>
   *   <Dialog.Body>...</Dialog.Body>
   *   <Dialog.Footer>
   *     <Button variant="outline">Cancel</Button>
   *     <Button>Confirm</Button>
   *   </Dialog.Footer>
   * </Dialog.Content>
   * ```
   */
  Footer: DialogFooter,
  /**
   * # Dialog.Title
   *
   * The accessible title element for the dialog.
   * Uses React Aria's Heading for proper accessibility and screen reader support.
   *
   * @example
   * ```tsx
   * <Dialog.Content>
   *   <Dialog.Header>
   *     <Dialog.Title>Confirm Action</Dialog.Title>
   *   </Dialog.Header>
   *   <Dialog.Body>...</Dialog.Body>
   * </Dialog.Content>
   * ```
   */
  Title: DialogTitle,
  /**
   * # Dialog.CloseTrigger
   *
   * A button that closes the dialog when activated.
   * Displays an IconButton with a close (X) icon by default.
   *
   * The component automatically handles the close behavior through React Aria's
   * context, so no additional onPress handler is needed.
   *
   * @example
   * ```tsx
   * <Dialog.Root>
   *   <Dialog.Trigger>Open Dialog</Dialog.Trigger>
   *   <Dialog.Content>
   *     <Dialog.Header>
   *       <Dialog.Title>Title</Dialog.Title>
   *       <Dialog.CloseTrigger aria-label="Close dialog" />
   *     </Dialog.Header>
   *     <Dialog.Body>Content</Dialog.Body>
   *   </Dialog.Content>
   * </Dialog.Root>
   * ```
   */
  CloseTrigger: DialogCloseTrigger,
};

// Internal exports for react-docgen
export {
  DialogRoot as _DialogRoot,
  DialogTrigger as _DialogTrigger,
  DialogContent as _DialogContent,
  DialogHeader as _DialogHeader,
  DialogBody as _DialogBody,
  DialogFooter as _DialogFooter,
  DialogTitle as _DialogTitle,
  DialogCloseTrigger as _DialogCloseTrigger,
};
