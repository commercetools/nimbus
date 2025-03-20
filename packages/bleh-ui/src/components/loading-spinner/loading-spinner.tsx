import { forwardRef } from "react";
import { LoadingSpinnerRoot } from "./loading-spinner.slots";
import type { LoadingSpinnerProps } from "./loading-spinner.types"

/**
 * LoadingSpinner
 * ============================================================
 * Indicates ongoing processes or loading states
 * 
 * Features:
 *
 * - allows forwarding refs to the underlying DOM element
 * - accepts all native html 'HTMLDivElement' attributes (including aria- & data-attributes)
 * - supports 'variants', 'sizes', etc. configured in the recipe
 * - allows overriding styles by using style-props
 * - supports 'asChild' and 'as' to modify the underlying html-element (polymorphic)
 */
export const LoadingSpinner = forwardRef<HTMLDivElement, LoadingSpinnerProps>(
({children, ...props}, ref) => {
    return (
     <LoadingSpinnerRoot ref={ref} {...props}>{children}</LoadingSpinnerRoot>
    )
 }
);
LoadingSpinner.displayName = "LoadingSpinner";