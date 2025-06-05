import { useContext, useEffect, type ReactNode } from "react";
import { FormFieldContext } from "./form-field.context";

type FormFieldInfoBoxProps = {
  /**
   * The content to display in the InfoBox
   */
  children: ReactNode;
};

export const FormFieldInfoBox = ({ children }: FormFieldInfoBoxProps) => {
  const { setContext } = useContext(FormFieldContext);

  useEffect(() => {
    setContext((prevContext) => ({
      ...prevContext,
      info: children,
    }));
  }, [children, setContext]);

  return null;
};
