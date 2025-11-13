import { Close } from "@commercetools/nimbus-icons";
import { DialogCloseTriggerSlot } from "../dialog.slots";
import type { DialogCloseTriggerProps } from "../dialog.types";
import { IconButton } from "@/components";
import { messages } from "../dialog.i18n";
import { useIntl } from "react-intl";

/**
 * Dialog.CloseTrigger - A button that closes the dialog
 *
 * @supportsStyleProps
 */
export const DialogCloseTrigger = (props: DialogCloseTriggerProps) => {
  const { ref: forwardedRef, "aria-label": ariaLabel, ...restProps } = props;
  const intl = useIntl();

  return (
    <DialogCloseTriggerSlot>
      <IconButton
        ref={forwardedRef}
        slot="close"
        size="xs"
        variant="ghost"
        aria-label={ariaLabel || intl.formatMessage(messages.closeTrigger)}
        {...restProps}
      >
        <Close />
      </IconButton>
    </DialogCloseTriggerSlot>
  );
};

DialogCloseTrigger.displayName = "Dialog.CloseTrigger";
