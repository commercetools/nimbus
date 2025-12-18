import type { ElementDefinition } from "../types/remote-dom.js";

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
      defaultValue: args.defaultValue,
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
