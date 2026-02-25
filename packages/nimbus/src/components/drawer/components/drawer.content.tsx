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
import { extractStyleProps } from "@/utils";
import { useDrawerRootContext } from "./drawer.context";

/**
 * Drawer.Content - The main drawer content container
 *
 * @supportsStyleProps
 */
export const DrawerContent = (props: DrawerContentProps) => {
  const { ref: forwardedRef, children, ...restProps } = props;

  // Get configuration from context
  const {
    hasDrawerTrigger,
    isDismissable = true, // Default to true so clicking outside closes the drawer
    isKeyboardDismissDisabled,
    shouldCloseOnInteractOutside,
    shouldDelayOnClose = false,
    isOpen,
    onOpenChange,
    defaultOpen,
  } = useDrawerRootContext();

  // When shouldDelayOnClose is true, disable backdrop dismissal to prevent
  // accidental close. Escape key and close buttons still fire onOpenChange(false),
  // allowing the consumer to show confirmation before closing.
  const effectiveIsDismissable = shouldDelayOnClose ? false : isDismissable;

  // When there's a Drawer.Trigger, DialogTrigger manages state via React Context
  // When there's NO Drawer.Trigger, ModalOverlay must manage its own state
  const modalProps = hasDrawerTrigger
    ? {
        // With trigger: Only pass dismissal props, state is managed by DialogTrigger
        isDismissable: effectiveIsDismissable,
        isKeyboardDismissDisabled,
        shouldCloseOnInteractOutside,
      }
    : {
        // Without trigger: Pass state management props to ModalOverlay
        isDismissable: effectiveIsDismissable,
        isKeyboardDismissDisabled,
        shouldCloseOnInteractOutside,
        isOpen,
        onOpenChange,
        defaultOpen,
      };

  const [styleProps, functionalProps] = extractStyleProps(restProps);

  return (
    <DrawerModalOverlaySlot asChild>
      <RaModalOverlay {...modalProps}>
        <DrawerModalSlot asChild>
          <RaModal>
            <DrawerContentSlot asChild {...styleProps}>
              <RaDialog ref={forwardedRef} {...functionalProps}>
                {children}
              </RaDialog>
            </DrawerContentSlot>
          </RaModal>
        </DrawerModalSlot>
      </RaModalOverlay>
    </DrawerModalOverlaySlot>
  );
};

DrawerContent.displayName = "Drawer.Content";
