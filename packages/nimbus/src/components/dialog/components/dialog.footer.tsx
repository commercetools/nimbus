import { forwardRef } from "react";
import { DialogFooterSlot } from "../dialog.slots";
import type { DialogFooterProps } from "../dialog.types";

/**
 * # Dialog.Footer
 *
 * The footer section of the dialog, typically containing action buttons.
 * Provides consistent spacing and alignment for dialog actions.
 *
 * @example
 * ```tsx
 * <Dialog.Content>
 *   <Dialog.Header>...</Dialog.Header>
 *   <Dialog.Body>...</Dialog.Body>
 *   <Dialog.Footer>
 *     <Button variant="outline">Cancel</Button>
 *     <Button>Confirm</Button>
 *   </Dialog.Footer>
 * </Dialog.Content>
 * ```
 */
export const DialogFooter = forwardRef<HTMLElement, DialogFooterProps>(
  (props, ref) => {
    const { children, ...restProps } = props;

    return (
      <DialogFooterSlot ref={ref} {...restProps}>
        {children}
      </DialogFooterSlot>
    );
  }
);

DialogFooter.displayName = "Dialog.Footer";
