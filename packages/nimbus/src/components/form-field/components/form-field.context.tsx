import { createContext, type ReactNode } from "react";
import type {
  FormFieldDescriptionSlotProps,
  FormFieldErrorSlotProps,
  FormFieldLabelSlotProps,
} from "../form-field.types";

export type FormFieldInputProps = Record<string, unknown>;

export type FormFieldContextPayloadType = {
  label: ReactNode;
  labelSlotProps?: FormFieldLabelSlotProps;
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
  inputProps: FormFieldInputProps;
};

export const FormFieldContext = createContext<FormFieldContextType>({
  context: {
    label: null,
    description: null,
    error: null,
    info: null,
  },
  setContext: () => {},
  inputProps: {},
});
