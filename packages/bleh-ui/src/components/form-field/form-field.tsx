import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  FormFieldDescriptionSlot,
  FormFieldErrorSlot,
  FormFieldInputSlot,
  FormFieldLabelSlot,
  FormFieldRootSlot,
} from "./form-field.slots";
import type { FormFieldProps } from "./form-field.types";

type FormFieldContextPayloadType = {
  label?: ReactNode | undefined;
  description?: ReactNode | undefined;
  error?: ReactNode | undefined;
};

type FormFieldContextType = [
  FormFieldContextPayloadType,
  (payload: FormFieldContextPayloadType) => void,
];

const FormFieldContext = createContext<FormFieldContextType>([{}, () => {}]);

/**
 * FormField
 * ============================================================
 * displays inputs in a FormField context
 */
export const FormFieldRoot = forwardRef<HTMLDivElement, FormFieldProps>(
  ({ children, ...props }, ref) => {
    const [context, setContext] = useState<FormFieldContextPayloadType>({
      label: "",
      description: "",
      error: "",
    });

    const mergeContexts = useCallback(
      (pl: object) => {
        setContext({ ...context, ...pl });
      },
      [context]
    );

    return (
      <FormFieldContext.Provider value={[context, mergeContexts]}>
        <FormFieldRootSlot ref={ref} {...props}>
          {context.label && (
            <FormFieldLabelSlot>{context.label}</FormFieldLabelSlot>
          )}
          {context.description && (
            <FormFieldDescriptionSlot>
              {context.description}
            </FormFieldDescriptionSlot>
          )}
          {context.error && (
            <FormFieldErrorSlot>{context.error}</FormFieldErrorSlot>
          )}
          {children}
        </FormFieldRootSlot>
      </FormFieldContext.Provider>
    );
  }
);

type ContextPayloadType = { children: ReactNode };

const FormFieldLabel = ({ children }: ContextPayloadType) => {
  const [, setContext] = useContext<FormFieldContextType>(FormFieldContext);

  useEffect(() => {
    setContext({ label: children });
  }, [children]);

  return null;
};

const FormFieldDescription = ({ children }: ContextPayloadType) => {
  const [, setContext] = useContext<FormFieldContextType>(FormFieldContext);

  useEffect(() => {
    setContext({ description: children });
  }, [children]);

  return null;
};

const FormFieldError = ({ children }: ContextPayloadType) => {
  const [, setContext] = useContext<FormFieldContextType>(FormFieldContext);

  useEffect(() => {
    setContext({ error: children });
  }, [children]);

  return null;
};

export const FormField = {
  Root: FormFieldRoot,
  Label: FormFieldLabel,
  Input: FormFieldInputSlot,
  Description: FormFieldDescription,
  Error: FormFieldError,
};
