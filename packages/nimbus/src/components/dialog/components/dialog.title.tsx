import { DialogTitleSlot } from "../dialog.slots";
import type { DialogTitleProps } from "../dialog.types";
import { Heading } from "@/components";
/**
 * # Dialog.Title
 *
 * The accessible title element for the dialog.
 * Uses React Aria's Heading for proper accessibility and screen reader support.
 *
 * @example
 * ```tsx
 * <Dialog.Content>
 *   <Dialog.Header>
 *     <Dialog.Title>Confirm Action</Dialog.Title>
 *   </Dialog.Header>
 *   <Dialog.Body>...</Dialog.Body>
 * </Dialog.Content>
 * ```
 */
export const DialogTitle = (props: DialogTitleProps) => {
  const { ref: forwardedRef, children, ...restProps } = props;

  return (
    <DialogTitleSlot asChild {...restProps}>
      <Heading ref={forwardedRef} slot="title" as="h2" textStyle="lg">
        {children}
      </Heading>
    </DialogTitleSlot>
  );
};

DialogTitle.displayName = "Dialog.Title";
