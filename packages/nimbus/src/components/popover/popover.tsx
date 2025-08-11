import {
  PopoverRootSlot,
  PopoverContentSlot,
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
 *  <Popover.Content>
 *      <p>This is a popover component built with React Aria.</p>
 *      <Popover.Close>Close</Popover.Close>
 *  </Popover.Content>
 * </Popover.Root>
 */
export const Popover: PopoverComponents = {
  Root: PopoverRootSlot,
  Content: PopoverContentSlot,
  Close: PopoverCloseSlot,
};
