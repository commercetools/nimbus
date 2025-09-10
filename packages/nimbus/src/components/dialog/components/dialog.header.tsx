import { useRef } from "react";
import { useObjectRef } from "react-aria";
import { mergeRefs } from "@chakra-ui/react";
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

  // create a local ref (because the consumer may not provide a forwardedRef)
  const localRef = useRef<HTMLElement>(null);
  // merge the local ref with a potentially forwarded ref
  const ref = useObjectRef(mergeRefs(localRef, forwardedRef));

  return (
    <DialogHeaderSlot ref={ref} {...restProps}>
      {children}
    </DialogHeaderSlot>
  );
};

DialogHeader.displayName = "Dialog.Header";
