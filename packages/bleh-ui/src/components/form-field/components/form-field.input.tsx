import { useContext, useEffect } from "react";
import { FormFieldContext } from "../form-field";

export const FormFieldInput = ({ children }) => {
  const [, setContext] = useContext(FormFieldContext);

  useEffect(() => {
    setContext((prevContext) => ({ ...prevContext, input: children }));
  }, [children, setContext]);

  return null;
};
