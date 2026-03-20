import { Check, Remove as Minus } from "@commercetools/nimbus-icons";
import { extractStyleProps } from "@/utils";
import type { CheckboxProps } from "./checkbox.types";
import type { CheckboxRenderProps } from "react-aria-components";
import {
  CheckboxIndicator,
  CheckboxRoot,
  CheckboxLabel,
} from "./checkbox.slots";

/**
 * # Checkbox
 *
 * Displays a checkbox.
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/inputs/checkbox}
 */
export const Checkbox = (props: CheckboxProps) => {
  const { ref: forwardedRef, children, ...restProps } = props;

  // Separate style props from functional props.
  // CheckboxRoot (via withProvider) handles recipe/variant splitting internally.
  const [styleProps, functionalProps] = extractStyleProps(restProps);

  return (
    <CheckboxRoot
      ref={forwardedRef}
      data-slot="root"
      {...functionalProps}
      {...styleProps}
    >
      {({
        isSelected,
        isIndeterminate,
        isInvalid,
        isDisabled,
        isFocused,
      }: CheckboxRenderProps) => {
        const stateProps = {
          "data-selected": isSelected,
          "data-indeterminate": isIndeterminate,
          "data-invalid": isInvalid,
          "data-disabled": isDisabled,
          "data-focus": isFocused || undefined,
        };

        return (
          <>
            <CheckboxIndicator data-slot="indicator" {...stateProps}>
              {isSelected && <Check />}
              {isIndeterminate && <Minus />}
            </CheckboxIndicator>

            {children && (
              <CheckboxLabel data-slot="label" {...stateProps}>
                {children}
              </CheckboxLabel>
            )}
          </>
        );
      }}
    </CheckboxRoot>
  );
};
Checkbox.displayName = "Checkbox";
