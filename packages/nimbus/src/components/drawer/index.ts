export * from "./drawer";

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
