import { forwardRef, useRef } from "react";
import { useToggleState } from "react-stately";
import { useCheckbox, useObjectRef } from "react-aria";
import { CheckboxRoot, CheckboxControl, CheckboxLabel } from "./checkbox.slots";
import { mergeRefs } from "@chakra-ui/react";
import type { CheckboxProps } from "./checkbox.types";

/**
 * Checkbox
 * ============================================================
 * displays a checkbox and an associated label
 *
 * Features:
 *
 * - allows forwarding refs to the underlying DOM element
 * - accepts all native html 'HTMLDivElement' attributes (including aria- & data-attributes)
 * - supports 'variants', 'sizes', etc. configured in the recipe
 * - allows overriding styles by using style-props
 * - supports 'asChild' and 'as' to modify the underlying html-element (polymorphic)
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ children, ...props }, forwardedRef) => {
    const state = useToggleState(props);
    const localRef = useRef<HTMLInputElement>(null);

    const ref = useObjectRef(mergeRefs(localRef, forwardedRef));

    const { inputProps } = useCheckbox(props, state, ref);

    return (
      <CheckboxRoot>
        <CheckboxControl ref={ref} type="checkbox" {...inputProps} />
        {children && <CheckboxLabel>{children}</CheckboxLabel>}
      </CheckboxRoot>
    );
  }
);
Checkbox.displayName = "Checkbox";
