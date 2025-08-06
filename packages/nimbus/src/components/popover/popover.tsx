import { forwardRef } from "react";
import { PopoverRoot } from "./popover.slots";
import type { PopoverProps } from "./popover.types";

/**
 * Popover
 * ============================================================
 * An overlay element positioned relative to a trigger.
 *
 * Features:
 *
 * - allows forwarding refs to the underlying DOM element
 * - accepts all native html 'HTMLDivElement' attributes (including aria- & data-attributes)
 * - allows overriding styles by using style-props
 */
export const Popover = forwardRef<HTMLDivElement, PopoverProps>(
({children, ...props}, ref) => {
    return (
     <PopoverRoot ref={ref} {...props}>{children}</PopoverRoot>
    )
 }
);
Popover.displayName = "Popover";
