import { createContext, type ReactNode } from "react";
import { FormFieldRoot } from "./components/form-field.root";
import { FormFieldLabel } from "./components/form-field.label";
import { FormFieldInput } from "./components/form-field.input";
import { FormFieldDescription } from "./components/form-field.description";
import { FormFieldError } from "./components/form-field.error";
import { FormFieldInfoBox } from "./components/form-field.info-box";
import type {
  FormFieldDescriptionSlotProps,
  FormFieldErrorSlotProps,
  FormFieldInputSlotProps,
  FormFieldLabelSlotProps,
} from "./form-field.slots";

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

export const FormField = {
  Root: FormFieldRoot,
  Label: FormFieldLabel,
  Input: FormFieldInput,
  Description: FormFieldDescription,
  Error: FormFieldError,
  InfoBox: FormFieldInfoBox,
};
