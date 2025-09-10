import { useRef } from "react";
import { ModalOverlay as RaModalOverlay } from "react-aria-components";
import { useObjectRef } from "react-aria";
import { mergeRefs } from "@chakra-ui/react";
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
export const DialogBackdrop = (props: DialogBackdropProps) => {
  const { ref: forwardedRef, style, ...restProps } = props;

  // create a local ref (because the consumer may not provide a forwardedRef)
  const localRef = useRef<HTMLDivElement>(null);
  // merge the local ref with a potentially forwarded ref
  const ref = useObjectRef(mergeRefs(localRef, forwardedRef));

  return (
    <DialogBackdropSlot asChild style={style} {...restProps}>
      <RaModalOverlay ref={ref} />
    </DialogBackdropSlot>
  );
};

DialogBackdrop.displayName = "Dialog.Backdrop";
