import {
  Modal as RaModal,
  ModalOverlay as RaModalOverlay,
  Dialog as RaDialog,
} from "react-aria-components";
import {
  DrawerModalOverlaySlot,
  DrawerModalSlot,
  DrawerContentSlot,
} from "../drawer.slots";
import type { DrawerContentProps } from "../drawer.types";
import { extractStyleProps } from "@/utils/extractStyleProps";
import { useDrawerRootContext } from "./drawer.context";

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

  const [styleProps] = extractStyleProps(restProps);

  return (
    <DrawerModalOverlaySlot asChild>
      <RaModalOverlay {...modalProps}>
        <DrawerModalSlot asChild>
          <RaModal>
            <DrawerContentSlot asChild {...styleProps}>
              <RaDialog ref={forwardedRef}>{children}</RaDialog>
            </DrawerContentSlot>
          </RaModal>
        </DrawerModalSlot>
      </RaModalOverlay>
    </DrawerModalOverlaySlot>
  );
};

DrawerContent.displayName = "Drawer.Content";
