import { forwardRef } from "react";
import { Heading as RaHeading } from "react-aria-components";
import { DialogTitleSlot } from "../dialog.slots";
import type { DialogTitleProps } from "../dialog.types";

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
export const DialogTitle = forwardRef<HTMLHeadingElement, DialogTitleProps>(
  (props, ref) => {
    const { children, ...restProps } = props;

    return (
      <DialogTitleSlot ref={ref} asChild {...restProps}>
        <RaHeading slot="title" level={2}>
          {children}
        </RaHeading>
      </DialogTitleSlot>
    );
  }
);

DialogTitle.displayName = "Dialog.Title";
