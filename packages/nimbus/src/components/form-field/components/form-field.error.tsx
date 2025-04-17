import { useContext, useEffect } from "react";
import { FormFieldContext } from "../form-field";
import type { FormFieldErrorSlotProps } from "../form-field.slots";

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
  }, [children, setContext]);

  return null;
};
