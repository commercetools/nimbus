import { useRef } from "react";
import { Modal as RaModal, Dialog as RaDialog } from "react-aria-components";
import { useObjectRef } from "react-aria";
import { mergeRefs } from "@chakra-ui/react";
import { DialogPositionerSlot, DialogContentSlot } from "../dialog.slots";
import type { DialogContentProps } from "../dialog.types";
import { extractStyleProps } from "@/utils/extractStyleProps";
import { useDialogContext } from "./dialog.context";

/**
 * # Dialog.Content
 *
 * The main dialog content container that wraps React Aria's Modal and Dialog.
 * Handles portalling, backdrop, positioning, and content styling.
 *
 * This component creates the dialog overlay, positions the content, and provides
 * accessibility features like focus management and keyboard dismissal.
 *
 * @example
 * ```tsx
 * <Dialog.Root>
 *   <Dialog.Trigger>Open Dialog</Dialog.Trigger>
 *   <Dialog.Content size="md" placement="center">
 *     <Dialog.Header>
 *       <Dialog.Title>Title</Dialog.Title>
 *     </Dialog.Header>
 *     <Dialog.Body>Content</Dialog.Body>
 *     <Dialog.Footer>Actions</Dialog.Footer>
 *   </Dialog.Content>
 * </Dialog.Root>
 * ```
 */
export const DialogContent = (props: DialogContentProps) => {
  const {
    ref: forwardedRef,
    children,
    // TODO: Implement portal support
    // isPortalled = true,
    // portalContainer,
    // TODO: Implement backdrop control
    // hasBackdrop = true,
    isDismissable = true,
    isKeyboardDismissDisabled = false,
    // TODO: Implement onClose callback
    // onClose,
    ...restProps
  } = props;

  // Get recipe configuration from context instead of props
  const contextRecipeProps = useDialogContext();

  // create a local ref (because the consumer may not provide a forwardedRef)
  const localRef = useRef<HTMLDivElement>(null);
  // merge the local ref with a potentially forwarded ref
  const ref = useObjectRef(mergeRefs(localRef, forwardedRef));

  const [styleProps, htmlProps] = extractStyleProps(restProps);

  return (
    <RaModal
      isDismissable={isDismissable}
      isKeyboardDismissDisabled={isKeyboardDismissDisabled}
    >
      <DialogPositionerSlot {...contextRecipeProps} {...styleProps}>
        <DialogContentSlot asChild {...htmlProps}>
          <RaDialog ref={ref}>{children}</RaDialog>
        </DialogContentSlot>
      </DialogPositionerSlot>
    </RaModal>
  );
};

DialogContent.displayName = "Dialog.Content";
