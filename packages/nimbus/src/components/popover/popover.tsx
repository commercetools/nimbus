import { PopoverRootSlot } from "./popover.slots";
import type { PopoverRootSlotProps } from "./popover.types";

/**
 * # Popover
 *
 * A component that displays floating content in relation to a trigger element.
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/overlays/popover}
 */
export const Popover = (props: PopoverRootSlotProps) => {
  const { children, ...rest } = props;

  return <PopoverRootSlot {...rest}>{children}</PopoverRootSlot>;
};

Popover.displayName = "Popover";
