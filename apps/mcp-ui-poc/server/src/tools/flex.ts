import { createUIResource } from "@mcp-ui/server";
import type { ChildElement } from "../types/index.js";
import type { ElementDefinition } from "../types/remote-dom.js";
import { buildFlexElement } from "../elements/flex.js";
import { convertChildrenToElements } from "../utils/element-converter.js";

export interface CreateFlexArgs {
  content?: string;
  direction?: string;
  gap?: string;
  padding?: string;
  backgroundColor?: string;
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

export function createFlex(args: CreateFlexArgs) {
  const { content, children, ...flexArgs } = args;

  // Build children array - can contain text or nested elements
  const elementChildren: (ElementDefinition | string)[] = [];
  if (content) elementChildren.push(content);
  if (children) elementChildren.push(...convertChildrenToElements(children));

  return createUIResource({
    uri: `ui://flex/${Date.now()}`,
    content: {
      type: "remoteDom",
      script: JSON.stringify({
        type: "structuredDom",
        element: buildFlexElement({
          ...flexArgs,
          children: elementChildren.length > 0 ? elementChildren : undefined,
        }),
        framework: "react",
      }),
      framework: "react",
    },
    encoding: "text",
    metadata: {
      title: "Flex",
      description: "A flex layout component",
      created: new Date().toISOString(),
    },
  });
}
