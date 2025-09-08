import { forwardRef } from "react";
import { ModalFooterSlot } from "../modal.slots";
import type { ModalFooterProps } from "../modal.types";

/**
 * # Modal.Footer
 * 
 * The footer section of the modal, typically containing action buttons.
 * Provides consistent spacing and alignment for modal actions.
 * 
 * @example
 * ```tsx
 * <Modal.Content>
 *   <Modal.Header>...</Modal.Header>
 *   <Modal.Body>...</Modal.Body>
 *   <Modal.Footer>
 *     <Button variant="outline">Cancel</Button>
 *     <Button>Confirm</Button>
 *   </Modal.Footer>
 * </Modal.Content>
 * ```
 */
export const ModalFooter = forwardRef<HTMLElement, ModalFooterProps>(
  (props, ref) => {
    const { children, ...restProps } = props;

    return (
      <ModalFooterSlot ref={ref} {...restProps}>
        {children}
      </ModalFooterSlot>
    );
  }
);

ModalFooter.displayName = "Modal.Footer";