import {
  PopoverRootSlot,
  PopoverContentSlot,
  PopoverCloseSlot,
} from "./popover.slots";
import type { PopoverComponents } from "./popover.types";

export const Popover: PopoverComponents = {
  Root: PopoverRootSlot,
  Content: PopoverContentSlot,
  Close: PopoverCloseSlot,
};
