import { useContext, useEffect } from "react";
import { FormFieldContext } from "../form-field";
import type { FormFieldInputSlotProps } from "../form-field.slots";

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
