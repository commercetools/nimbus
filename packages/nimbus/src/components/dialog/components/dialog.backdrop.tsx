import { useEffect } from "react";
import type { DialogBackdropProps } from "../dialog.types";

import { useDialogRootContext } from "./dialog.context";
import type { DialogBackdropSlotProps } from "..";

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
 *   <Dialog.Backdrop />
 *   <Dialog.Content>
 *     <Dialog.Header>...</Dialog.Header>
 *   </Dialog.Content>
 * </Dialog.Root>
 * ```
 */
export const DialogBackdrop = (props: DialogBackdropSlotProps) => {
  const { setUseBackdrop, setBackdropProps } = useDialogRootContext();

  useEffect(() => {
    setUseBackdrop(true);
    setBackdropProps(props);

    return () => {
      setUseBackdrop(false);
      setBackdropProps(null);
    };
  }, [props]);

  return null;
};

DialogBackdrop.displayName = "Dialog.Backdrop";
