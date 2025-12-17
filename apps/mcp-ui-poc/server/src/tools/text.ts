import { createUIResource } from "@mcp-ui/server";
import { buildTextElement, type TextElementArgs } from "../elements/text.js";

export type CreateTextArgs = TextElementArgs;

export function createText(args: CreateTextArgs) {
  return createUIResource({
    uri: `ui://text/${Date.now()}`,
    content: {
      type: "remoteDom",
      script: JSON.stringify({
        type: "structuredDom",
        element: buildTextElement(args),
        framework: "react",
      }),
      framework: "react",
    },
    encoding: "text",
    metadata: {
      title: "Text",
      description: "A text component",
      created: new Date().toISOString(),
    },
  });
}
