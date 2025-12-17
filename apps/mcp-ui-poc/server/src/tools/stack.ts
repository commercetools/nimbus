import { createUIResource } from "@mcp-ui/server";
import type { ChildElement } from "../types/index.js";
import type { ElementDefinition } from "../types/remote-dom.js";
import { buildStackElement } from "../elements/stack.js";
import { convertChildrenToElements } from "../utils/element-converter.js";

export interface CreateStackArgs {
  content?: string;
  direction?: string;
  gap?: string;
  width?: string;
  marginBottom?: string;
  children?: ChildElement[];
  // Form support
  as?: "div" | "form";
  action?: string;
  method?: "get" | "post";
  enctype?:
    | "application/x-www-form-urlencoded"
    | "multipart/form-data"
    | "text/plain";
}

export function createStack(args: CreateStackArgs) {
  const { content, children, ...stackArgs } = args;

  // Build children array - can contain text or nested elements
  const elementChildren: (ElementDefinition | string)[] = [];
  if (content) elementChildren.push(content);
  if (children) elementChildren.push(...convertChildrenToElements(children));

  return createUIResource({
    uri: `ui://stack/${Date.now()}`,
    content: {
      type: "remoteDom",
      script: JSON.stringify({
        type: "structuredDom",
        element: buildStackElement({
          ...stackArgs,
          children: elementChildren.length > 0 ? elementChildren : undefined,
        }),
        framework: "react",
      }),
      framework: "react",
    },
    encoding: "text",
    metadata: {
      title: "Stack",
      description: "A stack layout component",
      created: new Date().toISOString(),
    },
  });
}
