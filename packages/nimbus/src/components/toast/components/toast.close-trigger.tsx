import { ToastCloseTrigger as ToastCloseTriggerSlot } from "../toast.slots";
import type { ToastCloseTriggerProps } from "../toast.types";
import { Clear } from "@commercetools/nimbus-icons";
import { IconButton } from "../../icon-button";
import { useLocalizedStringFormatter } from "@/hooks";
import { toastMessagesStrings } from "../toast.messages";

/**
 * Toast.CloseTrigger - Button to dismiss or close the toast
 *
 * @supportsStyleProps
 */
export const ToastCloseTrigger = ({ ...props }: ToastCloseTriggerProps) => {
  const msg = useLocalizedStringFormatter(toastMessagesStrings);

  return (
    <ToastCloseTriggerSlot>
      <IconButton
        aria-label={msg.format("dismiss")}
        {...props}
        variant="ghost"
        size="2xs"
      >
        <Clear role="img" />
      </IconButton>
    </ToastCloseTriggerSlot>
  );
};

ToastCloseTrigger.displayName = "Toast.CloseTrigger";
