import { ButtonContext } from "react-aria-components";
import { DialogBodySlot } from "../dialog.slots";
import type { DialogBodyProps } from "../dialog.types";
import { useDialogRootContext } from "./dialog.context";

/**
 * Dialog.Body - The main body content section
 *
 * Clears ButtonContext to prevent slot validation conflicts with nested
 * components that use button slots (e.g., ComboBox).
 *
 * @supportsStyleProps
 */
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
      <ButtonContext.Provider value={null}>{children}</ButtonContext.Provider>
    </DialogBodySlot>
  );
};

DialogBody.displayName = "Dialog.Body";
