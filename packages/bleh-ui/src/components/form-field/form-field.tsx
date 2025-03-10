import { forwardRef } from "react";
import { FormFieldRoot } from "./form-field.slots";
import type { FormFieldProps } from "./form-field.types"

/**
 * FormField
 * ============================================================
 * displays inputs in a FormField context
 * 
 * Features:
 *
 * - allows forwarding refs to the underlying DOM element
 * - accepts all native html 'HTMLDivElement' attributes (including aria- & data-attributes)
 * - supports 'variants', 'sizes', etc. configured in the recipe
 * - allows overriding styles by using style-props
 * - supports 'asChild' and 'as' to modify the underlying html-element (polymorphic)
 */
export const FormField = forwardRef<HTMLDivElement, FormFieldProps>(
({children, ...props}, ref) => {
    return (
     <FormFieldRoot ref={ref} {...props}>{children}</FormFieldRoot>
    )
 }
);
FormField.displayName = "FormField";