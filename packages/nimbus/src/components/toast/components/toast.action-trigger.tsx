import { ToastActionTrigger as ToastActionTriggerSlot } from "../toast.slots";
import type { ToastActionTriggerProps } from "../toast.types";
import { Button } from "../../button";

/**
 * Toast.ActionTrigger - Button for action within the toast
 *
 * @supportsStyleProps
 */
export const ToastActionTrigger = ({ ...props }: ToastActionTriggerProps) => {
  return (
    <ToastActionTriggerSlot>
      <Button {...props} variant="ghost" size="xs" />
    </ToastActionTriggerSlot>
  );
};

ToastActionTrigger.displayName = "Toast.ActionTrigger";
