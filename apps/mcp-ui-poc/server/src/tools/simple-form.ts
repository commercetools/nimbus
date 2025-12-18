import { createUIResource } from "@mcp-ui/server";
import type { ElementDefinition } from "../types/remote-dom.js";
import {
  buildCardElement,
  buildCardContentElement,
  buildHeadingElement,
  buildStackElement,
  buildFormFieldElement,
  buildTextInputElement,
  buildTextElement,
  buildButtonElement,
} from "../elements/index.js";

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

  // ✅ Build structured form using element builders
  const cardChildren: (ElementDefinition | string)[] = [];

  // Add title heading if provided
  if (title) {
    cardChildren.push(
      buildHeadingElement({
        content: title,
        size: "lg",
        marginBottom: "500",
      })
    );
  }

  // Build form fields
  const formFields = fields.map((field) =>
    buildFormFieldElement({
      labelChildren: [buildTextElement({ content: field.label })],
      inputChildren: [
        buildTextInputElement({
          name: field.name,
          placeholder: field.label,
          type: field.type,
          isRequired: field.required,
          minLength: field.minLength,
          maxLength: field.maxLength,
          pattern: field.pattern,
        }),
      ],
      isRequired: field.required,
    })
  );

  // Build submit button with intent
  const submitButton = buildButtonElement({
    label: submitLabel,
    variant: "solid",
    colorPalette: "primary",
    width: "full",
    type: "submit",
    intent: {
      type: "submit_form",
      description: `User wants to submit the form${title ? ` "${title}"` : ""} with the entered data.`,
      payload: {
        formTitle: title || "Form",
        fieldCount: fields.length,
      },
    },
  });

  // Build form stack
  const formStack = buildStackElement({
    direction: "column",
    gap: "400",
    as: "form",
    action,
    method,
    enctype,
    children: [...formFields, submitButton],
  });

  cardChildren.push(formStack);

  // Build final card structure
  const card = buildCardElement({
    elevation: "elevated",
    borderStyle: "outlined",
    maxWidth: "600px",
    children: [
      buildCardContentElement({
        children: cardChildren,
      }),
    ],
  });

  return createUIResource({
    uri: `ui://simple-form/${Date.now()}`,
    content: {
      type: "remoteDom",
      script: JSON.stringify({
        type: "structuredDom",
        element: card,
        framework: "react",
      }),
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
