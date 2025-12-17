import type { ElementDefinition } from "../types/remote-dom.js";

export interface FormFieldLabelElementArgs {
  children?: (ElementDefinition | string)[];
}

/**
 * Build a form field label ElementDefinition
 */
export function buildFormFieldLabelElement(
  args: FormFieldLabelElementArgs
): ElementDefinition {
  return {
    tagName: "nimbus-form-field-label",
    children: args.children,
  };
}

export interface FormFieldInputElementArgs {
  children?: (ElementDefinition | string)[];
}

/**
 * Build a form field input wrapper ElementDefinition
 */
export function buildFormFieldInputElement(
  args: FormFieldInputElementArgs
): ElementDefinition {
  return {
    tagName: "nimbus-form-field-input",
    children: args.children,
  };
}

export interface FormFieldDescriptionElementArgs {
  children?: (ElementDefinition | string)[];
}

/**
 * Build a form field description ElementDefinition
 */
export function buildFormFieldDescriptionElement(
  args: FormFieldDescriptionElementArgs
): ElementDefinition {
  return {
    tagName: "nimbus-form-field-description",
    children: args.children,
  };
}

export interface FormFieldErrorElementArgs {
  children?: (ElementDefinition | string)[];
}

/**
 * Build a form field error ElementDefinition
 */
export function buildFormFieldErrorElement(
  args: FormFieldErrorElementArgs
): ElementDefinition {
  return {
    tagName: "nimbus-form-field-error",
    children: args.children,
  };
}

export interface FormFieldElementArgs {
  labelChildren: ElementDefinition[];
  inputChildren: ElementDefinition[];
  description?: string;
  errorMessage?: string;
  isRequired?: boolean;
  isInvalid?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  size?: "sm" | "md";
  direction?: "row" | "column";
}

/**
 * Build a form field ElementDefinition
 * FormField has nested structure: Root > Label, Input, Description, Error
 */
export function buildFormFieldElement(
  args: FormFieldElementArgs
): ElementDefinition {
  const {
    labelChildren,
    inputChildren,
    description,
    errorMessage,
    isRequired,
    isInvalid,
    isDisabled,
    isReadOnly,
    size,
    direction,
  } = args;

  const children: ElementDefinition[] = [
    buildFormFieldLabelElement({ children: labelChildren }),
    buildFormFieldInputElement({ children: inputChildren }),
  ];

  if (description) {
    children.push(
      buildFormFieldDescriptionElement({ children: [description] })
    );
  }

  if (errorMessage) {
    children.push(buildFormFieldErrorElement({ children: [errorMessage] }));
  }

  return {
    tagName: "nimbus-form-field-root",
    attributes: {
      isRequired,
      isInvalid,
      isDisabled,
      isReadOnly,
      size,
      direction,
    },
    children,
  };
}
