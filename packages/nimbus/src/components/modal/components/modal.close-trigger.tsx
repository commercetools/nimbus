import { forwardRef } from "react";
import { Close } from "@commercetools/nimbus-icons";
import { IconButton } from "../../icon-button";
import { ModalCloseTriggerSlot } from "../modal.slots";
import type { ModalCloseTriggerProps } from "../modal.types";

/**
 * # Modal.CloseTrigger
 *
 * A button that closes the modal when activated.
 * Displays an IconButton with a close (X) icon by default.
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
 *       <Modal.CloseTrigger aria-label="Close modal" />
 *     </Modal.Header>
 *     <Modal.Body>Content</Modal.Body>
 *   </Modal.Content>
 * </Modal.Root>
 * ```
 */
export const ModalCloseTrigger = forwardRef<
  HTMLButtonElement,
  ModalCloseTriggerProps
>((props, ref) => {
  const { "aria-label": ariaLabel = "Close modal", ...restProps } = props;

  return (
    <ModalCloseTriggerSlot>
      <IconButton
        ref={ref}
        aria-label={ariaLabel}
        variant="ghost"
        size="2xs"
        {...restProps}
      >
        <Close role="img" />
      </IconButton>
    </ModalCloseTriggerSlot>
  );
});

ModalCloseTrigger.displayName = "Modal.CloseTrigger";
