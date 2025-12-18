import { z } from "zod";
import type { ElementDefinition } from "../types/remote-dom.js";

// Forward reference - will be defined in constants/child-element-schema.ts
const childElementSchema: z.ZodTypeAny = z.any();

export const formFieldElementSchema = z.object({
  type: z.literal("formField"),
  labelChildren: z
    .array(childElementSchema)
    .describe(
      "Array of child elements for the label. For simple text labels, use a single element: { type: 'text', content: 'Label text' }. Only use complex composition (with multiple elements, icons, etc.) when needed."
    ),
  inputChildren: z
    .array(childElementSchema)
    .describe(
      "Array of child elements for the input wrapper. MUST contain valid input elements with type discriminator 'textInput'. Typically a single element: { type: 'textInput', name: 'fieldName', placeholder: 'Enter value', inputType: 'email' }. The inputType property (optional) specifies the HTML input type (text, email, password, etc.)."
    ),
  description: z
    .string()
    .optional()
    .describe("Optional helper text displayed below the input"),
  errorMessage: z
    .string()
    .optional()
    .describe("Optional error message (shown when isInvalid is true)"),
  isRequired: z
    .boolean()
    .optional()
    .describe("Whether the field is required (shows indicator)"),
  isInvalid: z
    .boolean()
    .optional()
    .describe("Whether the field has a validation error"),
  isDisabled: z.boolean().optional().describe("Whether the field is disabled"),
  isReadOnly: z.boolean().optional().describe("Whether the field is read-only"),
  size: z
    .enum(["sm", "md"])
    .optional()
    .describe("Size variant (default: 'md')"),
  direction: z
    .enum(["row", "column"])
    .optional()
    .describe("Layout direction (default: 'column')"),
});

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
