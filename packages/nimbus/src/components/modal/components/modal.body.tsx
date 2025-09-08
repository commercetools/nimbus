import { forwardRef } from "react";
import { ModalBodySlot } from "../modal.slots";
import type { ModalBodyProps } from "../modal.types";

/**
 * # Modal.Body
 * 
 * The main body content section of the modal.
 * Contains the primary modal content and handles overflow/scrolling.
 * 
 * @example
 * ```tsx
 * <Modal.Content>
 *   <Modal.Header>...</Modal.Header>
 *   <Modal.Body>
 *     <p>This is the main content of the modal.</p>
 *   </Modal.Body>
 *   <Modal.Footer>...</Modal.Footer>
 * </Modal.Content>
 * ```
 */
export const ModalBody = forwardRef<HTMLDivElement, ModalBodyProps>(
  (props, ref) => {
    const { children, ...restProps } = props;

    return (
      <ModalBodySlot ref={ref} {...restProps}>
        {children}
      </ModalBodySlot>
    );
  }
);

ModalBody.displayName = "Modal.Body";