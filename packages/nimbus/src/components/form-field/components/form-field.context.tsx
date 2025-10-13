import { createContext, type ReactNode } from "react";
import type {
  FormFieldDescriptionSlotProps,
  FormFieldErrorSlotProps,
  FormFieldInputSlotProps,
  FormFieldLabelSlotProps,
} from "../form-field.types";

export type FormFieldContextPayloadType = {
  label: ReactNode;
  labelSlotProps?: FormFieldLabelSlotProps;
  input: ReactNode;
  inputSlotProps?: FormFieldInputSlotProps;
  description: ReactNode;
  descriptionSlotProps?: FormFieldDescriptionSlotProps;
  error: ReactNode;
  errorSlotProps?: FormFieldErrorSlotProps;
  info: ReactNode;
  isInvalid?: boolean;
  isRequired?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
};

export type FormFieldContextType = {
  context: FormFieldContextPayloadType;
  setContext: React.Dispatch<React.SetStateAction<FormFieldContextPayloadType>>;
};

export const FormFieldContext = createContext<FormFieldContextType>({
  context: {
    label: null,
    description: null,
    error: null,
    info: null,
    input: null,
  },
  setContext: () => {},
});
