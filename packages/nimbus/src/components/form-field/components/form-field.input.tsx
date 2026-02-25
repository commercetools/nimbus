import { useContext, useEffect } from "react";
import { FormFieldContext } from "./form-field.context";
import type { FormFieldInputSlotProps } from "../form-field.types";

/**
 * FormField.Input - The input wrapper element for the form field
 *
 * @supportsStyleProps
 */
export const FormFieldInput = ({
  children,
  ...inputSlotProps
}: FormFieldInputSlotProps) => {
  const { setContext } = useContext(FormFieldContext);

  useEffect(() => {
    setContext((prevContext) => ({
      ...prevContext,
      input: children,
      inputSlotProps,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children, setContext]);

  return null;
};

FormFieldInput.displayName = "FormField.Input";
