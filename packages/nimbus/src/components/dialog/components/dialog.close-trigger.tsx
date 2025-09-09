import { forwardRef } from "react";
import { Button as RaButton } from "react-aria-components";
import { Close } from "@commercetools/nimbus-icons";
import { DialogCloseTriggerSlot } from "../dialog.slots";
import type { DialogCloseTriggerProps } from "../dialog.types";

/**
 * # Dialog.CloseTrigger
 *
 * A button that closes the dialog when activated.
 * Displays an IconButton with a close (X) icon by default.
 *
 * The component automatically handles the close behavior through React Aria's
 * context, so no additional onPress handler is needed.
 *
 * @example
 * ```tsx
 * <Dialog.Root>
 *   <Dialog.Trigger>Open Dialog</Dialog.Trigger>
 *   <Dialog.Content>
 *     <Dialog.Header>
 *       <Dialog.Title>Title</Dialog.Title>
 *       <Dialog.CloseTrigger aria-label="Close dialog" />
 *     </Dialog.Header>
 *     <Dialog.Body>Content</Dialog.Body>
 *   </Dialog.Content>
 * </Dialog.Root>
 * ```
 */
export const DialogCloseTrigger = forwardRef<
  HTMLButtonElement,
  DialogCloseTriggerProps
>((props, ref) => {
  const { "aria-label": ariaLabel = "Close dialog", ...restProps } = props;

  return (
    <DialogCloseTriggerSlot asChild>
      <RaButton
        ref={ref}
        slot="close"
        aria-label={ariaLabel}
        {...restProps}
      >
        <Close role="img" />
      </RaButton>
    </DialogCloseTriggerSlot>
  );
});

DialogCloseTrigger.displayName = "Dialog.CloseTrigger";
