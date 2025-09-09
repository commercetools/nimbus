import { forwardRef, useMemo } from "react";
import { Modal as RaModal, Dialog as RaDialog } from "react-aria-components";
import { DrawerPositionerSlot, DrawerContentSlot } from "../drawer.slots";
import type {
  DrawerContentProps,
  DrawerSide,
  DrawerPlacement,
  DrawerMotionPreset,
} from "../drawer.types";

/**
 * # Drawer.Content
 *
 * The main drawer content container that wraps React Aria's Modal and Dialog.
 * Handles portalling, backdrop, edge positioning, and content styling.
 *
 * The `side` prop automatically determines placement and animation:
 * - side="left" → placement="left", motionPreset="slide-in-left"
 * - side="right" → placement="right", motionPreset="slide-in-right"
 * - side="top" → placement="top", motionPreset="slide-in-top"
 * - side="bottom" → placement="bottom", motionPreset="slide-in-bottom"
 *
 * @example
 * ```tsx
 * <Drawer.Root>
 *   <Drawer.Trigger>Open Drawer</Drawer.Trigger>
 *   <Drawer.Content side="left" size="md">
 *     <Drawer.Backdrop />
 *     <Drawer.Header>
 *       <Drawer.Title>Navigation</Drawer.Title>
 *       <Drawer.CloseTrigger>×</Drawer.CloseTrigger>
 *     </Drawer.Header>
 *     <Drawer.Body>Content</Drawer.Body>
 *     <Drawer.Footer>Actions</Drawer.Footer>
 *   </Drawer.Content>
 * </Drawer.Root>
 * ```
 */
export const DrawerContent = forwardRef<HTMLDivElement, DrawerContentProps>(
  (props, ref) => {
    const {
      children,
      side = "left",
      isPortalled = true,
      portalContainer,
      hasBackdrop = true,
      isDismissable = true,
      isKeyboardDismissDisabled = false,
      isSwipeDisabled = false,
      onClose,
      size,
      scrollBehavior,
      motionPreset: explicitMotionPreset,
      ...restProps
    } = props;

    // Automatically map side to placement and motionPreset
    const { placement, motionPreset } = useMemo(() => {
      const mappings: Record<
        DrawerSide,
        { placement: DrawerPlacement; motionPreset: DrawerMotionPreset }
      > = {
        left: { placement: "left", motionPreset: "slide-in-left" },
        right: { placement: "right", motionPreset: "slide-in-right" },
        top: { placement: "top", motionPreset: "slide-in-top" },
        bottom: { placement: "bottom", motionPreset: "slide-in-bottom" },
      };

      return {
        placement: mappings[side].placement,
        motionPreset: explicitMotionPreset || mappings[side].motionPreset,
      };
    }, [side, explicitMotionPreset]);

    return (
      <RaModal
        isDismissable={isDismissable}
        isKeyboardDismissDisabled={isKeyboardDismissDisabled}
      >
        <DrawerPositionerSlot
          side={side}
          size={size}
          motionPreset={motionPreset}
        >
          <DrawerContentSlot
            ref={ref}
            asChild
            side={side}
            size={size}
            motionPreset={motionPreset}
            {...restProps}
          >
            <RaDialog onClose={onClose}>{children}</RaDialog>
          </DrawerContentSlot>
        </DrawerPositionerSlot>
      </RaModal>
    );
  }
);

DrawerContent.displayName = "Drawer.Content";
