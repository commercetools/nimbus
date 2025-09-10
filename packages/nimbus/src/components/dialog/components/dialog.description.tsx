import { useRef } from "react";
import { Text as RaText } from "react-aria-components";
import { useObjectRef } from "react-aria";
import { mergeRefs } from "@chakra-ui/react";
import { DialogDescriptionSlot } from "../dialog.slots";
import type { DialogDescriptionProps } from "../dialog.types";

/**
 * # Dialog.Description
 *
 * The accessible description element for the dialog.
 * Uses React Aria's Text for proper accessibility and screen reader support.
 *
 * @example
 * ```tsx
 * <Dialog.Content>
 *   <Dialog.Header>
 *     <Dialog.Title>Delete Item</Dialog.Title>
 *     <Dialog.Description>This action cannot be undone.</Dialog.Description>
 *   </Dialog.Header>
 *   <Dialog.Body>...</Dialog.Body>
 * </Dialog.Content>
 * ```
 */
export const DialogDescription = (props: DialogDescriptionProps) => {
  const { ref: forwardedRef, children, ...restProps } = props;

  // create a local ref (because the consumer may not provide a forwardedRef)
  const localRef = useRef<HTMLParagraphElement>(null);
  // merge the local ref with a potentially forwarded ref
  const ref = useObjectRef(mergeRefs(localRef, forwardedRef));

  return (
    <DialogDescriptionSlot asChild {...restProps}>
      <RaText ref={ref} slot="description">
        {children}
      </RaText>
    </DialogDescriptionSlot>
  );
};

DialogDescription.displayName = "Dialog.Description";
