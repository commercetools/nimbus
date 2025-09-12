import { useRef } from "react";
import { useObjectRef } from "react-aria";
import { mergeRefs } from "@chakra-ui/react";
import { DialogBodySlot } from "../dialog.slots";
import type { DialogBodyProps } from "../dialog.types";
import { useDialogRootContext } from "./dialog.context";

/**
 * # Dialog.Body
 *
 * The main body content section of the dialog.
 * Contains the primary dialog content and handles overflow/scrolling.
 *
 * @example
 * ```tsx
 * <Dialog.Content>
 *   <Dialog.Header>...</Dialog.Header>
 *   <Dialog.Body>
 *     <p>This is the main content of the dialog.</p>
 *   </Dialog.Body>
 *   <Dialog.Footer>...</Dialog.Footer>
 * </Dialog.Content>
 * ```
 */
export const DialogBody = (props: DialogBodyProps) => {
  const { ref: forwardedRef, children, ...restProps } = props;

  // create a local ref (because the consumer may not provide a forwardedRef)
  const localRef = useRef<HTMLDivElement>(null);
  // merge the local ref with a potentially forwarded ref
  const ref = useObjectRef(mergeRefs(localRef, forwardedRef));

  const { scrollBehavior } = useDialogRootContext();

  const defaultProps = {
    /**
     * if scrollBehavior is set to "inside", set tabIndex to 0 to allow the body to
     * receive focus, effectively enabling scrolling via keyboard
     * arrow keys.
     */
    tabIndex: scrollBehavior === "inside" ? 0 : undefined,
  };

  return (
    <DialogBodySlot ref={ref} {...defaultProps} {...restProps}>
      {children}
    </DialogBodySlot>
  );
};

DialogBody.displayName = "Dialog.Body";
