import { Close } from "@commercetools/nimbus-icons";
import { DialogCloseTriggerSlot } from "../dialog.slots";
import type { DialogCloseTriggerProps } from "../dialog.types";
import { IconButton } from "@/components";
import { useLocale } from "react-aria-components";
import { dialogMessages } from "../dialog.messages";

/**
 * Dialog.CloseTrigger - A button that closes the dialog
 *
 * @supportsStyleProps
 */
export const DialogCloseTrigger = (props: DialogCloseTriggerProps) => {
  const { ref: forwardedRef, "aria-label": ariaLabel, ...restProps } = props;
  const { locale } = useLocale();

  return (
    <DialogCloseTriggerSlot>
      <IconButton
        ref={forwardedRef}
        slot="close"
        size="xs"
        variant="ghost"
        aria-label={
          ariaLabel || dialogMessages.getVariableLocale("closeTrigger", locale)
        }
        {...restProps}
      >
        <Close />
      </IconButton>
    </DialogCloseTriggerSlot>
  );
};

DialogCloseTrigger.displayName = "Dialog.CloseTrigger";
