import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { RemoteDomElement } from "../types/remote-dom.js";
import { createRemoteDomResource } from "../utils/create-remote-dom-resource.js";
import {
  commonStyleSchema,
  extractStyleProps,
} from "../utils/common-schemas.js";

/**
 * Register the createTextInput tool with the MCP server
 */
export function registerTextInputTool(server: McpServer) {
  server.registerTool(
    "createTextInput",
    {
      title: "Create Text Input",
      description:
        "Creates a text input UI component using Nimbus design system. Can be used standalone or composed inside FormField.Input. Supports HTML5 validation attributes for native browser validation in forms.",
      inputSchema: z.object({
        // Component-specific props
        name: z.string().optional().describe("Input name for form submission"),
        placeholder: z.string().optional().describe("Placeholder text"),
        type: z
          .enum([
            "text",
            "email",
            "number",
            "password",
            "tel",
            "url",
            "search",
            "date",
            "time",
            "datetime-local",
            "file",
          ])
          .optional()
          .describe("Input type"),
        defaultValue: z
          .string()
          .optional()
          .describe("Default value - can be used to pre-fill input"),
        isRequired: z
          .boolean()
          .optional()
          .describe("Whether input is required"),
        isDisabled: z
          .boolean()
          .optional()
          .describe("Whether input is disabled"),
        isReadOnly: z
          .boolean()
          .optional()
          .describe("Whether input is read-only"),

        // Validation attributes
        minLength: z.number().optional().describe("Minimum input length"),
        maxLength: z.number().optional().describe("Maximum input length"),
        pattern: z.string().optional().describe("Regex pattern for validation"),
        min: z
          .number()
          .optional()
          .describe("Minimum value (for number inputs)"),
        max: z
          .number()
          .optional()
          .describe("Maximum value (for number inputs)"),
        step: z.number().optional().describe("Step value (for number inputs)"),

        // File input attributes
        accept: z
          .string()
          .optional()
          .describe("Accepted file types (for file inputs)"),
        multiple: z
          .boolean()
          .optional()
          .describe("Allow multiple files (for file inputs)"),

        // Autocomplete
        autoComplete: z
          .string()
          .optional()
          .describe("Autocomplete attribute value"),

        // All Chakra UI style properties
        ...commonStyleSchema,
      }),
    },
    async (args) => {
      // Create text input element directly using Remote DOM custom element
      const textInput = document.createElement(
        "nimbus-text-input"
      ) as RemoteDomElement;

      // Set component-specific props
      if (args.name) textInput.name = args.name;
      if (args.placeholder) textInput.placeholder = args.placeholder;
      if (args.type) textInput.type = args.type;
      if (args.defaultValue) textInput.defaultValue = args.defaultValue;
      if (args.isRequired) textInput.isRequired = args.isRequired;
      if (args.isDisabled) textInput.isDisabled = args.isDisabled;
      if (args.isReadOnly) textInput.isReadOnly = args.isReadOnly;

      // Validation attributes
      if (args.minLength !== undefined) textInput.minLength = args.minLength;
      if (args.maxLength !== undefined) textInput.maxLength = args.maxLength;
      if (args.pattern) textInput.pattern = args.pattern;
      if (args.min !== undefined) textInput.min = args.min;
      if (args.max !== undefined) textInput.max = args.max;
      if (args.step !== undefined) textInput.step = args.step;

      // File input attributes
      if (args.accept) textInput.accept = args.accept;
      if (args.multiple) textInput.multiple = args.multiple;

      // Autocomplete
      if (args.autoComplete) textInput.autoComplete = args.autoComplete;

      // Extract and set style props as object
      const styleProps = extractStyleProps(args);
      if (Object.keys(styleProps).length > 0) {
        textInput.styleProps = styleProps;
      }

      // Return resource (createRemoteDomResource handles appending to root)
      return {
        content: [
          createRemoteDomResource(textInput, {
            name: "text-input",
            title: "Text Input",
            description: args.placeholder || "Text Input",
          }),
        ],
      };
    }
  );
}
