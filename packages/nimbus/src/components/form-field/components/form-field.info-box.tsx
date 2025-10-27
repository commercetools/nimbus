import { useContext, useEffect, type ReactNode } from "react";
import { FormFieldContext } from "./form-field.context";

type FormFieldInfoBoxProps = {
  /**
   * The content to display in the InfoBox
   */
  children: ReactNode;
};

/**
 * FormField.InfoBox - The info box popover content for the form field
 *
 * @supportsStyleProps
 */
export const FormFieldInfoBox = ({ children }: FormFieldInfoBoxProps) => {
  const { setContext } = useContext(FormFieldContext);

  useEffect(() => {
    setContext((prevContext) => ({
      ...prevContext,
      info: children,
    }));

    // Cleanup: clear info when component unmounts
    return () => {
      setContext((prevContext) => ({
        ...prevContext,
        info: null,
      }));
    };
  }, [children, setContext]);

  return null;
};

FormFieldInfoBox.displayName = "FormField.InfoBox";
