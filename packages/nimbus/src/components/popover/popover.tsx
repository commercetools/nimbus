import {
  PopoverRootSlot,
  PopoverTriggerSlot,
  PopoverContentSlot,
  PopoverDialogSlot,
  PopoverCloseSlot,
} from "./popover.slots";
import type { PopoverComponents } from "./popover.types";

/**
 * Popover
 * ============================================================
 * An overlay element positioned relative to a trigger.
 *
 * @example
 * <Popover.Root>
 *  <Popover.Trigger>Open</Popover.Trigger>
 *  <Popover.Content>
 *    <Popover.Dialog>
 *      <p>This is a popover component built with React Aria.</p>
 *      <Popover.Close>Close</Popover.Close>
 *    </Popover.Dialog>
 *  </Popover.Content>
 * </Popover.Root>
 */
export const Popover: PopoverComponents = {
  Root: PopoverRootSlot,
  Trigger: PopoverTriggerSlot,
  Content: PopoverContentSlot,
  Dialog: PopoverDialogSlot,
  Close: PopoverCloseSlot,
};
