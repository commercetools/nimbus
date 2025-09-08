import { forwardRef } from "react";
import { ModalOverlay as RaModalOverlay } from "react-aria-components";
import { ModalBackdropSlot } from "../modal.slots";
import type { ModalBackdropProps } from "../modal.types";

/**
 * # Modal.Backdrop
 * 
 * The backdrop overlay that appears behind the modal content.
 * Provides a semi-transparent overlay and handles click-outside-to-close behavior.
 * 
 * @example
 * ```tsx
 * <Modal.Root>
 *   <Modal.Trigger>Open Modal</Modal.Trigger>
 *   <Modal.Content>
 *     <Modal.Backdrop />
 *     <Modal.Header>...</Modal.Header>
 *   </Modal.Content>
 * </Modal.Root>
 * ```
 */
export const ModalBackdrop = forwardRef<HTMLDivElement, ModalBackdropProps>(
  (props, ref) => {
    const { style, ...restProps } = props;

    return (
      <ModalBackdropSlot ref={ref} asChild style={style} {...restProps}>
        <RaModalOverlay />
      </ModalBackdropSlot>
    );
  }
);

ModalBackdrop.displayName = "Modal.Backdrop";