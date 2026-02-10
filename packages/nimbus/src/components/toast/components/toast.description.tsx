import { ToastDescription as ToastDescriptionSlot } from "../toast.slots";
import type { ToastDescriptionProps } from "../toast.types";

/**
 * Toast.Description - Displays the description text for the toast
 *
 * @supportsStyleProps
 */
export const ToastDescription = ({
  children,
  ...props
}: ToastDescriptionProps) => {
  return <ToastDescriptionSlot {...props}>{children}</ToastDescriptionSlot>;
};

ToastDescription.displayName = "Toast.Description";
