import {
  Modal as RaModal,
  ModalOverlay as RaModalOverlay,
  Dialog as RaDialog,
} from "react-aria-components";
import {
  DialogModalOverlaySlot,
  DialogModalSlot,
  DialogContentSlot,
} from "../dialog.slots";
import type { DialogContentProps } from "../dialog.types";
import { extractStyleProps } from "@/utils/extractStyleProps";
import { useDialogRootContext } from "./dialog.context";

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
export const DialogContent = (props: DialogContentProps) => {
  const { ref: forwardedRef, children, ...restProps } = props;

  // Get recipe configuration from context instead of props
  const {
    defaultOpen,
    isDismissable,
    isKeyboardDismissDisabled,
    shouldCloseOnInteractOutside,
    isOpen,
    onOpenChange,
  } = useDialogRootContext();

  const modalProps = {
    defaultOpen,
    isDismissable,
    isKeyboardDismissDisabled,
    shouldCloseOnInteractOutside,
    isOpen,
    onOpenChange,
  };

  const [styleProps] = extractStyleProps(restProps);

  return (
    <DialogModalOverlaySlot asChild>
      <RaModalOverlay {...modalProps}>
        <DialogModalSlot asChild>
          <RaModal>
            <DialogContentSlot asChild {...styleProps}>
              <RaDialog ref={forwardedRef}>{children}</RaDialog>
            </DialogContentSlot>
          </RaModal>
        </DialogModalSlot>
      </RaModalOverlay>
    </DialogModalOverlaySlot>
  );
};

DialogContent.displayName = "Dialog.Content";
