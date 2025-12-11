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

      return `
    const fieldRoot${field.name} = document.createElement('nimbus-form-field-root');
    ${field.required ? `fieldRoot${field.name}.setAttribute('is-required', 'true');` : ""}

    const fieldLabel${field.name} = document.createElement('nimbus-form-field-label');
    fieldLabel${field.name}.textContent = '${escapedLabel}';

    const fieldInput${field.name} = document.createElement('nimbus-form-field-input');

    const input${field.name} = document.createElement('nimbus-text-input');
    input${field.name}.setAttribute('name', '${escapedName}');
    input${field.name}.setAttribute('placeholder', '${escapedLabel}');

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

    // Add submit handler with form data collection
    submitButton.onclick = function() {
      // Collect form data from inputs
      const formData = {};
      ${fields
        .map((field) => {
          return `
      const input${field.name} = document.querySelector('[name="${field.name}"]');
      if (input${field.name}) {
        formData['${field.name}'] = input${field.name}.value || '';
      }`;
        })
        .join("")}

      console.log('Form data collected:', formData);

      // Send form data to host via UI Action
      if (typeof window.postUIActionResult === 'function') {
        window.postUIActionResult({
          type: 'tool',
          payload: {
            toolName: 'submitForm',
            params: {
              formTitle: '${escapedTitle || "Form"}',
              fields: formData
            }
          }
        });
      }
    };

    formBody.appendChild(submitButton);
    cardContent.appendChild(formBody);
    card.appendChild(cardContent);
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
