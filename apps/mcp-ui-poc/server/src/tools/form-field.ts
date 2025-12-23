import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { RemoteDomElement } from "../types/remote-dom.js";
import { createRemoteDomResource } from "../utils/create-remote-dom-resource.js";
import {
  commonStyleSchema,
  extractStyleProps,
} from "../utils/common-schemas.js";
import { createElementFromDefinition } from "../utils/create-element-from-definition.js";

/**
 * Register the createFormField tool with the MCP server
 */
export function registerFormFieldTool(server: McpServer) {
  server.registerTool(
    "createFormField",
    {
      title: "Create Form Field",
      description:
        "Creates a form field UI component with composable label and input sections, plus optional description and error message. Supports full composition for label and input content. Supports all Chakra UI style properties.",
      inputSchema: z.object({
        // Content
        labelChildren: z
          .array(z.record(z.any()))
          .describe(
            "Child elements for the label section (element definition objects)"
          ),
        inputChildren: z
          .array(z.record(z.any()))
          .describe(
            "Child elements for the input section (element definition objects)"
          ),

        // Component-specific props
        description: z.string().optional().describe("Field description text"),
        errorMessage: z.string().optional().describe("Error message text"),
        isRequired: z
          .boolean()
          .optional()
          .describe("Whether field is required"),
        isInvalid: z.boolean().optional().describe("Whether field is invalid"),
        isDisabled: z
          .boolean()
          .optional()
          .describe("Whether field is disabled"),
        isReadOnly: z
          .boolean()
          .optional()
          .describe("Whether field is read-only"),
        size: z.enum(["sm", "md"]).optional().describe("Field size"),
        direction: z
          .enum(["row", "column"])
          .optional()
          .describe("Layout direction"),

        // All Chakra UI style properties
        ...commonStyleSchema,
      }),
    },
    async (args) => {
      // Create form field root element directly using Remote DOM custom element
      const formFieldRoot = document.createElement(
        "nimbus-form-field-root"
      ) as RemoteDomElement;

      // Set component-specific props
      if (args.isRequired) formFieldRoot.isRequired = args.isRequired;
      if (args.isInvalid) formFieldRoot.isInvalid = args.isInvalid;
      if (args.isDisabled) formFieldRoot.isDisabled = args.isDisabled;
      if (args.isReadOnly) formFieldRoot.isReadOnly = args.isReadOnly;
      if (args.size) formFieldRoot.size = args.size;
      if (args.direction) formFieldRoot.direction = args.direction;

      // Extract and set style props as object
      const styleProps = extractStyleProps(args);
      if (Object.keys(styleProps).length > 0) {
        formFieldRoot.styleProps = styleProps;
      }

      // Create label section
      const formFieldLabel = document.createElement(
        "nimbus-form-field-label"
      ) as RemoteDomElement;
      args.labelChildren.forEach((childDef: Record<string, unknown>) => {
        if (typeof childDef === "string") {
          formFieldLabel.appendChild(document.createTextNode(childDef));
        } else {
          const childElement = createElementFromDefinition(childDef);
          formFieldLabel.appendChild(childElement);
        }
      });
      formFieldRoot.appendChild(formFieldLabel);

      // Create input section
      const formFieldInput = document.createElement(
        "nimbus-form-field-input"
      ) as RemoteDomElement;
      args.inputChildren.forEach((childDef: Record<string, unknown>) => {
        if (typeof childDef === "string") {
          formFieldInput.appendChild(document.createTextNode(childDef));
        } else {
          const childElement = createElementFromDefinition(childDef);
          formFieldInput.appendChild(childElement);
        }
      });
      formFieldRoot.appendChild(formFieldInput);

      // Add optional description
      if (args.description) {
        const formFieldDescription = document.createElement(
          "nimbus-form-field-description"
        ) as RemoteDomElement;
        formFieldDescription.textContent = args.description;
        formFieldRoot.appendChild(formFieldDescription);
      }

      // Add optional error message
      if (args.errorMessage) {
        const formFieldError = document.createElement(
          "nimbus-form-field-error"
        ) as RemoteDomElement;
        formFieldError.textContent = args.errorMessage;
        formFieldRoot.appendChild(formFieldError);
      }

      // Return resource (createRemoteDomResource handles appending to root)
      return {
        content: [
          createRemoteDomResource(formFieldRoot, {
            name: "form-field",
            title: "Form Field",
            description: "Form Field with composable label and input",
          }),
        ],
      };
    }
  );
}
