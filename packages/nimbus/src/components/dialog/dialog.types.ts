import type { 
  ModalRootProps,
  ModalTriggerProps,
  ModalContentProps,
  ModalBackdropProps,
  ModalHeaderProps,
  ModalBodyProps,
  ModalFooterProps,
  ModalTitleProps,
  ModalDescriptionProps,
  ModalCloseTriggerProps
} from "../modal/modal.types";

/**
 * Props for the Dialog.Root component
 * 
 * The root component that provides context and state management for the dialog.
 * Identical to Modal.Root as it uses the same underlying implementation.
 */
export interface DialogRootProps extends ModalRootProps {}

/**
 * Props for the Dialog.Trigger component
 * 
 * The trigger element that opens the dialog when activated.
 * Identical to Modal.Trigger as it uses the same underlying implementation.
 */
export interface DialogTriggerProps extends ModalTriggerProps {}

/**
 * Props for the Dialog.Content component
 * 
 * The main dialog content container optimized for center-positioned modal dialogs.
 * Extends Modal.Content with Dialog-specific defaults for placement and motionPreset.
 */
export interface DialogContentProps extends Omit<ModalContentProps, 'placement' | 'motionPreset'> {
  /**
   * The placement of the dialog content
   * @default "center" - Dialogs are optimized for center positioning
   */
  placement?: "center" | "top" | "bottom";
  
  /**
   * The motion preset for dialog animations
   * @default "scale" - Dialogs use scale animation for better UX
   */
  motionPreset?: "scale" | "slide-in-bottom" | "slide-in-top" | "slide-in-left" | "slide-in-right" | "none";
}

/**
 * Props for the Dialog.Backdrop component
 * 
 * The backdrop overlay that appears behind the dialog content.
 * Identical to Modal.Backdrop as it uses the same underlying implementation.
 */
export interface DialogBackdropProps extends ModalBackdropProps {}

/**
 * Props for the Dialog.Header component
 * 
 * The header section of the dialog content.
 * Identical to Modal.Header as it uses the same underlying implementation.
 */
export interface DialogHeaderProps extends ModalHeaderProps {}

/**
 * Props for the Dialog.Body component
 * 
 * The main body content section of the dialog.
 * Identical to Modal.Body as it uses the same underlying implementation.
 */
export interface DialogBodyProps extends ModalBodyProps {}

/**
 * Props for the Dialog.Footer component
 * 
 * The footer section of the dialog, typically containing action buttons.
 * Identical to Modal.Footer as it uses the same underlying implementation.
 */
export interface DialogFooterProps extends ModalFooterProps {}

/**
 * Props for the Dialog.Title component
 * 
 * The accessible title element for the dialog.
 * Identical to Modal.Title as it uses the same underlying implementation.
 */
export interface DialogTitleProps extends ModalTitleProps {}

/**
 * Props for the Dialog.Description component
 * 
 * The accessible description element for the dialog.
 * Identical to Modal.Description as it uses the same underlying implementation.
 */
export interface DialogDescriptionProps extends ModalDescriptionProps {}

/**
 * Props for the Dialog.CloseTrigger component
 * 
 * A button that closes the dialog when activated.
 * Identical to Modal.CloseTrigger as it uses the same underlying implementation.
 */
export interface DialogCloseTriggerProps extends ModalCloseTriggerProps {}