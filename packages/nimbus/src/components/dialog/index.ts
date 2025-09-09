export { Dialog } from "./dialog";

// Re-export types for external usage
export type * from "./dialog.types";

// Re-export slot types for advanced usage
export type {
  DialogRootSlotProps,
  DialogTriggerSlotProps,
  DialogContentSlotProps,
  DialogBackdropSlotProps,
  DialogHeaderSlotProps,
  DialogBodySlotProps,
  DialogFooterSlotProps,
  DialogTitleSlotProps,
  DialogDescriptionSlotProps,
  DialogCloseTriggerSlotProps,
} from "./dialog.slots";
