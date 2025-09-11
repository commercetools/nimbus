import { useMemo, useRef } from "react";
import {
  Modal as RaModal,
  ModalOverlay as RaModalOverlay,
  Dialog as RaDialog,
} from "react-aria-components";
import { useObjectRef } from "react-aria";
import { mergeRefs } from "@chakra-ui/react";
import {
  ModalSlot,
  DialogContentSlot,
  DialogBackdropSlot,
} from "../dialog.slots";
import type { DialogContentProps } from "../dialog.types";
import { extractStyleProps } from "@/utils/extractStyleProps";
import { useDialogRootContext } from "./dialog.context";

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
  const { ref: forwardedRef, children, ...restProps } = props;

  // Get recipe configuration from context instead of props
  const {
    useBackdrop,
    backdropProps,
    defaultOpen,
    isDismissable,
    isKeyboardDismissDisabled,
    shouldCloseOnInteractOutside,
    isOpen,
  } = useDialogRootContext();

  // create a local ref (because the consumer may not provide a forwardedRef)
  const localRef = useRef<HTMLDivElement>(null);
  // merge the local ref with a potentially forwarded ref
  const ref = useObjectRef(mergeRefs(localRef, forwardedRef));

  const [styleProps, htmlProps] = extractStyleProps(restProps);

  const Wrapper = useMemo(() => {
    console.log("useBackdrop", useBackdrop);
    console.log("backdropProps", backdropProps);
    if (useBackdrop) {
      return ({ children }: { children: React.ReactNode }) => (
        <DialogBackdropSlot {...backdropProps} asChild>
          <RaModalOverlay>{children}</RaModalOverlay>
        </DialogBackdropSlot>
      );
    }
    return ({ children }) => <>{children}</>;
  }, [useBackdrop, backdropProps]);

  return (
    <Wrapper>
      <ModalSlot asChild>
        <RaModal
          defaultOpen={defaultOpen}
          isDismissable={isDismissable}
          isKeyboardDismissDisabled={isKeyboardDismissDisabled}
          shouldCloseOnInteractOutside={shouldCloseOnInteractOutside}
          isOpen={isOpen}
        >
          <DialogContentSlot asChild {...styleProps}>
            <RaDialog {...htmlProps} ref={ref}>
              {children}
            </RaDialog>
          </DialogContentSlot>
        </RaModal>
      </ModalSlot>
    </Wrapper>
  );
};

DialogContent.displayName = "Dialog.Content";
