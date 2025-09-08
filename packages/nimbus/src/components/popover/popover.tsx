import { PopoverRootSlot } from "./popover.slots";
import type { PopoverProps } from "./popover.types";

/**
 * # Popover
 *
 * A component that displays floating content in relation to a trigger element.
 *
 * Note this component is only used internally.
 */
export const Popover = (props: PopoverProps) => {
  const { children, ...rest } = props;

  return <PopoverRootSlot {...rest}>{children}</PopoverRootSlot>;
};

Popover.displayName = "Popover";
