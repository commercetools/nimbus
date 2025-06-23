import { createContext, type ReactNode } from "react";

export type FormFieldContextValue = {
  // React Aria field props
  labelProps: React.LabelHTMLAttributes<HTMLLabelElement>;
  fieldProps: React.InputHTMLAttributes<HTMLInputElement>;
  descriptionProps: React.HTMLAttributes<HTMLElement>;
  errorMessageProps: React.HTMLAttributes<HTMLElement>;

  // Field state
  isInvalid?: boolean;
  isRequired?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;

  // Content tracking for rendering
  hasLabel: boolean;
  hasDescription: boolean;
  hasError: boolean;
  hasInfo: boolean;
};

export const FormFieldContext = createContext<FormFieldContextValue | null>(
  null
);

export type FormFieldChildrenAnalysis = {
  labelContent: ReactNode;
  inputContent: ReactNode;
  descriptionContent: ReactNode;
  errorContent: ReactNode;
  infoContent: ReactNode;
  hasLabel: boolean;
  hasDescription: boolean;
  hasError: boolean;
  hasInfo: boolean;
};
