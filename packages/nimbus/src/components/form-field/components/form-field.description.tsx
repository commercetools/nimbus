import { useContext, useEffect } from "react";
import { FormFieldContext } from "../form-field";
import type { FormFieldDescriptionSlotProps } from "../form-field.slots";

export const FormFieldDescription = ({
  children,
  ...descriptionSlotProps
}: FormFieldDescriptionSlotProps) => {
  const { setContext } = useContext(FormFieldContext);

  useEffect(() => {
    setContext((prevContext) => ({
      ...prevContext,
      description: children,
      descriptionSlotProps,
    }));
  }, [children, setContext]);

  return null;
};
