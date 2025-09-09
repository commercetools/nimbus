import { forwardRef } from "react";
import { Modal as RaModal, Dialog as RaDialog } from "react-aria-components";
import { ModalPositionerSlot, ModalContentSlot } from "../modal.slots";
import type { ModalContentProps } from "../modal.types";

/**
 * # Modal.Content
 *
 * The main modal content container that wraps React Aria's Modal and Dialog.
 * Handles portalling, backdrop, positioning, and content styling.
 *
 * This component creates the modal overlay, positions the content, and provides
 * accessibility features like focus management and keyboard dismissal.
 *
 * @example
 * ```tsx
 * <Modal.Root>
 *   <Modal.Trigger>Open Modal</Modal.Trigger>
 *   <Modal.Content size="md" placement="center">
 *     <Modal.Header>
 *       <Modal.Title>Title</Modal.Title>
 *     </Modal.Header>
 *     <Modal.Body>Content</Modal.Body>
 *     <Modal.Footer>Actions</Modal.Footer>
 *   </Modal.Content>
 * </Modal.Root>
 * ```
 */
export const ModalContent = forwardRef<HTMLDivElement, ModalContentProps>(
  (props, ref) => {
    const {
      children,
      isPortalled = true,
      portalContainer,
      hasBackdrop = true,
      isDismissable = true,
      isKeyboardDismissDisabled = false,
      onClose,
      size,
      placement,
      scrollBehavior,
      motionPreset,
      ...restProps
    } = props;

    return (
      <RaModal
        isDismissable={isDismissable}
        isKeyboardDismissDisabled={isKeyboardDismissDisabled}
      >
        <ModalPositionerSlot
          size={size}
          placement={placement}
          scrollBehavior={scrollBehavior}
          motionPreset={motionPreset}
        >
          <ModalContentSlot 
            ref={ref} 
            asChild 
            size={size}
            placement={placement}
            scrollBehavior={scrollBehavior}
            motionPreset={motionPreset}
            {...restProps}
          >
            <RaDialog onClose={onClose}>{children}</RaDialog>
          </ModalContentSlot>
        </ModalPositionerSlot>
      </RaModal>
    );
  }
);

ModalContent.displayName = "Modal.Content";
