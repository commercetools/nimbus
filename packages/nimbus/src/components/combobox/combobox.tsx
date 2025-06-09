import { forwardRef } from "react";
import { ComboboxRoot } from "./combobox.slots";
import type { ComboboxProps } from "./combobox.types";

/**
 * Combobox
 * ============================================================
 * A combo box combines a text input with a listbox, allowing users to filter a list of options to items matching a query.
 *
 * Features:
 *
 * - allows forwarding refs to the underlying DOM element
 * - accepts all native html 'HTMLDivElement' attributes (including aria- & data-attributes)
 * - supports 'variants', 'sizes', etc. configured in the recipe
 * - allows overriding styles by using style-props
 * - supports 'asChild' and 'as' to modify the underlying html-element (polymorphic)
 */
export const Combobox = forwardRef<HTMLDivElement, ComboboxProps>(
({children, ...props}, ref) => {
    return (
     <ComboboxRoot ref={ref} {...props}>{children}</ComboboxRoot>
    )
 }
);
Combobox.displayName = "Combobox";
