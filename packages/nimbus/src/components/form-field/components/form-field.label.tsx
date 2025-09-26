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

    // Cleanup: clear label when component unmounts
    return () => {
      setContext((prevContext) => ({
        ...prevContext,
        label: null,
        labelSlotProps: undefined,
      }));
    };
  }, [children, setContext]);

  return null;
};
