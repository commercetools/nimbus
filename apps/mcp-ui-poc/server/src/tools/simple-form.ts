import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
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
import { createRemoteDomResource } from "../utils/create-remote-dom-resource.js";

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

  // Build structured form using element builders
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

  // Build submit button
  const submitButton = buildButtonElement({
    label: submitLabel,
    variant: "solid",
    colorPalette: "primary",
    width: "full",
    type: "submit",
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

  return createRemoteDomResource(card, {
    name: "simple-form",
    title: "Simple Form",
    description: title || "Simple form component for basic use cases",
  });
}

export function registerSimpleFormTool(server: McpServer) {
  server.registerTool(
    "createSimpleForm",
    {
      title: "Create Simple Form",
      description:
        "Creates a simple form UI component with text inputs and submit button using Nimbus design system components. NOTE: This is a convenience tool for VERY SIMPLE forms only. For more complex forms with custom layouts or additional components, compose your own form using createStack (with as='form'), createFormField, createTextInput, and createButton tools.",
      inputSchema: z.object({
        title: z.string().optional().describe("Form title"),
        fields: z
          .array(
            z.object({
              name: z
                .string()
                .describe("Field name (required for form submission)"),
              label: z.string().describe("Field label"),
              type: z
                .enum(["text", "email", "number", "password", "tel", "url"])
                .optional()
                .describe(
                  "Input type for validation and keyboard (default: 'text')"
                ),
              required: z
                .boolean()
                .optional()
                .describe("Whether field is required"),
              minLength: z.number().optional().describe("Minimum input length"),
              maxLength: z.number().optional().describe("Maximum input length"),
              pattern: z
                .string()
                .optional()
                .describe("Regex pattern for validation"),
            })
          )
          .describe("Array of form fields"),
        submitLabel: z
          .string()
          .optional()
          .describe("Submit button label (default: 'Submit')"),
        action: z
          .string()
          .optional()
          .describe(
            "Form submission URL. OPTIONAL - if omitted, form data will be displayed in a dialog on submit instead of navigating to a URL."
          ),
        method: z
          .enum(["get", "post"])
          .optional()
          .describe("HTTP method for form submission (default: 'post')"),
        enctype: z
          .enum([
            "application/x-www-form-urlencoded",
            "multipart/form-data",
            "text/plain",
          ])
          .optional()
          .describe(
            "Form encoding type (default: 'application/x-www-form-urlencoded')"
          ),
      }),
    },
    async (args) => {
      const uiResource = createSimpleForm(args);
      return {
        content: [uiResource],
      };
    }
  );
}
