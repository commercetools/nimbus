import { PopoverRootSlot } from "./popover.slots";
import type { PopoverBaseProps } from "./popover.types";

/**
 * # PopoverBase
 *
 * A styled wrapper around React Aria's Popover for internal use.
 * For the public compound component API, use Popover.Root/Trigger/Content.
 */
export const PopoverBase = ({ children, ...props }: PopoverBaseProps) => {
  return <PopoverRootSlot {...props}>{children}</PopoverRootSlot>;
};

PopoverBase.displayName = "PopoverBase";
