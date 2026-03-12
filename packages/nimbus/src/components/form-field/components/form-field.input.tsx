import { Children, cloneElement, isValidElement, useContext } from "react";
import { FormFieldContext } from "./form-field.context";
import type { FormFieldInputSlotProps } from "../form-field.types";
import { FormFieldInputSlot } from "../form-field.slots";

/**
 * FormField.Input - The input wrapper element for the form field
 *
 * Renders children directly (with injected field props) to avoid
 * the state-based indirection that causes cursor position issues
 * on controlled inputs.
 *
 * @supportsStyleProps
 */
export const FormFieldInput = ({
  children,
  ...inputSlotProps
}: FormFieldInputSlotProps) => {
  const { inputProps } = useContext(FormFieldContext);

  return (
    <FormFieldInputSlot {...inputSlotProps}>
      {Children.map(children, (child) => {
        if (isValidElement(child)) {
          return cloneElement(child, inputProps);
        }
        return child;
      })}
    </FormFieldInputSlot>
  );
};

FormFieldInput.displayName = "FormField.Input";
