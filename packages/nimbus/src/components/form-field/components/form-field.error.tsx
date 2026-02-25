import { useContext, useEffect } from "react";
import { FormFieldContext } from "./form-field.context";
import type { FormFieldErrorSlotProps } from "../form-field.types";

/**
 * FormField.Error - The error message element for the form field
 *
 * @supportsStyleProps
 */
export const FormFieldError = ({
  children,
  ...errorSlotProps
}: FormFieldErrorSlotProps) => {
  const { setContext } = useContext(FormFieldContext);

  useEffect(() => {
    setContext((prevContext) => ({
      ...prevContext,
      error: children,
      errorSlotProps,
    }));

    // Cleanup: clear error when component unmounts
    return () => {
      setContext((prevContext) => ({
        ...prevContext,
        error: null,
        errorSlotProps: undefined,
      }));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children, setContext]);

  return null;
};

FormFieldError.displayName = "FormField.Error";
