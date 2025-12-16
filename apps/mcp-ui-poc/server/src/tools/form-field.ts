import { createUIResource } from "@mcp-ui/server";
import type { ChildElement } from "../types/index";
import { generateChildrenScript } from "../utils/children-generator";
import { escapeForJS } from "../utils/escape-for-js";

export interface CreateFormFieldArgs {
  // Composition mode for label - array of child elements
  labelChildren: ChildElement[];
  // Composition mode for input - array of child elements
  inputChildren: ChildElement[];
  // Optional field parts (strings)
  description?: string;
  errorMessage?: string;
  // Validation states
  isRequired?: boolean;
  isInvalid?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  // Styling
  size?: "sm" | "md";
  direction?: "row" | "column";
}

export function createFormField(args: CreateFormFieldArgs) {
  const {
    labelChildren,
    inputChildren,
    description,
    errorMessage,
    isRequired = false,
    isInvalid = false,
    isDisabled = false,
    isReadOnly = false,
    size = "md",
    direction = "column",
  } = args;

  // Use improved escaping for template literal safety
  const escapedDescription = description ? escapeForJS(description) : undefined;
  const escapedErrorMessage = errorMessage
    ? escapeForJS(errorMessage)
    : undefined;

  const remoteDomScript = `
    // Create FormField.Root container
    const fieldRoot = document.createElement('nimbus-form-field-root');
    ${isRequired ? `fieldRoot.setAttribute('is-required', 'true');` : ""}
    ${isInvalid ? `fieldRoot.setAttribute('is-invalid', 'true');` : ""}
    ${isDisabled ? `fieldRoot.setAttribute('is-disabled', 'true');` : ""}
    ${isReadOnly ? `fieldRoot.setAttribute('is-read-only', 'true');` : ""}
    ${size !== "md" ? `fieldRoot.setAttribute('size', '${size}');` : ""}
    ${direction !== "column" ? `fieldRoot.setAttribute('direction', '${direction}');` : ""}

    // Create FormField.Label with composition
    const fieldLabel = document.createElement('nimbus-form-field-label');
    ${generateChildrenScript(labelChildren, "fieldLabel")}
    fieldRoot.appendChild(fieldLabel);

    // Create FormField.Input wrapper with composition
    const fieldInput = document.createElement('nimbus-form-field-input');
    ${generateChildrenScript(inputChildren, "fieldInput")}
    fieldRoot.appendChild(fieldInput);

    ${
      escapedDescription
        ? `
    // Create FormField.Description
    const fieldDescription = document.createElement('nimbus-form-field-description');
    fieldDescription.textContent = '${escapedDescription}';
    fieldRoot.appendChild(fieldDescription);
    `
        : ""
    }

    ${
      escapedErrorMessage
        ? `
    // Create FormField.Error (only shown when isInvalid is true)
    const fieldError = document.createElement('nimbus-form-field-error');
    fieldError.textContent = '${escapedErrorMessage}';
    fieldRoot.appendChild(fieldError);
    `
        : ""
    }

    root.appendChild(fieldRoot);
  `;

  return createUIResource({
    uri: `ui://form-field/${Date.now()}`,
    content: {
      type: "remoteDom",
      script: remoteDomScript,
      framework: "react",
    },
    encoding: "text",
    metadata: {
      title: "Form Field",
      description: "Form Field with composable label and input",
      created: new Date().toISOString(),
    },
  });
}
