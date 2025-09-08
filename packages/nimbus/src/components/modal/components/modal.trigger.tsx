import { Button as RaButton } from "react-aria-components";
import { ModalTriggerSlot } from "../modal.slots";
import type { ModalTriggerProps } from "../modal.types";

/**
 * # Modal.Trigger
 * 
 * The trigger element that opens the modal when activated.
 * Uses React Aria's Button for accessibility and keyboard support.
 * 
 * @example
 * ```tsx
 * <Modal.Root>
 *   <Modal.Trigger>Open Modal</Modal.Trigger>
 *   <Modal.Content>...</Modal.Content>
 * </Modal.Root>
 * ```
 */
export const ModalTrigger = (props: ModalTriggerProps) => {
  const { children, ...restProps } = props;

  return (
    <ModalTriggerSlot asChild>
      <RaButton {...restProps}>
        {children}
      </RaButton>
    </ModalTriggerSlot>
  );
};

ModalTrigger.displayName = "Modal.Trigger";