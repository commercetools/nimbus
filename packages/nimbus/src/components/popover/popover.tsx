import { PopoverTriggerSlot, PopoverContentSlot } from "./popover.slots";
import type { PopoverComponents } from "./popover.types";

export const Popover: PopoverComponents = {
  Trigger: PopoverTriggerSlot,
  Content: PopoverContentSlot,
};
