import { useContext, useEffect } from "react";
import { FormFieldContext } from "../form-field";

export const FormFieldError = ({ children }) => {
  const [, setContext] = useContext(FormFieldContext);

  useEffect(() => {
    setContext((prevContext) => ({ ...prevContext, error: children }));
  }, [children, setContext]);

  return null;
};
