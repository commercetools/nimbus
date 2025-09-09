import { forwardRef } from "react";
import { DialogBodySlot } from "../dialog.slots";
import type { DialogBodyProps } from "../dialog.types";

/**
 * # Dialog.Body
 *
 * The main body content section of the dialog.
 * Contains the primary dialog content and handles overflow/scrolling.
 *
 * @example
 * ```tsx
 * <Dialog.Content>
 *   <Dialog.Header>...</Dialog.Header>
 *   <Dialog.Body>
 *     <p>This is the main content of the dialog.</p>
 *   </Dialog.Body>
 *   <Dialog.Footer>...</Dialog.Footer>
 * </Dialog.Content>
 * ```
 */
export const DialogBody = forwardRef<HTMLDivElement, DialogBodyProps>(
  (props, ref) => {
    const { children, ...restProps } = props;

    return (
      <DialogBodySlot ref={ref} {...restProps}>
        {children}
      </DialogBodySlot>
    );
  }
);

DialogBody.displayName = "Dialog.Body";
