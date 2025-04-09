import { useContext, useEffect } from "react";
import { FormFieldContext } from "../form-field";

export const FormFieldLabel = ({ children }) => {
  const [, setContext] = useContext<object>(FormFieldContext);

  useEffect(() => {
    setContext((prevContext) => ({ ...prevContext, label: children }));
  }, [children, setContext]);

  return null;
};
