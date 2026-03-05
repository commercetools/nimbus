import { useContext, useEffect } from "react";
import { FormFieldContext } from "./form-field.context";
import type { FormFieldLabelSlotProps } from "../form-field.types";

/**
 * FormField.Label - The label element for the form field
 *
 * @supportsStyleProps
 */
// TODO: should this be wrapped in react-aria's `LabelContext` provider?, e.g. https://react-spectrum.adobe.com/react-aria/TextField.html#custom-children
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children, setContext]);

  return null;
};

FormFieldLabel.displayName = "FormField.Label";
