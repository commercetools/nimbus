import { useRef } from "react";
import { Heading as RaHeading } from "react-aria-components";
import { useObjectRef } from "react-aria";
import { mergeRefs } from "@chakra-ui/react";
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
export const DialogTitle = (props: DialogTitleProps) => {
  const { ref: forwardedRef, children, ...restProps } = props;

  // create a local ref (because the consumer may not provide a forwardedRef)
  const localRef = useRef<HTMLHeadingElement>(null);
  // merge the local ref with a potentially forwarded ref
  const ref = useObjectRef(mergeRefs(localRef, forwardedRef));

  return (
    <DialogTitleSlot asChild {...restProps}>
      <RaHeading ref={ref} slot="title" level={2}>
        {children}
      </RaHeading>
    </DialogTitleSlot>
  );
};

DialogTitle.displayName = "Dialog.Title";
