import { useContext, useEffect } from "react";
import { FormFieldContext } from "./form-field.context";
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

    // Cleanup: clear error when component unmounts
    return () => {
      setContext((prevContext) => ({
        ...prevContext,
        error: null,
        errorSlotProps: undefined,
      }));
    };
  }, [children, setContext]);

  return null;
};
