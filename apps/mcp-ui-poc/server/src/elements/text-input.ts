import { z } from "zod";
import type { ElementDefinition } from "../types/remote-dom.js";

export const textInputElementSchema = z.object({
  type: z.literal("textInput"),
  name: z
    .string()
    .optional()
    .describe(
      "Input name attribute for form submission (CRITICAL for HTML forms)"
    ),
  placeholder: z
    .string()
    .optional()
    .describe("Placeholder text shown when input is empty"),
  defaultValue: z
    .string()
    .optional()
    .describe("Initial/default value for the input"),
  isRequired: z.boolean().optional().describe("Whether the input is required"),
  isDisabled: z.boolean().optional().describe("Whether the input is disabled"),
  isReadOnly: z.boolean().optional().describe("Whether the input is read-only"),
  inputType: z
    .enum([
      "text",
      "email",
      "url",
      "tel",
      "password",
      "search",
      "number",
      "date",
      "time",
      "datetime-local",
      "month",
      "week",
      "file",
    ])
    .optional()
    .describe("Input type for validation and keyboard (default: 'text')"),
  minLength: z
    .number()
    .optional()
    .describe("Minimum input length for validation"),
  maxLength: z
    .number()
    .optional()
    .describe("Maximum input length for validation"),
  pattern: z.string().optional().describe("Regex pattern for validation"),
  min: z
    .union([z.number(), z.string()])
    .optional()
    .describe("Minimum value (for number/date inputs)"),
  max: z
    .union([z.number(), z.string()])
    .optional()
    .describe("Maximum value (for number/date inputs)"),
  step: z
    .union([z.number(), z.string()])
    .optional()
    .describe("Step value (for number inputs)"),
  accept: z
    .string()
    .optional()
    .describe("Accepted file types (for file inputs, e.g., 'image/*')"),
  multiple: z
    .boolean()
    .optional()
    .describe("Allow multiple values (for file/email inputs)"),
  autoComplete: z
    .string()
    .optional()
    .describe(
      "Autocomplete hint (e.g., 'email', 'username', 'current-password')"
    ),
  ariaLabel: z.string().optional().describe("Accessible label for the input"),
});

export interface TextInputElementArgs {
  name?: string;
  placeholder?: string;
  defaultValue?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  type?:
    | "text"
    | "email"
    | "url"
    | "tel"
    | "password"
    | "search"
    | "number"
    | "date"
    | "time"
    | "datetime-local"
    | "month"
    | "week"
    | "file";
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  min?: number | string;
  max?: number | string;
  step?: number | string;
  accept?: string;
  multiple?: boolean;
  autoComplete?: string;
  ariaLabel?: string;
}

/**
 * Build a text input ElementDefinition
 */
export function buildTextInputElement(
  args: TextInputElementArgs
): ElementDefinition {
  return {
    tagName: "nimbus-text-input",
    attributes: {
      name: args.name,
      placeholder: args.placeholder,
      value: args.defaultValue,
      isRequired: args.isRequired,
      isDisabled: args.isDisabled,
      isReadOnly: args.isReadOnly,
      type: args.type,
      minLength: args.minLength,
      maxLength: args.maxLength,
      pattern: args.pattern,
      min: args.min,
      max: args.max,
      step: args.step,
      accept: args.accept,
      multiple: args.multiple,
      autoComplete: args.autoComplete,
      "aria-label": args.ariaLabel, // Keep kebab for aria
    },
  };
}
