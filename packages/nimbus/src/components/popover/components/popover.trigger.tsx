import { forwardRef } from "react";
import { Button } from "react-aria-components";
import type { PopoverTriggerProps } from "../popover.types";

/**
 * PopoverTrigger
 * ============================================================
 * Trigger component that renders the element that opens the popover.
 * Can render as a button by default or pass through a custom element with asChild.
 *
 * Features:
 * - Allows forwarding refs to the underlying DOM element
 * - Supports asChild prop for custom trigger elements
 * - Handles keyboard and mouse interactions to open/close popover
 */
export const PopoverTrigger = forwardRef<
  HTMLButtonElement,
  PopoverTriggerProps
>(({ children, asChild, ...props }, ref) => {
  if (asChild) {
    // When asChild is true, pass through the child element
    return <>{children}</>;
  }

  // Default behavior: render a button
  return (
    <Button ref={ref} {...props}>
      {children}
    </Button>
  );
});

PopoverTrigger.displayName = "PopoverTrigger";
