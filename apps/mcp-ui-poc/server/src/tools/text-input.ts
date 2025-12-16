import { createUIResource } from "@mcp-ui/server";
import { escapeForJS } from "../utils/escape-for-js";

export interface CreateTextInputArgs {
  name?: string;
  placeholder?: string;
  defaultValue?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  type?: "text" | "email" | "url" | "tel";
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
  } = args;

  // Use improved escaping for template literal safety
  const escapedName = name ? escapeForJS(name) : undefined;
  const escapedPlaceholder = placeholder ? escapeForJS(placeholder) : undefined;
  const escapedDefaultValue = defaultValue
    ? escapeForJS(defaultValue)
    : undefined;

  const remoteDomScript = `
    const textInput = document.createElement('nimbus-text-input');
    ${escapedName ? `textInput.setAttribute('name', '${escapedName}');` : ""}
    ${escapedPlaceholder ? `textInput.setAttribute('placeholder', '${escapedPlaceholder}');` : ""}
    ${escapedDefaultValue ? `textInput.setAttribute('value', '${escapedDefaultValue}');` : ""}
    ${isRequired ? `textInput.setAttribute('is-required', 'true');` : ""}
    ${isDisabled ? `textInput.setAttribute('is-disabled', 'true');` : ""}
    ${isReadOnly ? `textInput.setAttribute('is-read-only', 'true');` : ""}
    ${type !== "text" ? `textInput.setAttribute('type', '${type}');` : ""}

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
