import { useRef } from "react";
import { mergeRefs } from "@chakra-ui/react";
import { VisuallyHidden } from "@/components";
import {
  RadioButtonChecked,
  RadioButtonUnchecked,
} from "@commercetools/nimbus-icons";
import { extractStyleProps } from "@/utils/extractStyleProps";
import { useRadioGroupContext } from "./radio-group";

import { useFocusRing, useRadio, useObjectRef, mergeProps } from "react-aria";

import type { RadioInputProps } from "./radio-input.types";
import {
  RadioInputIndicator,
  RadioInputRoot,
  RadioInputLabel,
} from "./radio-input.slots";

/**
 * RadioInput
 * ============================================================
 * displays a RadioInput and an associated label
 *
 * Features:
 *
 * - allows forwarding refs to the underlying DOM element
 * - accepts all native html 'HTMLDivElement' attributes (including aria- & data-attributes)
 * - supports 'variants', 'sizes', etc. configured in the recipe
 * - allows overriding styles by using style-props
 * - supports 'asChild' and 'as' to modify the underlying html-element (polymorphic)
 */
export const RadioInput = (props: RadioInputProps) => {
  const { ref: forwardedRef } = props;
  const localRef = useRef<HTMLInputElement>(null);
  const ref = useObjectRef(mergeRefs(localRef, forwardedRef));

  const [styleProps] = extractStyleProps(props);

  const state = useRadioGroupContext();

  const { inputProps } = useRadio(props, state, ref);

  const { isFocused, focusProps } = useFocusRing();
  const isSelected = !!inputProps.checked;

  const stateProps = {
    "data-disabled": props.isDisabled,
    "data-focus": isFocused || undefined,
    "data-invalid": props.isInvalid,
    "data-selected": isSelected,
  };

  return (
    <RadioInputRoot data-slot="root" {...stateProps} {...styleProps}>
      <RadioInputIndicator data-slot="indicator" {...stateProps}>
        <VisuallyHidden as="span">
          <input {...mergeProps(inputProps, focusProps)} ref={ref} />
        </VisuallyHidden>
        {isSelected ? <RadioButtonChecked /> : <RadioButtonUnchecked />}
      </RadioInputIndicator>
      {props.children && (
        <RadioInputLabel data-slot="label" {...stateProps}>
          {props.children}
        </RadioInputLabel>
      )}
    </RadioInputRoot>
  );
};
RadioInput.displayName = "RadioInput";
