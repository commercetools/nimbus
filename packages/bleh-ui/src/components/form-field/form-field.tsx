import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  FormFieldDescriptionSlot,
  FormFieldErrorSlot,
  FormFieldInputSlot,
  FormFieldLabelSlot,
  FormFieldRootSlot,
} from "./form-field.slots";
import type { FormFieldProps } from "./form-field.types";

const FormFieldContext = createContext({});

/**
 * FormField
 * ============================================================
 * displays inputs in a FormField context
 */
export const FormFieldRoot = forwardRef<HTMLDivElement, FormFieldProps>(
  ({ children, ...props }, ref) => {
    const [internalContext] = useState(() => createContext({}));
    const contextValue = useContext(internalContext);

    console.log("contextValue: ", contextValue);

    const { label } = contextValue;

    console.log("label", label);

    return (
      <FormFieldContext.Provider value={contextValue}>
        <FormFieldRootSlot ref={ref} {...props}>
          {label && <FormFieldLabelSlot>{label}</FormFieldLabelSlot>}
          {children}
        </FormFieldRootSlot>
      </FormFieldContext.Provider>
    );
  }
);

function FormFieldLabel({ children }) {
  const context = useContext(FormFieldContext);
  context.label = children;
  return null;
}

function FormFieldDescription({ children }) {
  const context = useContext(FormFieldContext);
  return (
    <FormFieldContext.Provider value={{ ...context, description: children }}>
      {null}
    </FormFieldContext.Provider>
  );
}

function FormFieldError({ children }) {
  const context = useContext(FormFieldContext);
  return (
    <FormFieldContext.Provider value={{ ...context, errorMessage: children }}>
      {null}
    </FormFieldContext.Provider>
  );
}

export const FormField = {
  Root: FormFieldRoot,
  Label: FormFieldLabel,
  Input: FormFieldInputSlot,
  Description: FormFieldDescriptionSlot,
  Error: FormFieldErrorSlot,
};
