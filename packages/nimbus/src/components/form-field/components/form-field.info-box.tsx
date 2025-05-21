import { useContext, useEffect, type ReactNode } from "react";
import { FormFieldContext } from "./form-field.context";

export const FormFieldInfoBox = ({ children }: { children: ReactNode }) => {
  const { setContext } = useContext(FormFieldContext);

  useEffect(() => {
    setContext((prevContext) => ({
      ...prevContext,
      info: children,
    }));
  }, [children, setContext]);

  return null;
};
