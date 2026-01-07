import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { RemoteDomElement } from "../types/remote-dom.js";
import { createRemoteDomResource } from "../utils/create-remote-dom-resource.js";
import { commonStyleSchema } from "../utils/common-schemas.js";
import { configureButtonAction } from "./button.js";

export interface SimpleFormField {
  name: string;
  label: string;
  type?: "text" | "email" | "number" | "password" | "tel" | "url";
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  defaultValue?: string;
}

export interface SimpleFormArgs {
  title?: string;
  fields: SimpleFormField[];
  submitLabel?: string;
  // Action configuration
  actionToolName?: string;
  actionParams?: Record<string, unknown>;
}

export function createSimpleForm(args: SimpleFormArgs) {
  const {
    title,
    fields,
    submitLabel = "Submit",
    actionToolName,
    actionParams,
  } = args;

  // Create card root element
  const cardRoot = document.createElement(
    "nimbus-card-root"
  ) as RemoteDomElement;
  cardRoot.elevation = "elevated";
  cardRoot.styleProps = {
    maxWidth: "600px",
  };

  // Create card content
  const cardContent = document.createElement(
    "nimbus-card-content"
  ) as RemoteDomElement;

  // Add title heading if provided
  if (title) {
    const heading = document.createElement(
      "nimbus-heading"
    ) as RemoteDomElement;
    heading.size = "lg";
    heading.textContent = title;
    heading.styleProps = { marginBottom: "500" };
    cardContent.appendChild(heading);
  }

  // Generate unique form ID
  const formId = `form-${Date.now()}-${Math.random().toString(36).substring(7)}`;

  // Create form flex
  const formContainer = document.createElement(
    "nimbus-flex"
  ) as RemoteDomElement;
  formContainer.as = "form";
  formContainer.setAttribute("id", formId); // Set ID as attribute for event handling
  formContainer.styleProps = { gap: "400", flexWrap: "wrap" };

  // Build form fields
  fields.forEach((field) => {
    // Create form field root
    const formFieldRoot = document.createElement(
      "nimbus-form-field-root"
    ) as RemoteDomElement;
    if (field.required) formFieldRoot.isRequired = field.required;

    // Create label section
    const formFieldLabel = document.createElement(
      "nimbus-form-field-label"
    ) as RemoteDomElement;
    const labelText = document.createElement("nimbus-text") as RemoteDomElement;
    labelText.textContent = field.label;
    formFieldLabel.appendChild(labelText);
    formFieldRoot.appendChild(formFieldLabel);

    // Create input section
    const formFieldInput = document.createElement(
      "nimbus-form-field-input"
    ) as RemoteDomElement;
    const textInput = document.createElement(
      "nimbus-text-input"
    ) as RemoteDomElement;
    textInput.name = field.name;
    textInput.placeholder = field.label;
    if (field.type) textInput.type = field.type;
    if (field.required) textInput.isRequired = field.required;
    if (field.minLength !== undefined) textInput.minLength = field.minLength;
    if (field.maxLength !== undefined) textInput.maxLength = field.maxLength;
    if (field.pattern) textInput.pattern = field.pattern;
    if (field.defaultValue !== undefined)
      textInput.defaultValue = field.defaultValue;
    formFieldInput.appendChild(textInput);
    formFieldRoot.appendChild(formFieldInput);

    formContainer.appendChild(formFieldRoot);
  });

  // Build submit button (as regular button, not form submit)
  const submitButtonId = `${formId}-submit`;
  const submitButton = document.createElement(
    "nimbus-button"
  ) as RemoteDomElement;
  submitButton.setAttribute("id", submitButtonId);
  submitButton.textContent = submitLabel;
  submitButton.variant = "solid";
  submitButton.colorPalette = "primary";
  submitButton.type = "button"; // Regular button, not submit
  submitButton.styleProps = { width: "full" };
  formContainer.appendChild(submitButton);

  // Append form to card content
  cardContent.appendChild(formContainer);
  cardRoot.appendChild(cardContent);

  // Generate URI for this form
  const uri = `ui://simple-form/${Date.now()}`;

  // Configure submit button action using button tool's system
  if (actionToolName) {
    configureButtonAction(
      submitButtonId,
      actionToolName,
      actionParams || {},
      uri
    );
  }

  return createRemoteDomResource(cardRoot, {
    name: "simple-form",
    title: "Simple Form",
    description: title || "Simple form component for basic use cases",
    uri,
  });
}

export function registerSimpleFormTool(server: McpServer) {
  server.registerTool(
    "createSimpleForm",
    {
      title: "Create Simple Form",
      description:
        "Creates a form with text inputs using Nimbus design system components. Can optionally trigger an MCP tool call when submitted by specifying actionToolName and actionParams. Form field values will be included in the action params under 'formData'. Supports all Chakra UI style properties.",
      inputSchema: z.object({
        title: z.string().optional().describe("Form title"),
        fields: z
          .array(
            z.object({
              name: z
                .string()
                .describe("Field name (used as key in form data)"),
              label: z.string().describe("Field label text"),
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
              defaultValue: z
                .string()
                .optional()
                .describe(
                  "Default value for the field (pre-populate the input)"
                ),
            })
          )
          .describe("Array of form fields"),
        submitLabel: z
          .string()
          .optional()
          .describe("Submit button label (default: 'Submit')"),

        // Action configuration (optional)
        actionToolName: z
          .string()
          .optional()
          .describe(
            "Name of MCP tool to call when form is submitted (e.g., 'commerce__createProduct')"
          ),
        actionParams: z
          .record(z.string(), z.any())
          .optional()
          .describe(
            "Additional parameters to pass to the MCP tool. Form data will be merged with these params under the 'formData' key."
          ),

        // All Chakra UI style properties
        ...commonStyleSchema,
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
