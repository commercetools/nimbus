import { useRef } from "react";
import {
  Modal as RaModal,
  ModalOverlay as RaModalOverlay,
  Dialog as RaDialog,
} from "react-aria-components";
import { useObjectRef } from "react-aria";
import { mergeRefs } from "@chakra-ui/react";
import {
  DrawerModalOverlaySlot,
  DrawerModalSlot,
  DrawerContentSlot,
} from "../drawer.slots";
import type { DrawerContentProps } from "../drawer.types";
import { extractStyleProps } from "@/utils/extractStyleProps";
import { useDrawerRootContext } from "./drawer.context";

/**
 * # Drawer.Content
 *
 * The main drawer content container that wraps React Aria's Modal and Dialog.
 * Handles portalling, backdrop, positioning, and content styling.
 *
 * This component creates the drawer overlay, positions the content, and provides
 * accessibility features like focus management and keyboard dismissal.
 *
 * @example
 * ```tsx
 * <Drawer.Root>
 *   <Drawer.Trigger>Open Drawer</Drawer.Trigger>
 *   <Drawer.Content size="md" placement="center">
 *     <Drawer.Header>
 *       <Drawer.Title>Title</Drawer.Title>
 *     </Drawer.Header>
 *     <Drawer.Body>Content</Drawer.Body>
 *     <Drawer.Footer>Actions</Drawer.Footer>
 *   </Drawer.Content>
 * </Drawer.Root>
 * ```
 */
export const DrawerContent = (props: DrawerContentProps) => {
  const { ref: forwardedRef, children, ...restProps } = props;

  // Get recipe configuration from context instead of props
  const {
    defaultOpen,
    isDismissable,
    isKeyboardDismissDisabled,
    shouldCloseOnInteractOutside,
    isOpen,
    onOpenChange,
  } = useDrawerRootContext();

  const modalProps = {
    defaultOpen,
    isDismissable,
    isKeyboardDismissDisabled,
    shouldCloseOnInteractOutside,
    isOpen,
    onOpenChange,
  };

  // create a local ref (because the consumer may not provide a forwardedRef)
  const localRef = useRef<HTMLDivElement>(null);
  // merge the local ref with a potentially forwarded ref
  const ref = useObjectRef(mergeRefs(localRef, forwardedRef));

  const [styleProps] = extractStyleProps(restProps);

  return (
    <DrawerModalOverlaySlot asChild>
      <RaModalOverlay {...modalProps}>
        <DrawerModalSlot asChild>
          <RaModal>
            <DrawerContentSlot asChild {...styleProps}>
              <RaDialog ref={ref}>{children}</RaDialog>
            </DrawerContentSlot>
          </RaModal>
        </DrawerModalSlot>
      </RaModalOverlay>
    </DrawerModalOverlaySlot>
  );
};

DrawerContent.displayName = "Drawer.Content";
