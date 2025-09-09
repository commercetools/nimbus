import { forwardRef } from "react";
import { ModalOverlay as RaModalOverlay } from "react-aria-components";
import { DialogBackdropSlot } from "../dialog.slots";
import type { DialogBackdropProps } from "../dialog.types";

/**
 * # Dialog.Backdrop
 *
 * The backdrop overlay that appears behind the dialog content.
 * Provides a semi-transparent overlay and handles click-outside-to-close behavior.
 *
 * @example
 * ```tsx
 * <Dialog.Root>
 *   <Dialog.Trigger>Open Dialog</Dialog.Trigger>
 *   <Dialog.Content>
 *     <Dialog.Backdrop />
 *     <Dialog.Header>...</Dialog.Header>
 *   </Dialog.Content>
 * </Dialog.Root>
 * ```
 */
export const DialogBackdrop = forwardRef<HTMLDivElement, DialogBackdropProps>(
  (props, ref) => {
    const { style, ...restProps } = props;

    return (
      <DialogBackdropSlot ref={ref} asChild style={style} {...restProps}>
        <RaModalOverlay />
      </DialogBackdropSlot>
    );
  }
);

DialogBackdrop.displayName = "Dialog.Backdrop";
