import { useContext, useEffect } from "react";
import { FormFieldContext } from "./form-field.context";
import type { FormFieldDescriptionSlotProps } from "../form-field.types";

/**
 * FormField.Description - The description element for the form field
 *
 * @supportsStyleProps
 */
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

    // Cleanup: clear description when component unmounts
    return () => {
      setContext((prevContext) => ({
        ...prevContext,
        description: null,
        descriptionSlotProps: undefined,
      }));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children, setContext]);

  return null;
};

FormFieldDescription.displayName = "FormField.Description";
