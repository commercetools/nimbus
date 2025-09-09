import { forwardRef } from "react";
import { Heading as RaHeading } from "react-aria-components";
import { ModalTitleSlot } from "../modal.slots";
import type { ModalTitleProps } from "../modal.types";

/**
 * # Modal.Title
 *
 * The accessible title element for the modal.
 * Uses React Aria's Heading for proper accessibility and screen reader support.
 *
 * @example
 * ```tsx
 * <Modal.Content>
 *   <Modal.Header>
 *     <Modal.Title>Confirm Action</Modal.Title>
 *   </Modal.Header>
 *   <Modal.Body>...</Modal.Body>
 * </Modal.Content>
 * ```
 */
export const ModalTitle = forwardRef<HTMLHeadingElement, ModalTitleProps>(
  (props, ref) => {
    const { children, ...restProps } = props;

    return (
      <ModalTitleSlot ref={ref} asChild {...restProps}>
        <RaHeading slot="title" level={2}>
          {children}
        </RaHeading>
      </ModalTitleSlot>
    );
  }
);

ModalTitle.displayName = "Modal.Title";
