import { createUIResource } from "@mcp-ui/server";
import { escapeForJS } from "../utils/escape-for-js";

export interface CreateTextInputArgs {
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
  // HTML validation attributes
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

export function createTextInput(args: CreateTextInputArgs) {
  const {
    name,
    placeholder,
    defaultValue,
    isRequired = false,
    isDisabled = false,
    isReadOnly = false,
    type = "text",
    minLength,
    maxLength,
    pattern,
    min,
    max,
    step,
    accept,
    multiple = false,
    autoComplete,
    ariaLabel,
  } = args;

  // Use improved escaping for template literal safety
  const escapedName = name ? escapeForJS(name) : undefined;
  const escapedPlaceholder = placeholder ? escapeForJS(placeholder) : undefined;
  const escapedDefaultValue = defaultValue
    ? escapeForJS(defaultValue)
    : undefined;
  const escapedPattern = pattern ? escapeForJS(pattern) : undefined;
  const escapedAccept = accept ? escapeForJS(accept) : undefined;
  const escapedAutoComplete = autoComplete
    ? escapeForJS(autoComplete)
    : undefined;
  const escapedAriaLabel = ariaLabel ? escapeForJS(ariaLabel) : undefined;

  const remoteDomScript = `
    const textInput = document.createElement('nimbus-text-input');
    ${escapedName ? `textInput.setAttribute('name', '${escapedName}');` : ""}
    ${escapedPlaceholder ? `textInput.setAttribute('placeholder', '${escapedPlaceholder}');` : ""}
    ${escapedDefaultValue ? `textInput.setAttribute('value', '${escapedDefaultValue}');` : ""}
    ${isRequired ? `textInput.setAttribute('is-required', 'true');` : ""}
    ${isDisabled ? `textInput.setAttribute('is-disabled', 'true');` : ""}
    ${isReadOnly ? `textInput.setAttribute('is-read-only', 'true');` : ""}
    ${type !== "text" ? `textInput.setAttribute('type', '${type}');` : ""}
    ${minLength !== undefined ? `textInput.setAttribute('min-length', '${minLength}');` : ""}
    ${maxLength !== undefined ? `textInput.setAttribute('max-length', '${maxLength}');` : ""}
    ${escapedPattern ? `textInput.setAttribute('pattern', '${escapedPattern}');` : ""}
    ${min !== undefined ? `textInput.setAttribute('min', '${min}');` : ""}
    ${max !== undefined ? `textInput.setAttribute('max', '${max}');` : ""}
    ${step !== undefined ? `textInput.setAttribute('step', '${step}');` : ""}
    ${escapedAccept ? `textInput.setAttribute('accept', '${escapedAccept}');` : ""}
    ${multiple ? `textInput.setAttribute('multiple', 'true');` : ""}
    ${escapedAutoComplete ? `textInput.setAttribute('auto-complete', '${escapedAutoComplete}');` : ""}
    ${escapedAriaLabel ? `textInput.setAttribute('aria-label', '${escapedAriaLabel}');` : ""}

    root.appendChild(textInput);
  `;

  return createUIResource({
    uri: `ui://text-input/${Date.now()}`,
    content: {
      type: "remoteDom",
      script: remoteDomScript,
      framework: "react",
    },
    encoding: "text",
    metadata: {
      title: "Text Input",
      description: placeholder || "Text Input",
      created: new Date().toISOString(),
    },
  });
}
