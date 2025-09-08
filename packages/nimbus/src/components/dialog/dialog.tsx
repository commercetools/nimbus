import { forwardRef } from "react";
import { Modal } from "../modal/modal";
import type { 
  DialogRootProps,
  DialogTriggerProps,
  DialogContentProps,
  DialogBackdropProps,
  DialogHeaderProps,
  DialogBodyProps,
  DialogFooterProps,
  DialogTitleProps,
  DialogDescriptionProps,
  DialogCloseTriggerProps,
} from "./dialog.types";

// Re-export types
export type * from "./dialog.types";

/**
 * # Dialog.Content
 * 
 * Dialog-specific content component that wraps Modal.Content with optimized defaults.
 * Pre-configured for center positioning and scale animations - perfect for alerts, 
 * confirmations, and form dialogs.
 * 
 * @example
 * ```tsx
 * <Dialog.Content size="md">
 *   <Dialog.Header>
 *     <Dialog.Title>Confirm Action</Dialog.Title>
 *     <Dialog.CloseTrigger />
 *   </Dialog.Header>
 *   <Dialog.Body>
 *     Are you sure you want to continue?
 *   </Dialog.Body>
 *   <Dialog.Footer>
 *     <button>Cancel</button>
 *     <button>Confirm</button>
 *   </Dialog.Footer>
 * </Dialog.Content>
 * ```
 */
const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(
  (props, ref) => {
    const {
      placement = "center",
      motionPreset = "scale",
      ...restProps
    } = props;

    return (
      <Modal.Content 
        ref={ref}
        placement={placement}
        motionPreset={motionPreset}
        {...restProps}
      />
    );
  }
);

DialogContent.displayName = "Dialog.Content";

/**
 * Dialog
 * ============================================================
 * A center-focused dialog component optimized for alerts, confirmations, and modal forms.
 * Built on top of the Modal component with pre-configured defaults for traditional dialog use cases.
 * 
 * Key differences from Modal:
 * - Default placement: "center" (vs configurable)
 * - Default animation: "scale" (vs configurable) 
 * - Optimized for quick interactions and focused content
 * - Perfect for alerts, confirmations, forms, and focused tasks
 * 
 * Features:
 * - All Modal functionality with dialog-optimized defaults
 * - WCAG 2.1 AA accessibility compliance via React Aria
 * - Focus management and keyboard navigation
 * - Click-outside and Escape key dismissal
 * - Backdrop overlay with smooth animations
 * 
 * @example
 * ```tsx
 * <Dialog.Root>
 *   <Dialog.Trigger>Delete Item</Dialog.Trigger>
 *   <Dialog.Content>
 *     <Dialog.Header>
 *       <Dialog.Title>Confirm Delete</Dialog.Title>
 *       <Dialog.CloseTrigger>×</Dialog.CloseTrigger>
 *     </Dialog.Header>
 *     <Dialog.Body>
 *       <Dialog.Description>
 *         This action cannot be undone. Are you sure?
 *       </Dialog.Description>
 *     </Dialog.Body>
 *     <Dialog.Footer>
 *       <button>Cancel</button>
 *       <button>Delete</button>
 *     </Dialog.Footer>
 *   </Dialog.Content>
 * </Dialog.Root>
 * ```
 * 
 * @see https://react-spectrum.adobe.com/react-aria/Dialog.html
 */
export const Dialog = {
  Root: Modal.Root as React.ComponentType<DialogRootProps>,
  Trigger: Modal.Trigger as React.ComponentType<DialogTriggerProps>,
  Content: DialogContent,
  Backdrop: Modal.Backdrop as React.ComponentType<DialogBackdropProps>,
  Header: Modal.Header as React.ComponentType<DialogHeaderProps>,
  Body: Modal.Body as React.ComponentType<DialogBodyProps>,
  Footer: Modal.Footer as React.ComponentType<DialogFooterProps>,
  Title: Modal.Title as React.ComponentType<DialogTitleProps>,
  Description: Modal.Description as React.ComponentType<DialogDescriptionProps>,
  CloseTrigger: Modal.CloseTrigger as React.ComponentType<DialogCloseTriggerProps>,
};

// Internal exports for react-docgen
export {
  DialogContent as _DialogContent,
};
