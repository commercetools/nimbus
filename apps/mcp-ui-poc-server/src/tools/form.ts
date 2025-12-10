import { createUIResource } from "@mcp-ui/server";

export interface FormField {
  name: string;
  label: string;
  type?: "text" | "email" | "number" | "textarea";
  required?: boolean;
}

export interface FormArgs {
  title?: string;
  fields: FormField[];
  submitLabel?: string;
}

export function createForm(args: FormArgs) {
  const { title, fields, submitLabel = "Submit" } = args;

  // Escape strings for JavaScript
  const escapedTitle = title?.replace(/'/g, "\\'");
  const escapedSubmitLabel = submitLabel.replace(/'/g, "\\'");

  const fieldsScript = fields
    .map((field) => {
      const escapedLabel = field.label.replace(/'/g, "\\'");
      const escapedName = field.name.replace(/'/g, "\\'");
      const fieldType = field.type || "text";

      return `
    const field${field.name} = document.createElement('nimbus-stack');
    field${field.name}.setAttribute('direction', 'column');
    field${field.name}.setAttribute('gap', '200');
    field${field.name}.setAttribute('margin-bottom', '400');

    const label${field.name} = document.createElement('nimbus-text');
    label${field.name}.setAttribute('font-weight', 'medium');
    label${field.name}.textContent = '${escapedLabel}${field.required ? " *" : ""}';

    const input${field.name} = document.createElement('nimbus-text-input');
    input${field.name}.setAttribute('name', '${escapedName}');
    input${field.name}.setAttribute('placeholder', '${escapedLabel}');
    ${field.required ? `input${field.name}.setAttribute('required', 'true');` : ""}

    field${field.name}.appendChild(label${field.name});
    field${field.name}.appendChild(input${field.name});
    formBody.appendChild(field${field.name});
    `;
    })
    .join("\n");

  const remoteDomScript = `
    const card = document.createElement('nimbus-card');
    card.setAttribute('variant', 'elevated');
    card.setAttribute('max-width', '600px');

    const cardBody = document.createElement('nimbus-card-body');

    ${
      title
        ? `
    const heading = document.createElement('nimbus-heading');
    heading.setAttribute('size', 'lg');
    heading.setAttribute('margin-bottom', '500');
    heading.textContent = '${escapedTitle}';
    cardBody.appendChild(heading);
    `
        : ""
    }

    const formBody = document.createElement('nimbus-stack');
    formBody.setAttribute('direction', 'column');
    formBody.setAttribute('gap', '400');

    ${fieldsScript}

    const submitButton = document.createElement('nimbus-button');
    submitButton.setAttribute('variant', 'solid');
    submitButton.setAttribute('color-palette', 'primary');
    submitButton.setAttribute('width', 'full');
    submitButton.setAttribute('margin-top', '400');
    submitButton.textContent = '${escapedSubmitLabel}';

    formBody.appendChild(submitButton);
    cardBody.appendChild(formBody);
    card.appendChild(cardBody);
    root.appendChild(card);
  `;

  return createUIResource({
    uri: `ui://form/${Date.now()}`,
    content: {
      type: "remoteDom",
      script: remoteDomScript,
      framework: "react",
    },
    encoding: "text",
    metadata: {
      title: "Form",
      description: title || "Form component",
      created: new Date().toISOString(),
    },
  });
}
