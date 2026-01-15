import { PopoverRootSlot } from "./popover.slots";
import type { PopoverProps } from "./popover.types";

/**
 * # Popover
 *
 * A component that displays floating content in relation to a trigger element.
 *
 * Note this component is only used internally.
 */
export const Popover = ({ children, ...props }: PopoverProps) => {
  return <PopoverRootSlot {...props}>{children}</PopoverRootSlot>;
};

Popover.displayName = "Popover";
