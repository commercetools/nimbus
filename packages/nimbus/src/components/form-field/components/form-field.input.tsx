import { useContext, useEffect } from "react";
import { FormFieldContext } from "./form-field.context";
import type { FormFieldInputSlotProps } from "../form-field.types";

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
  }, [children, setContext]);

  return null;
};
