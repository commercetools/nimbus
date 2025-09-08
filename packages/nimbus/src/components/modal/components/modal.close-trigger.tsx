import { forwardRef } from "react";
import { Button as RaButton } from "react-aria-components";
import { ModalCloseTriggerSlot } from "../modal.slots";
import type { ModalCloseTriggerProps } from "../modal.types";

/**
 * # Modal.CloseTrigger
 * 
 * A button that closes the modal when activated.
 * Uses React Aria's Button for accessibility and keyboard support.
 * 
 * The component automatically handles the close behavior through React Aria's
 * context, so no additional onPress handler is needed.
 * 
 * @example
 * ```tsx
 * <Modal.Root>
 *   <Modal.Trigger>Open Modal</Modal.Trigger>
 *   <Modal.Content>
 *     <Modal.Header>
 *       <Modal.Title>Title</Modal.Title>
 *       <Modal.CloseTrigger aria-label="Close modal">
 *         <X />
 *       </Modal.CloseTrigger>
 *     </Modal.Header>
 *     <Modal.Body>Content</Modal.Body>
 *   </Modal.Content>
 * </Modal.Root>
 * ```
 */
export const ModalCloseTrigger = forwardRef<HTMLButtonElement, ModalCloseTriggerProps>(
  (props, ref) => {
    const { 
      children, 
      "aria-label": ariaLabel = "Close modal",
      ...restProps 
    } = props;

    return (
      <ModalCloseTriggerSlot asChild>
        <RaButton
          ref={ref}
          aria-label={ariaLabel}
          {...restProps}
        >
          {children}
        </RaButton>
      </ModalCloseTriggerSlot>
    );
  }
);

ModalCloseTrigger.displayName = "Modal.CloseTrigger";