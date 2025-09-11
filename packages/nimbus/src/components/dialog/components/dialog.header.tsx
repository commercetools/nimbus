import { DialogHeaderSlot } from "../dialog.slots";
import type { DialogHeaderProps } from "../dialog.types";

/**
 * # Dialog.Header
 *
 * The header section of the dialog content.
 * Typically contains the title and close button.
 *
 * @example
 * ```tsx
 * <Dialog.Content>
 *   <Dialog.Header>
 *     <Dialog.Title>Dialog Title</Dialog.Title>
 *     <Dialog.CloseTrigger />
 *   </Dialog.Header>
 *   <Dialog.Body>...</Dialog.Body>
 * </Dialog.Content>
 * ```
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
