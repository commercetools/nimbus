import { forwardRef, useRef } from "react";
import { useToggleState } from "react-stately";
import { Check, Minus } from "@bleh-ui/icons";
import {
  useFocusRing,
  useCheckbox,
  useObjectRef,
  VisuallyHidden,
  mergeProps,
} from "react-aria";
import {
  CheckboxRoot,
  CheckboxLabel,
  CheckboxIndicator,
} from "./checkbox.slots";
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
  (props, forwardedRef) => {
    const state = useToggleState(props);
    const localRef = useRef<HTMLInputElement>(null);

    const ref = useObjectRef(mergeRefs(localRef, forwardedRef));

    const { inputProps } = useCheckbox(props, state, ref);
    const { isFocused, focusProps } = useFocusRing();
    const isIndeterminate = props.isIndeterminate && !state.isSelected;
    const isSelected = state.isSelected && !props.isIndeterminate;

    return (
      <CheckboxRoot>
        <CheckboxIndicator
          data-state-selected={isSelected || undefined}
          data-state-indeterminate={isIndeterminate || undefined}
          data-focus={isFocused || undefined}
        >
          {isSelected && <Check />}
          {isIndeterminate && <Minus />}
          <VisuallyHidden>
            <input {...mergeProps(inputProps, focusProps)} ref={ref} />
          </VisuallyHidden>
        </CheckboxIndicator>

        {props.children && <CheckboxLabel>{props.children}</CheckboxLabel>}
      </CheckboxRoot>
    );
  }
);
Checkbox.displayName = "Checkbox";
