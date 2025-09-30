import { Close } from "@commercetools/nimbus-icons";
import { DialogCloseTriggerSlot } from "../dialog.slots";
import type { DialogCloseTriggerProps } from "../dialog.types";
import { IconButton } from "@/components";

export const DialogCloseTrigger = (props: DialogCloseTriggerProps) => {
  const {
    ref: forwardedRef,
    "aria-label": ariaLabel = "Close dialog",
    ...restProps
  } = props;

  return (
    <DialogCloseTriggerSlot>
      <IconButton
        ref={forwardedRef}
        slot="close"
        size="xs"
        variant="ghost"
        aria-label={ariaLabel}
        {...restProps}
      >
        <Close />
      </IconButton>
    </DialogCloseTriggerSlot>
  );
};

DialogCloseTrigger.displayName = "Dialog.CloseTrigger";
