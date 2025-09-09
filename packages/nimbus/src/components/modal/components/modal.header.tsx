import { forwardRef } from "react";
import { ModalHeaderSlot } from "../modal.slots";
import type { ModalHeaderProps } from "../modal.types";

/**
 * # Modal.Header
 *
 * The header section of the modal content.
 * Typically contains the title and close button.
 *
 * @example
 * ```tsx
 * <Modal.Content>
 *   <Modal.Header>
 *     <Modal.Title>Modal Title</Modal.Title>
 *     <Modal.CloseTrigger />
 *   </Modal.Header>
 *   <Modal.Body>...</Modal.Body>
 * </Modal.Content>
 * ```
 */
export const ModalHeader = forwardRef<HTMLElement, ModalHeaderProps>(
  (props, ref) => {
    const { children, ...restProps } = props;

    return (
      <ModalHeaderSlot ref={ref} {...restProps}>
        {children}
      </ModalHeaderSlot>
    );
  }
);

ModalHeader.displayName = "Modal.Header";
