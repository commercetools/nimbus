import { createUIResource } from "@mcp-ui/server";
import { escapeForJS } from "../utils/escape-for-js.js";

export interface SimpleFormField {
  name: string;
  label: string;
  type?: "text" | "email" | "number" | "password" | "tel" | "url";
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
}

export interface SimpleFormArgs {
  title?: string;
  fields: SimpleFormField[];
  submitLabel?: string;
  // HTML form submission support
  // action is optional - if omitted, form data will be displayed in a dialog
  action?: string;
  method?: "get" | "post";
  enctype?:
    | "application/x-www-form-urlencoded"
    | "multipart/form-data"
    | "text/plain";
}

export function createSimpleForm(args: SimpleFormArgs) {
  const {
    title,
    fields,
    submitLabel = "Submit",
    action,
    method = "post",
    enctype,
  } = args;

  // Use improved escaping for template literal safety
  const escapedTitle = title ? escapeForJS(title) : undefined;
  const escapedSubmitLabel = escapeForJS(submitLabel);
  const escapedAction = action ? escapeForJS(action) : undefined;

  const fieldsScript = fields
    .map((field) => {
      const escapedLabel = escapeForJS(field.label);
      const escapedName = escapeForJS(field.name);
      const escapedPattern = field.pattern
        ? escapeForJS(field.pattern)
        : undefined;

      return `
    const fieldRoot${field.name} = document.createElement('nimbus-form-field-root');
    ${field.required ? `fieldRoot${field.name}.setAttribute('is-required', 'true');` : ""}

    const fieldLabel${field.name} = document.createElement('nimbus-form-field-label');
    fieldLabel${field.name}.textContent = '${escapedLabel}';

    const fieldInput${field.name} = document.createElement('nimbus-form-field-input');

    const input${field.name} = document.createElement('nimbus-text-input');
    input${field.name}.setAttribute('name', '${escapedName}');
    input${field.name}.setAttribute('placeholder', '${escapedLabel}');
    ${field.type && field.type !== "text" ? `input${field.name}.setAttribute('type', '${field.type}');` : ""}
    ${field.required ? `input${field.name}.setAttribute('is-required', 'true');` : ""}
    ${field.minLength !== undefined ? `input${field.name}.setAttribute('min-length', '${field.minLength}');` : ""}
    ${field.maxLength !== undefined ? `input${field.name}.setAttribute('max-length', '${field.maxLength}');` : ""}
    ${escapedPattern ? `input${field.name}.setAttribute('pattern', '${escapedPattern}');` : ""}

    fieldInput${field.name}.appendChild(input${field.name});
    fieldRoot${field.name}.appendChild(fieldLabel${field.name});
    fieldRoot${field.name}.appendChild(fieldInput${field.name});
    formBody.appendChild(fieldRoot${field.name});
    `;
    })
    .join("\n");

  const remoteDomScript = `
    const card = document.createElement('nimbus-card-root');
    card.setAttribute('elevation', 'elevated');
    card.setAttribute('max-width', '600px');
    card.setAttribute('border-style', 'outlined');

    const cardContent = document.createElement('nimbus-card-content');

    ${
      title
        ? `
    const heading = document.createElement('nimbus-heading');
    heading.setAttribute('size', 'lg');
    heading.setAttribute('margin-bottom', '500');
    heading.textContent = '${escapedTitle}';
    cardContent.appendChild(heading);
    `
        : ""
    }

    // Create form element using Stack with as="form"
    const formBody = document.createElement('nimbus-stack');
    formBody.setAttribute('direction', 'column');
    formBody.setAttribute('gap', '400');
    formBody.setAttribute('as', 'form');
    ${escapedAction ? `formBody.setAttribute('action', '${escapedAction}');` : ""}
    ${method ? `formBody.setAttribute('method', '${method}');` : ""}
    ${enctype ? `formBody.setAttribute('enctype', '${enctype}');` : ""}

    ${fieldsScript}

    const submitButton = document.createElement('nimbus-button');
    submitButton.setAttribute('variant', 'solid');
    submitButton.setAttribute('color-palette', 'primary');
    submitButton.setAttribute('width', 'full');
    submitButton.setAttribute('margin-top', '400');
    submitButton.setAttribute('type', 'submit');
    submitButton.textContent = '${escapedSubmitLabel}';

    formBody.appendChild(submitButton);
    cardContent.appendChild(formBody);
    card.appendChild(cardContent);
    root.appendChild(card);
  `;

  return createUIResource({
    uri: `ui://simple-form/${Date.now()}`,
    content: {
      type: "remoteDom",
      script: remoteDomScript,
      framework: "react",
    },
    encoding: "text",
    metadata: {
      title: "Simple Form",
      description: title || "Simple form component for basic use cases",
      created: new Date().toISOString(),
    },
  });
}
