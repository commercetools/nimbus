import { useContext, useEffect } from "react";
import { FormFieldContext } from "../form-field";

export const FormFieldInfoBox = ({ children }) => {
  const [, setContext] = useContext(FormFieldContext);

  useEffect(() => {
    setContext((prevContext) => ({ ...prevContext, info: children }));
  }, [children, setContext]);

  return null;
};
