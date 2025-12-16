import { createUIResource } from "@mcp-ui/server";
import type { ChildElement } from "../types/index.js";
import { generateChildrenScript } from "../utils/children-generator.js";
import { escapeForJS } from "../utils/escape-for-js.js";

export interface CreateStackArgs {
  content?: string;
  direction?: string;
  gap?: string;
  width?: string;
  marginBottom?: string;
  children?: ChildElement[];
  // Form support
  as?: "div" | "form";
  // action is optional - if omitted, form data will be displayed in a dialog
  action?: string;
  method?: "get" | "post";
  enctype?:
    | "application/x-www-form-urlencoded"
    | "multipart/form-data"
    | "text/plain";
}

export function createStack(args: CreateStackArgs) {
  const {
    content = "",
    direction = "column",
    gap,
    width,
    marginBottom,
    children,
    as = "div",
    action,
    method,
    enctype,
  } = args;

  // Use improved escaping for template literal safety
  const escapedContent = escapeForJS(content);
  const escapedAction = action ? escapeForJS(action) : undefined;

  const remoteDomScript = `
    const stack = document.createElement('nimbus-stack');
    stack.setAttribute('direction', '${direction}');
    ${gap ? `stack.setAttribute('gap', '${gap}');` : ""}
    ${width ? `stack.setAttribute('width', '${width}');` : ""}
    ${marginBottom ? `stack.setAttribute('margin-bottom', '${marginBottom}');` : ""}
    ${as === "form" ? `stack.setAttribute('as', 'form');` : ""}
    ${escapedAction ? `stack.setAttribute('action', '${escapedAction}');` : ""}
    ${method ? `stack.setAttribute('method', '${method}');` : ""}
    ${enctype ? `stack.setAttribute('enctype', '${enctype}');` : ""}
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
