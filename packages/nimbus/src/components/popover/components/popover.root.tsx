import { DialogTrigger } from "react-aria-components";
import type { PopoverRootProps } from "../popover.types";

/**
 * PopoverRoot
 * ============================================================
 * Root component that wraps around a trigger element and popover content.
 * It handles opening and closing the popover when the user interacts with the trigger,
 * and manages the popover positioning relative to the trigger.
 *
 * This acts as the context provider for the compound Popover component.
 */
export function PopoverRoot({ children, ...props }: PopoverRootProps) {
  return <DialogTrigger {...props}>{children}</DialogTrigger>;
}
