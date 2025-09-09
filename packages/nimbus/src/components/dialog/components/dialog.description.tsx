import { forwardRef } from "react";
import { Text as RaText } from "react-aria-components";
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
export const DialogDescription = forwardRef<
  HTMLParagraphElement,
  DialogDescriptionProps
>((props, ref) => {
  const { children, ...restProps } = props;

  return (
    <DialogDescriptionSlot ref={ref} asChild {...restProps}>
      <RaText slot="description">{children}</RaText>
    </DialogDescriptionSlot>
  );
});

DialogDescription.displayName = "Dialog.Description";
