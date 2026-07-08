export {
  Drawer,
  _DrawerRoot,
  _DrawerTrigger,
  _DrawerContent,
  _DrawerHeader,
  _DrawerBody,
  _DrawerFooter,
  _DrawerTitle,
  _DrawerCloseTrigger,
} from "./drawer";

// Re-export types for external usage
export type * from "./drawer.types";

// Re-export slot types for advanced usage
export type {
  DrawerRootSlotProps,
  DrawerTriggerSlotProps,
  DrawerContentSlotProps,
  DrawerModalOverlaySlotProps as DrawerBackdropSlotProps,
  DrawerHeaderSlotProps,
  DrawerBodySlotProps,
  DrawerFooterSlotProps,
  DrawerTitleSlotProps,
  DrawerCloseTriggerSlotProps,
} from "./drawer.slots";
