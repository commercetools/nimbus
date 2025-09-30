import { DialogBodySlot } from "../dialog.slots";
import type { DialogBodyProps } from "../dialog.types";
import { useDialogRootContext } from "./dialog.context";

export const DialogBody = (props: DialogBodyProps) => {
  const { ref: forwardedRef, children, ...restProps } = props;
  const { scrollBehavior } = useDialogRootContext();

  const defaultProps = {
    /**
     * if scrollBehavior is set to "inside", set tabIndex to 0 to allow the body to
     * receive focus, effectively enabling scrolling via keyboard
     * arrow keys.
     */
    tabIndex: scrollBehavior === "inside" ? 0 : undefined,
  };

  return (
    <DialogBodySlot ref={forwardedRef} {...defaultProps} {...restProps}>
      {children}
    </DialogBodySlot>
  );
};

DialogBody.displayName = "Dialog.Body";
