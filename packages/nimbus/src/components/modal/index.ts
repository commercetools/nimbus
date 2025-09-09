export { Modal } from "./modal";

// Re-export types for external usage
export type * from "./modal.types";

// Re-export slot types for advanced usage
export type {
  ModalRootSlotProps,
  ModalTriggerSlotProps,
  ModalContentSlotProps,
  ModalBackdropSlotProps,
  ModalHeaderSlotProps,
  ModalBodySlotProps,
  ModalFooterSlotProps,
  ModalTitleSlotProps,
  ModalDescriptionSlotProps,
  ModalCloseTriggerSlotProps,
} from "./modal.slots";
