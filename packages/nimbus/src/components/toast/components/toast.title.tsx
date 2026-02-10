import { ToastTitle as ToastTitleSlot } from "../toast.slots";
import type { ToastTitleProps } from "../toast.types";

/**
 * Toast.Title - Displays the title text for the toast
 *
 * @supportsStyleProps
 */
export const ToastTitle = ({ children, ...props }: ToastTitleProps) => {
  return (
    <ToastTitleSlot {...props} fontWeight="600">
      {children}
    </ToastTitleSlot>
  );
};

ToastTitle.displayName = "Toast.Title";
