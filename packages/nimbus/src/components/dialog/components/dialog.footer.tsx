import { DialogFooterSlot } from "../dialog.slots";
import type { DialogFooterProps } from "../dialog.types";

/**
 * Dialog.Footer - The footer section with action buttons
 *
 * @supportsStyleProps
 */
export const DialogFooter = (props: DialogFooterProps) => {
  const { ref: forwardedRef, children, ...restProps } = props;

  return (
    <DialogFooterSlot ref={forwardedRef} {...restProps}>
      {children}
    </DialogFooterSlot>
  );
};

DialogFooter.displayName = "Dialog.Footer";
