import { createUIResource } from "@mcp-ui/server";
import {
  type ChildElement,
  generateChildrenScript,
  escapeForJS,
} from "./shared-types.js";

export interface CreateStackArgs {
  content?: string;
  direction?: string;
  gap?: string;
  width?: string;
  marginBottom?: string;
  children?: ChildElement[];
}

export function createStack(args: CreateStackArgs) {
  const {
    content = "",
    direction = "column",
    gap,
    width,
    marginBottom,
    children,
  } = args;

  // Use improved escaping for template literal safety
  const escapedContent = escapeForJS(content);

  const remoteDomScript = `
    const stack = document.createElement('nimbus-stack');
    stack.setAttribute('direction', '${direction}');
    ${gap ? `stack.setAttribute('gap', '${gap}');` : ""}
    ${width ? `stack.setAttribute('width', '${width}');` : ""}
    ${marginBottom ? `stack.setAttribute('margin-bottom', '${marginBottom}');` : ""}
    ${content ? `stack.textContent = '${escapedContent}';` : ""}
    ${children ? generateChildrenScript(children, "stack") : ""}

    root.appendChild(stack);
  `;

  return createUIResource({
    uri: `ui://stack/${Date.now()}`,
    content: {
      type: "remoteDom",
      script: remoteDomScript,
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
