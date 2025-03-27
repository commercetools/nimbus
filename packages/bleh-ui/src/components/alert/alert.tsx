import { forwardRef } from "react";
import { AlertRoot } from "./alert.slots";
import type { AlertProps } from "./alert.types";

/**
 * Alert
 * ============================================================
 * Provides feedback to the user about the status of an action or system event
 *
 * Features:
 *
 * - allows forwarding refs to the underlying DOM element
 * - accepts all native html 'HTMLDivElement' attributes (including aria- & data-attributes)
 * - supports 'variants', 'sizes', etc. configured in the recipe
 * - allows overriding styles by using style-props
 * - supports 'asChild' and 'as' to modify the underlying html-element (polymorphic)
 */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ children, ...props }, ref) => {
    return (
      <AlertRoot ref={ref} {...props}>
        {children}
      </AlertRoot>
    );
  }
);
Alert.displayName = "Alert";
