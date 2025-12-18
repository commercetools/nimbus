import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { ChildElement } from "../types/index.js";
import {
  buildFormFieldElement,
  formFieldElementSchema,
} from "../elements/form-field.js";
import { convertChildrenToElements } from "../utils/element-converter.js";
import { createRemoteDomResource } from "../utils/create-remote-dom-resource.js";

export interface CreateFormFieldArgs {
  labelChildren: ChildElement[];
  inputChildren: ChildElement[];
  description?: string;
  errorMessage?: string;
  isRequired?: boolean;
  isInvalid?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  size?: "sm" | "md";
  direction?: "row" | "column";
}

function createFormField(args: CreateFormFieldArgs) {
  const element = buildFormFieldElement({
    labelChildren: convertChildrenToElements(args.labelChildren),
    inputChildren: convertChildrenToElements(args.inputChildren),
    description: args.description,
    errorMessage: args.errorMessage,
    isRequired: args.isRequired,
    isInvalid: args.isInvalid,
    isDisabled: args.isDisabled,
    isReadOnly: args.isReadOnly,
    size: args.size,
    direction: args.direction,
  });

  return createRemoteDomResource(element, {
    name: "form-field",
    title: "Form Field",
    description: "Form Field with composable label and input",
  });
}

export function registerFormFieldTool(server: McpServer) {
  server.registerTool(
    "createFormField",
    {
      title: "Create Form Field",
      description:
        "Creates a form field UI component with composable label and input sections, plus optional description and error message. Supports full composition for label and input content.",
      inputSchema: formFieldElementSchema.omit({ type: true }),
    },
    async (args) => {
      const uiResource = createFormField(args);
      return {
        content: [uiResource],
      };
    }
  );
}
