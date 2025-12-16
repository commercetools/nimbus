import { createUIResource } from "@mcp-ui/server";
import type { ChildElement } from "../types/index";
import { generateChildrenScript } from "../utils/children-generator";
import { escapeForJS } from "../utils/escape-for-js";

export interface CreateFlexArgs {
  content?: string;
  direction?: string;
  gap?: string;
  padding?: string;
  backgroundColor?: string;
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

export function createFlex(args: CreateFlexArgs) {
  const {
    content = "",
    direction = "row",
    gap,
    padding,
    backgroundColor,
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
    const flex = document.createElement('nimbus-flex');
    flex.setAttribute('direction', '${direction}');
    ${gap ? `flex.setAttribute('gap', '${gap}');` : ""}
    ${padding ? `flex.setAttribute('padding', '${padding}');` : ""}
    ${backgroundColor ? `flex.setAttribute('background-color', '${backgroundColor}');` : ""}
    ${as === "form" ? `flex.setAttribute('as', 'form');` : ""}
    ${escapedAction ? `flex.setAttribute('action', '${escapedAction}');` : ""}
    ${method ? `flex.setAttribute('method', '${method}');` : ""}
    ${enctype ? `flex.setAttribute('enctype', '${enctype}');` : ""}
    ${content ? `flex.textContent = '${escapedContent}';` : ""}
    ${children ? generateChildrenScript(children, "flex") : ""}

    root.appendChild(flex);
  `;

  return createUIResource({
    uri: `ui://flex/${Date.now()}`,
    content: {
      type: "remoteDom",
      script: remoteDomScript,
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
