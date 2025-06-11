import { useRef } from "react";
import { mergeRefs } from "@chakra-ui/react";
import { VisuallyHidden } from "@/components";
import {
  RadioButtonChecked,
  RadioButtonUnchecked,
} from "@commercetools/nimbus-icons";
import { extractStyleProps } from "@/utils/extractStyleProps";
import { useRadioGroupContext } from "./radio-input-group-root";

import { useFocusRing, useRadio, useObjectRef, mergeProps } from "react-aria";

import type { RadioInputGroupOptionProps } from "../radio-input-group.types";
import {
  RadioInputIndicator,
  RadioInputRoot,
  RadioInputLabel,
} from "../radio-input-group.slots";

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
export const RadioInputGroupOption = (props: RadioInputGroupOptionProps) => {
  const { ref: forwardedRef } = props;
  const localRef = useRef<HTMLInputElement>(null);
  const ref = useObjectRef(mergeRefs(localRef, forwardedRef));

  const [styleProps] = extractStyleProps(props);

  const state = useRadioGroupContext();
  if (!state)
    throw new Error(
      "RadioInputGroupOption must be used within a RadioGroupProvider."
    );

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
RadioInputGroupOption.displayName = "RadioInputGroup.Option";
