import { createUIResource } from "@mcp-ui/server";
import {
  buildHeadingElement,
  type HeadingElementArgs,
} from "../elements/heading.js";

export type CreateHeadingArgs = HeadingElementArgs;

export function createHeading(args: CreateHeadingArgs) {
  return createUIResource({
    uri: `ui://heading/${Date.now()}`,
    content: {
      type: "remoteDom",
      script: JSON.stringify({
        type: "structuredDom",
        element: buildHeadingElement(args),
        framework: "react",
      }),
      framework: "react",
    },
    encoding: "text",
    metadata: {
      title: "Heading",
      description: `Heading: ${args.content}`,
      created: new Date().toISOString(),
    },
  });
}
