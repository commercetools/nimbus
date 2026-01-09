import { Close } from "@commercetools/nimbus-icons";
import { DialogCloseTriggerSlot } from "../dialog.slots";
import type { DialogCloseTriggerProps } from "../dialog.types";
import { IconButton } from "@/components";
import { useLocalizedStringFormatter } from "@/hooks";
import { dialogMessagesStrings } from "../dialog.messages";

/**
 * Dialog.CloseTrigger - A button that closes the dialog
 *
 * @supportsStyleProps
 */
export const DialogCloseTrigger = (props: DialogCloseTriggerProps) => {
  const msg = useLocalizedStringFormatter(dialogMessagesStrings);
  const { ref: forwardedRef, "aria-label": ariaLabel, ...restProps } = props;

  return (
    <DialogCloseTriggerSlot>
      <IconButton
        ref={forwardedRef}
        slot="close"
        size="xs"
        variant="ghost"
        aria-label={ariaLabel || msg.format("closeTrigger")}
        {...restProps}
      >
        <Close />
      </IconButton>
    </DialogCloseTriggerSlot>
  );
};

DialogCloseTrigger.displayName = "Dialog.CloseTrigger";
