import { DialogRoot } from "./components/dialog.root";
import { DialogTrigger } from "./components/dialog.trigger";
import { DialogContent } from "./components/dialog.content";
import { DialogBackdrop } from "./components/dialog.backdrop";
import { DialogHeader } from "./components/dialog.header";
import { DialogBody } from "./components/dialog.body";
import { DialogFooter } from "./components/dialog.footer";
import { DialogTitle } from "./components/dialog.title";
import { DialogCloseTrigger } from "./components/dialog.close-trigger";

// Re-export types
export type * from "./dialog.types";

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
 *     <Dialog.Backdrop />
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
 * @see https://react-spectrum.adobe.com/react-aria/Dialog.html
 */
export const Dialog = {
  Root: DialogRoot, // MUST BE FIRST - primary entry point
  Trigger: DialogTrigger,
  Content: DialogContent,
  Backdrop: DialogBackdrop,
  Header: DialogHeader,
  Body: DialogBody,
  Footer: DialogFooter,
  Title: DialogTitle,
  CloseTrigger: DialogCloseTrigger,
};

// Internal exports for react-docgen
export {
  DialogRoot as _DialogRoot,
  DialogTrigger as _DialogTrigger,
  DialogContent as _DialogContent,
  DialogBackdrop as _DialogBackdrop,
  DialogHeader as _DialogHeader,
  DialogBody as _DialogBody,
  DialogFooter as _DialogFooter,
  DialogTitle as _DialogTitle,
  DialogCloseTrigger as _DialogCloseTrigger,
};
