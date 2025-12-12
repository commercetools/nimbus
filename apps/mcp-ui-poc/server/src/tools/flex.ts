import { createUIResource } from "@mcp-ui/server";
import {
  type ChildElement,
  generateChildrenScript,
  escapeForJS,
} from "./shared-types.js";

export interface CreateFlexArgs {
  content?: string;
  direction?: string;
  gap?: string;
  padding?: string;
  backgroundColor?: string;
  children?: ChildElement[];
}

export function createFlex(args: CreateFlexArgs) {
  const {
    content = "",
    direction = "row",
    gap,
    padding,
    backgroundColor,
    children,
  } = args;

  // Use improved escaping for template literal safety
  const escapedContent = escapeForJS(content);

  const remoteDomScript = `
    const flex = document.createElement('nimbus-flex');
    flex.setAttribute('direction', '${direction}');
    ${gap ? `flex.setAttribute('gap', '${gap}');` : ""}
    ${padding ? `flex.setAttribute('padding', '${padding}');` : ""}
    ${backgroundColor ? `flex.setAttribute('background-color', '${backgroundColor}');` : ""}
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
