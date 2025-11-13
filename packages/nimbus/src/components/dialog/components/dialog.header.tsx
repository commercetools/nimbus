import { DialogHeaderSlot } from "../dialog.slots";
import type { DialogHeaderProps } from "../dialog.types";

/**
 * Dialog.Header - The header section of the dialog
 *
 * @supportsStyleProps
 */
export const DialogHeader = (props: DialogHeaderProps) => {
  const { ref: forwardedRef, children, ...restProps } = props;

  return (
    <DialogHeaderSlot ref={forwardedRef} {...restProps}>
      {children}
    </DialogHeaderSlot>
  );
};

DialogHeader.displayName = "Dialog.Header";
