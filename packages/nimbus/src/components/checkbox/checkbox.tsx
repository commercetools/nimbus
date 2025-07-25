import { useRef } from "react";
import { useToggleState } from "react-stately";
import { useSlotRecipe } from "@chakra-ui/react";
import { VisuallyHidden } from "@/components";
import { Check, Remove as Minus } from "@commercetools/nimbus-icons";
import { extractStyleProps } from "@/utils/extractStyleProps";

import {
  useFocusRing,
  useCheckbox,
  useObjectRef,
  mergeProps,
} from "react-aria";

import { mergeRefs } from "@chakra-ui/react";
import type { CheckboxProps } from "./checkbox.types";
import {
  CheckboxIndicator,
  CheckboxRoot,
  CheckboxLabel,
} from "./checkbox.slots";

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
export const Checkbox = (props: CheckboxProps) => {
  const { ref: forwardedRef } = props;
  const localRef = useRef<HTMLInputElement>(null);
  const ref = useObjectRef(mergeRefs(localRef, forwardedRef));

  const recipe = useSlotRecipe({ key: "checkbox" });
  const [recipeProps] = recipe.splitVariantProps(props);

  const [styleProps] = extractStyleProps(props);

  const state = useToggleState(props);
  const { inputProps } = useCheckbox(props, state, ref);

  const { isFocused, focusProps } = useFocusRing();
  const isSelected = state.isSelected && !props.isIndeterminate;
  const isIndeterminate = props.isIndeterminate;

  const stateProps = {
    "data-selected": isSelected,
    "data-indeterminate": isIndeterminate,
    "data-invalid": props.isInvalid,
    "data-disabled": props.isDisabled,
    "data-focus": isFocused || undefined,
  };

  return (
    <CheckboxRoot
      data-slot="root"
      {...recipeProps}
      {...stateProps}
      {...styleProps}
    >
      <CheckboxIndicator data-slot="indicator" {...stateProps}>
        {isSelected && <Check />}
        {isIndeterminate && <Minus />}
        <VisuallyHidden as="span">
          <input {...mergeProps(inputProps, focusProps)} ref={ref} />
        </VisuallyHidden>
      </CheckboxIndicator>

      {props.children && (
        <CheckboxLabel data-slot="label" {...stateProps}>
          {props.children}
        </CheckboxLabel>
      )}
    </CheckboxRoot>
  );
};
Checkbox.displayName = "Checkbox";
