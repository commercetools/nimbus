import { createUIResource } from "@mcp-ui/server";
import {
  buildTextInputElement,
  type TextInputElementArgs,
} from "../elements/text-input.js";

export type CreateTextInputArgs = TextInputElementArgs;

export function createTextInput(args: CreateTextInputArgs) {
  return createUIResource({
    uri: `ui://text-input/${Date.now()}`,
    content: {
      type: "remoteDom",
      script: JSON.stringify({
        type: "structuredDom",
        element: buildTextInputElement(args),
        framework: "react",
      }),
      framework: "react",
    },
    encoding: "text",
    metadata: {
      title: "Text Input",
      description: args.placeholder || "Text Input",
      created: new Date().toISOString(),
    },
  });
}
