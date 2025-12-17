import { createUIResource } from "@mcp-ui/server";
import type { ChildElement } from "../types/index.js";
import { buildFormFieldElement } from "../elements/form-field.js";
import { convertChildrenToElements } from "../utils/element-converter.js";

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

export function createFormField(args: CreateFormFieldArgs) {
  return createUIResource({
    uri: `ui://form-field/${Date.now()}`,
    content: {
      type: "remoteDom",
      script: JSON.stringify({
        type: "structuredDom",
        element: buildFormFieldElement({
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
        }),
        framework: "react",
      }),
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
