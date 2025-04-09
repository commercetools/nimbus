import { useContext, useEffect } from "react";
import { FormFieldContext } from "../form-field";

export const FormFieldDescription = ({ children }) => {
  const [, setContext] = useContext(FormFieldContext);

  useEffect(() => {
    setContext((prevContext) => ({ ...prevContext, description: children }));
  }, [children, setContext]);

  return null;
};
