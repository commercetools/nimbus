import { ModalRoot } from "./components/modal.root";
import { ModalTrigger } from "./components/modal.trigger";
import { ModalContent } from "./components/modal.content";
import { ModalBackdrop } from "./components/modal.backdrop";
import { ModalHeader } from "./components/modal.header";
import { ModalBody } from "./components/modal.body";
import { ModalFooter } from "./components/modal.footer";
import { ModalTitle } from "./components/modal.title";
import { ModalDescription } from "./components/modal.description";
import { ModalCloseTrigger } from "./components/modal.close-trigger";

// Re-export types
export type * from "./modal.types";

/**
 * Modal
 * ============================================================
 * A foundational modal component that serves as the base for both Dialog and Drawer components.
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
 * <Modal.Root>
 *   <Modal.Trigger>Open Modal</Modal.Trigger>
 *   <Modal.Content size="md" placement="center">
 *     <Modal.Backdrop />
 *     <Modal.Header>
 *       <Modal.Title>Modal Title</Modal.Title>
 *       <Modal.CloseTrigger>×</Modal.CloseTrigger>
 *     </Modal.Header>
 *     <Modal.Body>
 *       <Modal.Description>
 *         Modal content goes here
 *       </Modal.Description>
 *     </Modal.Body>
 *     <Modal.Footer>
 *       <button>Cancel</button>
 *       <button>Save</button>
 *     </Modal.Footer>
 *   </Modal.Content>
 * </Modal.Root>
 * ```
 * 
 * @see https://react-spectrum.adobe.com/react-aria/Dialog.html
 */
export const Modal = {
  Root: ModalRoot,          // MUST BE FIRST - primary entry point
  Trigger: ModalTrigger,
  Content: ModalContent,
  Backdrop: ModalBackdrop,
  Header: ModalHeader,
  Body: ModalBody,
  Footer: ModalFooter,
  Title: ModalTitle,
  Description: ModalDescription,
  CloseTrigger: ModalCloseTrigger,
};

// Internal exports for react-docgen
export {
  ModalRoot as _ModalRoot,
  ModalTrigger as _ModalTrigger,
  ModalContent as _ModalContent,
  ModalBackdrop as _ModalBackdrop,
  ModalHeader as _ModalHeader,
  ModalBody as _ModalBody,
  ModalFooter as _ModalFooter,
  ModalTitle as _ModalTitle,
  ModalDescription as _ModalDescription,
  ModalCloseTrigger as _ModalCloseTrigger,
};