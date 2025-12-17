import { createUIResource } from "@mcp-ui/server";
import {
  buildButtonElement,
  type ButtonElementArgs,
} from "../elements/button.js";

export type CreateButtonArgs = ButtonElementArgs;

export function createButton(args: CreateButtonArgs) {
  return createUIResource({
    uri: `ui://button/${Date.now()}`,
    content: {
      type: "remoteDom",
      script: JSON.stringify({
        type: "structuredDom",
        element: buildButtonElement(args),
        framework: "react",
      }),
      framework: "react",
    },
    encoding: "text",
    metadata: {
      title: "Button",
      description: `Button: ${args.label}`,
      created: new Date().toISOString(),
    },
  });
}
