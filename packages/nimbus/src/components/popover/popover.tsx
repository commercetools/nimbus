import { PopoverTriggerSlot, PopoverContentSlot } from "./popover.slots";

export const Popover = Object.assign(PopoverContentSlot, {
  Trigger: PopoverTriggerSlot,
});
