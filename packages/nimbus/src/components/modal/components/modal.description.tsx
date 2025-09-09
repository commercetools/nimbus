import { forwardRef } from "react";
import { Text as RaText } from "react-aria-components";
import { ModalDescriptionSlot } from "../modal.slots";
import type { ModalDescriptionProps } from "../modal.types";

/**
 * # Modal.Description
 *
 * The accessible description element for the modal.
 * Uses React Aria's Text for proper accessibility and screen reader support.
 *
 * @example
 * ```tsx
 * <Modal.Content>
 *   <Modal.Header>
 *     <Modal.Title>Delete Item</Modal.Title>
 *     <Modal.Description>This action cannot be undone.</Modal.Description>
 *   </Modal.Header>
 *   <Modal.Body>...</Modal.Body>
 * </Modal.Content>
 * ```
 */
export const ModalDescription = forwardRef<
  HTMLParagraphElement,
  ModalDescriptionProps
>((props, ref) => {
  const { children, ...restProps } = props;

  return (
    <ModalDescriptionSlot ref={ref} asChild {...restProps}>
      <RaText slot="description">{children}</RaText>
    </ModalDescriptionSlot>
  );
});

ModalDescription.displayName = "Modal.Description";
