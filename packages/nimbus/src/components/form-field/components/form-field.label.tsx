import { useContext, useEffect } from "react";
import { FormFieldContext } from "./form-field.context";
import type { FormFieldLabelSlotProps } from "../form-field.slots";

export const FormFieldLabel = ({
  children,
  ...labelSlotProps
}: FormFieldLabelSlotProps) => {
  const { setContext } = useContext(FormFieldContext);

  useEffect(() => {
    setContext((prevContext) => ({
      ...prevContext,
      label: children,
      labelSlotProps,
    }));
  }, [children, setContext]);

  return null;
};
